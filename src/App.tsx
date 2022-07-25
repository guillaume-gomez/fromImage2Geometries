import React, { useState, useRef } from 'react';
import ColorThief from 'colorthief';
import logo from './logo.svg';
import useOpenCV from "./customHooks/useOpenCV";
import ThreeCanvas from "./components/ThreeCanvas";
import * as THREE from 'three';
import {
  generateGeometriesByColorOccurance as utilGenerateFlagsByPixelsColorOccurance
} from "colors2geometries";
import './App.css';
import cv, { Mat} from "opencv-ts";

const PALETTE_BASE_COLOR = 10;
type pixel = [number, number, number];

function generateColorPalette(image: HTMLImageElement, paletteSize: number  = PALETTE_BASE_COLOR) : pixel[] {
  let colorThief = new ColorThief();
  return colorThief.getPalette(image, paletteSize);
}

function distance([x1, y1, z1]: pixel, [x2, y2, z2]: pixel): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function getColor(image: Mat, x: number, y: number) : pixel {
    const { data, cols } = image;
    const channels = image.channels();

    const R = data[y * cols * channels + x * channels];
    const G = data[y * cols * channels + x * channels + 1];
    const B = data[y * cols * channels + x * channels + 2];
    const A = data[y * cols * channels + x * channels + 3];
    //return [R, G, B, A];
    return [R, G, B];
}

function findNearestColor(pixel: pixel, palette: pixel[]) : pixel {
  let nearestColor: pixel = palette[0];
  let nearestDistance = 255 * 255 * 255;
  palette.forEach(color => {
    const currentDistance = distance(color, pixel)
    if(nearestDistance > currentDistance) {
      nearestDistance = currentDistance;
      nearestColor = color;
    }
  });
  return nearestColor;
}

function imageQuantified(image: HTMLImageElement, paletteSize: number) : Mat {
  const palette = generateColorPalette(image, paletteSize);
  const src = cv.imread(image);
  const target = new cv.Mat.zeros(src.rows, src.cols, cv. CV_8UC4);
  const channels = target.channels();
  const { cols, rows } = target;

  for(let x = 0; x < cols; x++) {
    for(let y = 0; y < rows; y++) {
      const [R, G, B] = findNearestColor(getColor(src, x,y), palette);
      target.data[y * cols * channels + x * channels] = R;
      target.data[y * cols * channels + x * channels + 1] = G;
      target.data[y * cols * channels + x * channels + 2] = B;
      target.data[y * cols * channels + x * channels + 3] = 255;
    }
  }
  return target;
}


function App() {
  const ref = useRef<HTMLImageElement>(null);
  const [selectedFile, setSelectedFile] = useState();
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
      ref.current.onload =  (event: any) => {
        if(!ref.current) {
          return;
        }
        const src = cv.imread(ref.current);
        let image = imageQuantified(ref.current, 3);
        cv.imshow('canvasOutput', image);

        const meshes = utilGenerateFlagsByPixelsColorOccurance("canvasOutput");
        console.log(meshes);
        setMeshes(meshes);

      };
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <input type='file' accept="image/*" className="hidden" onChange={loadImage} />
        <img /*className="hidden"*/ id="imageSrc" alt="No Image" ref={ref} />
        <canvas id="canvasOutput" />
        <ThreeCanvas meshes={meshes} width={500} height={500} />
      </header>
    </div>
  );
}

export default App;
