import React from 'react';
import ZoomingNews from '../bottom/zooming-news';

interface TopMainProps {
  width: string;
  height: string;
  backgroundColor: string;
  text : string;
  fontweight?: string;
  fontSize?: string;
}

const TopTitle: React.FC<TopMainProps> = ({ width, height, backgroundColor, text, fontweight, fontSize }) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize,
      }}
    >
      <ZoomingNews text={text} fontWeight={fontweight} fontSize={fontSize} />
    </div>
  );
};

export default TopTitle;
