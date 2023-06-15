import React, { useState, useRef, useEffect, RefObject } from 'react';
import { format as formatFns } from "date-fns";
import { useWindowSize } from "rooks";
import ThreeCanvas from "./components/ThreeCanvas";
import SettingsForm from "./components/SettingsForm";
import { ThreeCanvasActions } from "./interfaces";
import * as THREE from 'three';
import {
  generateGeometriesByNumberOfColors,
  groupsByColor
} from "colors2geometries";

function App() {
  const canvasActionsRef = useRef<ThreeCanvasActions| null>(null);
  const { innerWidth, innerHeight } = useWindowSize();
  const refContainer = useRef<HTMLDivElement>(null);
  const [widthContainer, setWidthContainer] = useState<number>(500);
  const [heightContainer, setHeightContainer] = useState<number>(500);
  const [error, setError] = useState<string|null>(null);

  const [velocity, setVelocity] = useState<number>(0);
  const [numberOfColors, setNumberOfColors] = useState<number>(10);
  const [groups, setGroups] = useState<THREE.Group[]>([]);

  useEffect(() => {
    if(refContainer.current && innerHeight && innerWidth) {
      const rect = refContainer.current.getBoundingClientRect();
      setWidthContainer(rect.width);
      // make sure the height is not too important
      setHeightContainer(innerHeight);
    }
  }, [innerWidth, innerHeight, refContainer]);

  function saveImage(refAnchor: RefObject<HTMLAnchorElement>) {
    if(canvasActionsRef.current && refAnchor.current) {
      const format = "png";
      const dataURL = canvasActionsRef.current.takeScreenshot(format);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (refAnchor.current as any).download = `${dateString}-image2geometries.${format}`;
      refAnchor.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
  }

  function updateGroupPosition(groupId: number, z: number) {
    const newGroups = groups.map(group => {
      if(group.id === groupId) {
        group.position.z = z;
      }
      return group;
    });
    setGroups(newGroups);
  }

  function onLoadImage(imageDomId: string) {
    try {
      const meshes = generateGeometriesByNumberOfColors(imageDomId, numberOfColors);
      console.log(meshes)
      const groups = groupsByColor(meshes, false);
      setGroups(groups);
      setError(null);
    } catch(error) {
      console.log(error);
      setError("The image could not be converted with theses parameters. Try with more or less colors or reload the page and try again");
    }
  }


  return (
    <div ref={refContainer}>
        <SettingsForm
          velocity={velocity}
          setVelocity={setVelocity}
          numberOfColors={numberOfColors}
          setNumberOfColors={setNumberOfColors}
          groups={groups}
          updateGroupPosition={updateGroupPosition}
          onLoadImage={onLoadImage}
          saveImage={saveImage}
          errorGeneration={error}
        />
        <ThreeCanvas
          ref={canvasActionsRef}
          groups={groups}
          width={widthContainer}
          height={heightContainer}
          velocity={velocity}
        />
    </div>
  );
}

export default App;
