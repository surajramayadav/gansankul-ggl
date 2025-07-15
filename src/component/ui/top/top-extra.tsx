import { child } from 'firebase/database';
import React, { Children } from 'react';

interface TopExtraProps {
  width: string;
  height: string;
  backgroundColor: string;
  top: string;
  children?: React.ReactNode;
}

const TopExtraComponent: React.FC<TopExtraProps> = ({ width, height, backgroundColor, top, children }) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: 'absolute',
        top,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >{children}</div>
  );
};

export default TopExtraComponent;
