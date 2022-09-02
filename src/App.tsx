import React, { useState, useRef } from 'react';
import ThreeCanvas from "./components/ThreeCanvas";
import SettingsForm from "./components/SettingsForm";
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
  const [velocity, setVelocity] = useState<number>(0)//(0.001);
  const [numberOfColors, setNumberOfColors] = useState<number>(10);
  const [groups, setGroups] = useState<THREE.Group[]>([]);

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
    const meshes = generateGeometriesByNumberOfColors(imageDomId, numberOfColors);
    const groups = groupsByColor(meshes, false);
    setGroups(groups);
  }


  return (
    <div className="App">
        <SettingsForm
          velocity={velocity}
          setVelocity={setVelocity}
          numberOfColors={numberOfColors}
          setNumberOfColors={setNumberOfColors}
          groups={groups}
          updateGroupPosition={updateGroupPosition}
          onLoadImage={onLoadImage}
        />
        <canvas id="canvasOutput" />
        <ThreeCanvas groups={groups} width={500} height={500} velocity={velocity} />
    </div>
  );
}

export default App;
