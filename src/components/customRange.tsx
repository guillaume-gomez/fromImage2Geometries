import React from 'react';

interface CustomRangeProps {
  value: number;
  onChange: (newValue: number) => void;
}


function CustomRange({ value, onChange } : CustomRangeProps) {
  return (
    <div
        className="form-control w-full max-w-xs gap-1"
        id="select-container"
    >
      <input className="range range-primary" type="range" min={0} max={255} value={value} onChange={(event) => onChange(parseInt(event.target.value, 10)) }/>
      <input
        type="text"
        className="input input-bordered input-primary w-16"
        onChange={event => onChange(parseInt(event.target.value,10))}
        value={value}
      />
    </div>
  );
}

export default CustomRange;