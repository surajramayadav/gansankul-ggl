import React, { useEffect, useRef, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import ZoomingNews from './ui/bottom/zooming-news';

const FlipCard = ({ showFront }: { showFront: boolean }) => {
  const sharedSideStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1',
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 1s',
        transform: showFront ? 'rotateY(0deg)' : 'rotateY(180deg)',
      }}
    >
      <div style={sharedSideStyle}>
        <span style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>GaneshG</span>
        <span
          style={{
            fontSize: 35,
            fontWeight: 'bolder',
            color: 'white',
            backgroundColor: 'red',
            padding: '2px 12px',
            borderRadius: '6px',
            letterSpacing: '4px',
          }}
        >
          LIVE
        </span>
      </div>
      <div style={{ ...sharedSideStyle, transform: 'rotateY(180deg)' }}>
        <span style={{ fontSize: 33, fontWeight: 'bold', color: 'black' }}>गणेशजी</span>
        <span
          style={{
            fontSize: 35,
            fontWeight: 'bolder',
            color: 'white',
            backgroundColor: 'red',
            padding: '2px 12px',
            borderRadius: '6px',
            letterSpacing: '4px',
          }}
        >
          LIVE
        </span>
      </div>
    </div>
  );
};

const Shimmer = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '-150px',
        width: '150px',
        height: '100%',
        background:
          'radial-gradient(ellipse at center, rgba(255,255,0,0.7) 0%, rgba(255,255,0,0) 80%)',
        animation: 'glitterMove 10s linear infinite',
        pointerEvents: 'none',
      }}
    />
    <style>
      {`
        @keyframes glitterMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(1000px); }
        }
      `}
    </style>
  </>
);

const BottomNews = () => {
  const [showEnglish, setShowEnglish] = useState(true);
  const [config, setConfig] = useState<null | {
    text: string;
    fontWeight: string;
    backgroundColor: string;
    width: string;
    height: string;
    visible: boolean;
    bottomMode?: 'heading' | 'scrolling';
  }>(null);

  const textRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState('40s');


  useEffect(() => {
    const textElement = textRef.current;
    if (textElement && textElement.parentElement) {
      const textWidth = textElement.offsetWidth;
      const containerWidth = textElement.parentElement.offsetWidth;

      const totalDistance = textWidth + containerWidth;

      const pixelsPerSecond = 100; // speed
      let duration = totalDistance / pixelsPerSecond;

      // Cap duration (prevent too slow)
      if (duration > 220) {
        duration = 220;
      }

      setAnimationDuration(`${duration}s`);
    }
  }, [config?.text]);

  useEffect(() => {
    const interval = setInterval(() => setShowEnglish((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sectionRef = ref(database, 'sections/bottom');
    const unsubscribe = onValue(sectionRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || data.visible === false) {
        setConfig(null);
        return;
      }

      setConfig({
        text: data.text || '',
        fontWeight: data.fontWeight || 'normal',
        backgroundColor: data.backgroundColor || 'red',
        width: data.width || '1000px',
        height: data.height || '60px',
        visible: data.visible !== false,
        bottomMode: data.bottomConfig?.bottomMode || 'heading',
      });
    });

    return () => unsubscribe();
  }, []);

  if (!config) return null;



  return (
    <div
      style={{
        position: 'absolute',
        bottom: '0px',
        left: '50%',

        transform: 'translateX(-50%)',
        width: '100%',
        height: config.height,
        display: 'flex',
        border: `2px solid ${config.backgroundColor}`,
        // borderBottomLeftRadius: '25px',
        overflow: 'hidden',
        backgroundColor: 'white',
        maxWidth: '100%',
      }}
    >
      {/* Flip logo section */}
      <div
        style={{
          width: '150px',
          backgroundColor: 'white',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '1000px',
        }}
      >
        <FlipCard showFront={showEnglish} />
      </div>

      {/* Red Section with shimmer and dynamic text */}
      <div
        style={{
          position: 'relative',
          flexGrow: 1,
          backgroundColor: config.backgroundColor,
          borderLeft: '2px solid white',
          // borderBottomLeftRadius: '25px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
          color: 'white',
          fontWeight: config.fontWeight as any,
          fontFamily: 'Arial, sans-serif',
          fontSize: '60px',
          lineHeight: '0.9',
        }}
      >
        {config.bottomMode === 'scrolling' ? (
          <div className="scrolling-container">
            <div
              className="scrolling-text"
              ref={textRef}
              style={{ animationDuration }}
            >
              {config.text}
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              textAlign: 'center',  
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%', 
              fontWeight: config.fontWeight,
              fontFamily: 'Arial, sans-serif',
              fontSize: '60px',
              lineHeight: 1,
            }}
          >
            <ZoomingNews text={config.text} fontWeight={config.fontWeight} />
          </div>
        )}
        <Shimmer />


      </div>
    </div>
  );
};

export default BottomNews;
