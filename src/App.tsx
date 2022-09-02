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
    <div className="App">
        <input type='file' accept="image/*" /*className="hidden"*/ onChange={loadImage} />
        <img className="hidden" id="imageSrc" alt="No Image" ref={ref} />
        <div>
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
        <canvas id="canvasOutput" />
        {
          loading ?
            <button className="btn loading">loading</button>
          : <ThreeCanvas groups={groups} width={500} height={500} velocity={velocity} />
        }
    </div>
  );
}

export default App;
