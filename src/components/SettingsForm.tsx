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
  const [showGroupsZ, setShowGroupZ] = useState<boolean>(true);

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

  function alignGroup() {
    groups.forEach((group, index) => {
      updateGroupPosition(group.id, index / 1000);
    });
  }

  return (
    <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full">
      <div className="overflow-auto card bg-base-100 shadow-2xl w-full" style={{maxHeight: "50vh"}}>
        <div className="card-body p-3 flex flex-col gap-5">
          <input type='file' accept="image/*" /*className="hidden"*/ onChange={loadImage} />
          <img className="hidden" id="imageSrc" alt="No Image" ref={ref} />
          { loading ?
              <button className="btn loading">loading</button>
            :
             <>
                <CustomRange
                  label={"Velocity"}
                  min={0}
                  max={0.025}
                  step={0.001}
                  value={velocity}
                  onChange={(value) => setVelocity(value)}
                />
                <div>
                  <input
                    type="range"
                    className="range range-primary"
                    min={1}
                    max={20}
                    value={numberOfColors}
                    onChange={(e) => setNumberOfColors(parseInt(e.target.value,10))}
                  />
                  <label>Number Of Colors : {numberOfColors}</label>
                </div>
              <div className="flex flex-col gap-5">
                <button className="btn btn-primary" onClick={alignGroup}>
                  align all groups
                </button>
              {
                  showGroupsZ ?
                    groups.map(group => {
                      return (
                          <CustomRange
                            label={""}
                            min={-2}
                            max={2}
                            step={0.01}
                            value={group.position.z}
                            onChange={(value) => updateGroupPosition(group.id, value )}
                          />
                      )
                    })
                  :
                  <button className="btn btn-square" onClick={() => setShowGroupZ(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hide
                  </button>
              }
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;