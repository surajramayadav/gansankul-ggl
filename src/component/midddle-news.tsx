import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

const MiddleNews = () => {
  const [config, setConfig] = useState<null | {
    text: string;
    width: string;
    height: string;
    backgroundColor: string;
    fontWeight: string;
    visible: boolean;
  }>(null);

  const defaultStyle = {
    width: '1000px',
    height: '200px',
  };

  useEffect(() => {
    const sectionRef = ref(database, 'sections/middle');
    const unsubscribe = onValue(sectionRef, (snapshot) => {
      const data = snapshot.val();

      if (!data || data.visible === false) {
        setConfig(null);
        return;
      }

      setConfig({
        text: data.text || '',
        width: data.width || '1000px',
        height: data.height || '200px',
        backgroundColor: data.backgroundColor || 'red',
        fontWeight: data.fontWeight || 'normal',
        visible: data.visible !== false,
      });
    });

    return () => unsubscribe();
  }, []);

  if (!config) {
    return (
      <div
        style={{
          ...defaultStyle,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (!config.visible) {
    return (
      <div
        style={{
          width: config.width,
          height: config.height,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
        color: 'white',
        padding: '20px',
        boxSizing: 'border-box',
        fontWeight: config.fontWeight as any,
        whiteSpace: 'nowrap',
      }}
    >
      <iframe
        src="https://player.vimeo.com/video/1098251986?background=1&autoplay=1&muted=1&controls=0&title=0&byline=0&portrait=0"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ borderRadius: '0px' }}
      ></iframe>
    </div>
  );
};

export default MiddleNews;
