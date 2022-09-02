import React, { useState, useRef } from 'react';
import CustomRange from "./CustomRange";
import * as THREE from 'three';

interface SettingsFormProps {
  velocity: number;
  setVelocity: (newVelocity: number) => void;
  numberOfColors: number;
  setNumberOfColors: (newNumberOfColor: number) => void;
  groups: THREE.Group[];
  updateGroupPosition: (groupId: number, value: number) => void;
  onLoadImage: (imageDomId: string) => void;
}


function SettingsForm({
  velocity,
  setVelocity,
  numberOfColors,
  setNumberOfColors,
  groups,
  updateGroupPosition,
  onLoadImage,
} : SettingsFormProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasEditable, setHasEditable] = useState<boolean>(false);

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      setLoading(true);
      ref.current.src = URL.createObjectURL(event.target.files[0]);
      ref.current.onload =  (event: any) => {
        if(!ref.current) {
          return;
        }
        onLoadImage(ref.current.id);
        setLoading(false);
      };
    }
  }

  return (
    <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full">
    <div className="card bg-base-100 shadow-2xl w-full">
    <div className="card-body p-3 flex flex-col gap-5">
      <input type='file' accept="image/*" /*className="hidden"*/ onChange={loadImage} />
      <img className="hidden" id="imageSrc" alt="No Image" ref={ref} />
      { loading ?
          <button className="btn loading">loading</button>
        :
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
      }
    </div>
    </div>
    </div>
  );
}

export default SettingsForm;