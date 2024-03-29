import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useAnimationFrame from "../customHooks/useAnimationFrame";
import { useFullscreen } from "rooks";
import { ThreeCanvasActions } from "../interfaces";
import { create3dPointLighting, createPlane, createHelpers, createLights } from "./threejsUtils";

interface ThreeCanvasProps {
  groups: THREE.Group[];
  width: number;
  height: number;
  velocity: number;
}

const MAX_Z = 1.25;
const MIN_Z = -1.25;

const DEPTH = 0.5;


const ThreeCanvas = forwardRef<ThreeCanvasActions, ThreeCanvasProps>(( { groups, width, height, velocity = 0.001}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef(new THREE.Scene());
  const groupRef = useRef<THREE.Group|null>(null);
  const groupRefDirections = useRef<number[]>([]);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer| null>(null);
  const { play, stop } = useAnimationFrame(animate);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: canvasRef });


  useImperativeHandle(ref, () => ({
      takeScreenshot(imageFormat: string): string {
        if(renderer.current) {
          return renderer.current.domElement.toDataURL(`image/${imageFormat}`);
        }
        throw new Error("Cannot find renderer");
      }

  }));


  useEffect(() => {
    if(canvasRef.current && camera.current && renderer.current && width && height) {
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
      //magic number here
      renderer.current.setSize(width, height);
    }
  }, [width, height]);



  useEffect(() => {
    if(canvasRef.current) {
      // Sizes
      const sizes = {
          width: window.innerWidth,
          height: window.innerHeight
      }

      scene.current.background = new THREE.Color( 0x3c3c3c );


      // Camera
      camera.current = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
      camera.current.position.set( 0, 0.75, 2 );
      scene.current.add(camera.current);


      // Renderer
      renderer.current = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          preserveDrawingBuffer: true
      });

      renderer.current.setSize(sizes.width, sizes.height);

      // Controls
      const controls = new OrbitControls( camera.current, renderer.current.domElement );
      controls.enablePan = true;

      scene.current.add(createPlane());
      //scene.current.add(create3dPointLighting());
      scene.current.add(createLights());
      //scene.current.add(...createHelpers());
    }
  }, [canvasRef]);

  useEffect(() => {
    if(groups) {
      // clear scenes
      while(scene.current.children.length > 0) {
        scene.current.remove(scene.current.children[0]);
      }
      groupRef.current = null;

      scene.current.add(createPlane());
      //scene.current.add(create3dPointLighting());
      scene.current.add(createLights());
      //scene.current.add(...createHelpers());
      scene.current.add(generateFlagsByPixelsColorOccurance(groups));

    }
  }, [groups]);

  useEffect(() => {
    stop();
    play();
  }, [velocity])

  function animate(deltaTime: number) {
    if(renderer.current && scene.current && camera.current) {
      renderer.current.render(scene.current, camera.current);
      if(groupRef.current) {
        groupRef.current.children.forEach((flagItem, index) => {
          if((flagItem.position.z + DEPTH) >= MAX_Z) {
            groupRefDirections.current[index] = -1;
          }
          else if((flagItem.position.z - DEPTH) <= MIN_Z) {
            groupRefDirections.current[index] = 1;
          }
          flagItem.position.z += groupRefDirections.current[index] * velocity;
        });
      }
    }
  }

  // find all the colors in the image and run findcountours based on this colors
  function generateFlagsByPixelsColorOccurance(groups: THREE.Group[]) : THREE.Group {
    let group = new THREE.Group();
    group.name = "MY_FLAG_GROUP";
    group.add(...groups);

    const bbox = new THREE.Box3().setFromObject(group);
    group.position.set(-(bbox.min.x + bbox.max.x) / 2, -(bbox.min.y + bbox.max.y), -(bbox.min.z + bbox.max.z) / 2);
    // add ref for the render
    groupRef.current = group;
    // store the direction for move
    groupRefDirections.current = group.children.map(flagItem => 1);

    return group;
  }

  return (
    <canvas ref={canvasRef} className="webgl" onDoubleClick={e => toggleFullscreen()}></canvas>
  );
});

export default ThreeCanvas;
