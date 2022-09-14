import React, { useState, useRef, useEffect } from 'react';
import { useWindowSize } from "rooks";
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
  const { innerWidth, innerHeight } = useWindowSize();
  const refContainer = useRef<HTMLDivElement>(null);
  const [widthContainer, setWidthContainer] = useState<number>(500);
  const [heightContainer, setHeightContainer] = useState<number>(500);

  const [velocity, setVelocity] = useState<number>(0);
  const [numberOfColors, setNumberOfColors] = useState<number>(18);
  const [groups, setGroups] = useState<THREE.Group[]>([]);

  useEffect(() => {
    if(refContainer.current && innerHeight && innerWidth) {
      const rect = refContainer.current.getBoundingClientRect();
      setWidthContainer(rect.width);
      // make sure the height is not too important
      setHeightContainer(innerHeight);
    }
  }, [innerWidth, innerHeight, refContainer]);

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
    <div ref={refContainer}>
        <SettingsForm
          velocity={velocity}
          setVelocity={setVelocity}
          numberOfColors={numberOfColors}
          setNumberOfColors={setNumberOfColors}
          groups={groups}
          updateGroupPosition={updateGroupPosition}
          onLoadImage={onLoadImage}
        />
        <ThreeCanvas groups={groups} width={widthContainer} height={heightContainer} velocity={velocity} />
    </div>
  );
}

export default App;
