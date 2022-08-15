import React, { useState, useRef } from 'react';
import ColorThief from 'colorthief';
import logo from './logo.svg';
import useOpenCV from "./customHooks/useOpenCV";
import ThreeCanvas from "./components/ThreeCanvas";
import * as THREE from 'three';
import {
  generateGeometriesByNumberOfColors
} from "colors2geometries";
import './App.css';
import cv, { Mat} from "opencv-ts";

const PALETTE_BASE_COLOR = 10;
type pixel = [number, number, number, number];
/*
export function generateGeometriesByNumberOfColors(imageDomId: string, numberOfColors: number = 20) : THREE.Mesh[] {
    const src = cv.imread(imageDomId);
    const image = document.getElementById(imageDomId);
    if(!image) {
        throw new Error(`Cannot find the element with the id '${imageDomId}'`)
    }
    console.log("fdfkdjfkdj")
    const palette = generateColorPalette(image as HTMLImageElement,numberOfColors);
    const quantifiedImage = imageQuantified(src, palette);
    return fromMatToGeometries(quantifiedImage, palette);
}


function generateColorPalette(image: HTMLImageElement, paletteSize: number  = PALETTE_BASE_COLOR) : pixel[] {
  let colorThief = new ColorThief();
  const paletteRGB : Array<[number, number, number]> = colorThief.getPalette(image, paletteSize);
  return paletteRGB.map(([r,g,b]) => [r,g,b, 255]);
}

function distance([x1, y1, z1, a1]: pixel, [x2, y2, z2, a2]: pixel): number {
  const deltaR = (x1 - x2);
  const deltaG = (y1 - y2);
  const deltaB = (z1 - z2);
  const deltaA = (a1 - a2);

  const rgbDistanceSquared = (deltaR * deltaR + deltaG * deltaG + deltaB * deltaB) / 3.0;
  return deltaA * deltaA / 2.0 + rgbDistanceSquared * a1 * a2 / (255 * 255);
}

function getColor(image: Mat, x: number, y: number) : pixel {
    const { data, cols } = image;
    const channels = image.channels();

    const R = data[y * cols * channels + x * channels];
    const G = data[y * cols * channels + x * channels + 1];
    const B = data[y * cols * channels + x * channels + 2];
    const A = data[y * cols * channels + x * channels + 3];
    return [R, G, B, A];
    //return [R, G, B];
}

function findNearestColor(pixel: pixel, palette: pixel[]) : pixel {
  let nearestColor: pixel = [0,0,0,0];
  let nearestDistance = distance([0, 0, 0, 0], [255, 255, 255, 255]);
  palette.forEach(color => {
    const currentDistance = distance(color, pixel)
    if(nearestDistance > currentDistance) {
      nearestDistance = currentDistance;
      nearestColor = color;
    }
  });
  return nearestColor;
}

function imageQuantified(image: Mat, palette: pixel[]) : Mat {
  const target = new cv.Mat.zeros(image.rows, image.cols, cv. CV_8UC4);
  const channels = target.channels();
  const { cols, rows } = target;

  for(let x = 0; x < cols; x++) {
    for(let y = 0; y < rows; y++) {
      const [R, G, B, A] = findNearestColor(getColor(image, x,y), palette);
      target.data[y * cols * channels + x * channels] = R;
      target.data[y * cols * channels + x * channels + 1] = G;
      target.data[y * cols * channels + x * channels + 2] = B;
      target.data[y * cols * channels + x * channels + 3] = A;
    }
  }
  return target;
}*/


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
        const meshes = generateGeometriesByNumberOfColors(ref.current.id, 10);
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
