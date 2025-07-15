import React from 'react';

interface Props {
  width: string;
  height: string;
  backgroundColor: string;
  top: string;
}

const TopOnlyVideoComponent: React.FC<Props> = ({ width, height, backgroundColor, top }) => {
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
    >
      <iframe
        src="https://player.vimeo.com/video/1098251986?autoplay=1&muted=1&controls=0"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default TopOnlyVideoComponent;
