import React, { useState, useRef } from 'react';
import ThreeCanvas from "./components/ThreeCanvas";
import CustomRange from "./components/CustomRange";
import * as THREE from 'three';
import {
  generateGeometriesByNumberOfColors,
  groupsByColor
} from "colors2geometries";

/*
function saveAsImage() {
        var imgData, imgNode;

        try {
            var strMime = "image/jpeg";
            imgData = renderer.domElement.toDataURL(strMime);

            saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

        } catch (e) {
            console.log(e);
            return;
        }

    }

    var saveFile = function (strData, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

*/

function App() {
  const ref = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [velocity, setVelocity] = useState<number>(0)//(0.001);
  const [numberOfColors, setNumberOfColors] = useState<number>(10);
  const [groups, setGroups] = useState<THREE.Group[]>([]);

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      setLoading(true);
      ref.current.src = URL.createObjectURL(event.target.files[0]);
      ref.current.onload =  (event: any) => {
        if(!ref.current) {
          return;
        }
        const meshes = generateGeometriesByNumberOfColors(ref.current.id, numberOfColors);
        const groups = groupsByColor(meshes, false);
        setGroups(groups);
        setLoading(false);
      };
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


  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">

        <div className="w-full navbar bg-base-300">
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">Navbar Title</div>
        </div>
        <div className="App">
            <input type='file' accept="image/*" /*className="hidden"*/ onChange={loadImage} />
            <img className="hidden" id="imageSrc" alt="No Image" ref={ref} />
            <canvas id="canvasOutput" />
            {
              loading ?
                <button className="btn loading">loading</button>
              : <ThreeCanvas groups={groups} width={500} height={500} velocity={velocity} />
            }
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
          <li>
                <input
                  type="range"
                  className="range range-primary"
                  min={0}
                  max={10}
                  value={velocity * 1000}
                  onChange={(e) => setVelocity(parseInt(e.target.value,10)/1000)}
                />
                <label>Velocity : {velocity * 1000}</label>

          </li>
          <li>
                <input
                  type="range"
                  className="range range-primary"
                  min={1}
                  max={20}
                  value={numberOfColors}
                  onChange={(e) => setNumberOfColors(parseInt(e.target.value,10))}
                />
                <label>Number Of Colors : {numberOfColors}</label>

          </li>
          {
            groups.map(group => {
              return (
                <li key={group.id}>
                  <CustomRange
                    label={group.id.toString()}
                    min={-2}
                    max={2}
                    step={0.01}
                    value={group.position.z}
                    onChange={(value) => updateGroupPosition(group.id, value )}
                  />
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
