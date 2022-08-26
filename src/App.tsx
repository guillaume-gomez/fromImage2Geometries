import React, { useState, useRef } from 'react';
import ThreeCanvas from "./components/ThreeCanvas";
import * as THREE from 'three';
import {
  generateGeometriesByNumberOfColors
} from "colors2geometries";
import './App.css';

function App() {
  const ref = useRef<HTMLImageElement>(null);
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
