import React, { useState, useRef, useEffect, RefObject } from 'react';
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
  saveImage: (ref: RefObject<HTMLAnchorElement>) => void;
  error: string |null;
}

function toObjectUrl(url: string) {
  return fetch(url)
    .then((response)=> {
      return response.blob();
    })
    .then(blob=> {
      return URL.createObjectURL(blob);
    });
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
  error
} : SettingsFormProps) {
  const ref = useRef<HTMLImageElement>(null);
  const refAnchor = useRef<HTMLAnchorElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string|null>(null);
  const [uploadOption, setUploadOption] = useState<boolean>(true);
  const [hasEditable, setHasEditable] = useState<boolean>(false);
  const [showGroupsZ, setShowGroupZ] = useState<boolean>(true);

  async function loadImageFromUrl(event: React.ChangeEvent<HTMLInputElement>) {
    const data = await toObjectUrl(event.target.value);
    setImageData(data);
  }

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files) {
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

  return (
    <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full">
      <div className="overflow-auto card bg-base-100 shadow-2xl w-full" style={{maxHeight: "50vh"}}>
        <div className="card-body p-3 flex flex-col gap-5">
          <div className="flex flex-col bg-neutral-focus gap-2 items-center rounded p-2">
            <div className="flex items-center gap-2 self-end">
              <span>{uploadOption ? "Upload an image" : "Paste an image url"}</span>
              <input type="checkbox" className="toggle" checked={uploadOption} onClick={() => setUploadOption(!uploadOption)} />
            </div>
            {
              uploadOption ?
                <input type='file'
                  className="w-full h-12"
                  accept="image/*"
                  onChange={loadImage}
                />
                :
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  placeholder="https://www.lequipe.fr/_medias/img-photo-jpg/a-reau-l-equipe/1500000001682641/0:0,1998:1332-828-552-75/170c4"
                  onBlur={loadImageFromUrl}
                />

            }
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
            <img className="hidden" id="imageSrc" alt="No Image" ref={ref} />
            <button className="btn btn-primary" onClick={generate} disabled={imageData === null}>Generate 🧪</button>
            {error && <p className="text-error text-xs">{error}</p>}
          </div>
          <span className="text-xs">Double click to switch to fullscreen</span>
          <div className="bg-neutral-focus rounded p-2 flex flex-col">
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
                <div className="flex flex-col gap-5">
                  <button className="btn btn-outline btn-primary" onClick={alignGroup}>
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
          <a ref={refAnchor} className="btn btn-secondary" onClick={() => saveImage(refAnchor)}>Take Screenshot 📷</a>
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;