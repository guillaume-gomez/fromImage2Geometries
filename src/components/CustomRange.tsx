import React, { useState } from 'react';

interface CustomRangeProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label: string
}


function CustomRange({ min, max, step, label, value, onChange } : CustomRangeProps) {
  const [hasEditable, setHasEditable] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="range"
          className="range range-primary"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        {
          hasEditable ?
            <input
              className="input input-primary input-xs"
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              onBlur={() => setHasEditable(false)}
            />
          :
          <div
            className="badge badge-lg"
            onClick={() => setHasEditable(true)}
          >
            {value.toFixed(3)}
          </div>
        }
      </div>
      <label className="self-start">{label}</label>
    </div>
  );
}

export default CustomRange;