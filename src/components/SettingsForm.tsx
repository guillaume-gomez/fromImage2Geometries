import React, { useState, useRef, RefObject } from 'react';
import CustomRange from "./CustomRange";
import CollapsibleCard from "./CollapsibleCard";
import UploadButton from "./UploadButton";
import * as THREE from 'three';

interface SettingsFormProps {
  velocity: number;
  setVelocity: (newVelocity: number) => void;
  numberOfColors: number;
  setNumberOfColors: (newNumberOfColor: number) => void;
  groups: THREE.Group[];
  updateGroupPosition: (groupId: number, value: number) => void;
  onLoadImage: (imageDomId: string) => void;
  saveImage: (ref: RefObject<HTMLAnchorElement>) => void;
  errorGeneration: string |null;
}

function SettingsForm({
  velocity,
  setVelocity,
  numberOfColors,
  setNumberOfColors,
  groups,
  updateGroupPosition,
  onLoadImage,
  saveImage,
  errorGeneration
} : SettingsFormProps) {
  const ref = useRef<HTMLImageElement>(null);
  const refAnchor = useRef<HTMLAnchorElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string|null>(null);

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files) {
      // TODO resize image if too heavy
      setImageData(URL.createObjectURL(event.target.files[0]));
    }
  }

  function generate() {
    if(ref.current && imageData) {
      setLoading(true);
      ref.current.src = imageData;
      ref.current.onload = () => {
        if(!ref.current) {
          return;
        }
        onLoadImage(ref.current.id);
        setLoading(false);
      }
    }
  }

  function alignGroup() {
    groups.forEach((group, index) => {
      updateGroupPosition(group.id, index / 1000);
    });
  }

  function renderSettings() {
    return (
      <CollapsibleCard
        title="Settings"
        intialState={false}
      >
        <div className="flex flex-col bg-neutral-focus gap-4 items-center rounded">
          <div className="flex flex-col items-center gap-2 w-full">
            <UploadButton  onChange={loadImage}/>
          </div>
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
          <img className="hidden" id="imageSrc" alt="Store the result of the upload. Then the lib convert it to geometries" ref={ref} />
          {
            loading ?
              <button className="btn loading">loading</button>
              :
              <button className="btn btn-primary" onClick={generate} disabled={imageData === null}>Generate 🧪</button>
          }
          {errorGeneration && <p className="text-error text-xs">{errorGeneration}</p>}
        </div>
      </CollapsibleCard>
    );
  }

  function renderOptions() {
    return (
      <CollapsibleCard
            title="Options"
        intialState={true}
      >
          <CustomRange
            label={"Velocity"}
            min={0}
            max={0.025}
            step={0.001}
            value={velocity}
            onChange={(value) => setVelocity(value)}
          />
          <div className="flex flex-col gap-5">
            <button className="btn btn-outline btn-primary" onClick={alignGroup}>
              align all groups
            </button>
            {
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
            }
          </div>
        </CollapsibleCard>
    );
  }

  return (
    <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full">
      <div className="overflow-auto card bg-base-100 shadow-2xl w-full" style={{maxHeight: "60vh"}}>

        <div className="card-body p-3 flex flex-col gap-3">
          {renderSettings()}
          <span className="text-xs">Double click to switch to fullscreen</span>
          {renderOptions()}
          <a ref={refAnchor} className="btn btn-secondary" onClick={() => saveImage(refAnchor)}>Take Screenshot 📷</a>
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;