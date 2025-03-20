import React, { useState } from 'react';

interface CollapsibleCardProps {
  title: string;
  intialState: boolean;
  children: React.ReactNode
}


function CollapsibleCard({ title, intialState, children } : CollapsibleCardProps) {
  const [collapse, setCollapse] = useState<boolean>(intialState);
  return (
    <div
      className="collapse collapse-arrow border bg-base-300 border-0 rounded-xl py-2"
    >
      <input type="checkbox" checked={collapse} onChange={() => setCollapse(!collapse)}/>
      <div className="collapse-title uppercase">
        {title}
      </div>
      {
        !collapse &&
        <div className="px-4">
          {children}
        </div>
      }
    </div>
  );
}

export default CollapsibleCard;