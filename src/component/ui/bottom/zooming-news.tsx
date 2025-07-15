import React, { useEffect, useState } from 'react';

interface ZoomingNewsProps {
  text: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  fontSize?: string;
}

const ZoomingNews: React.FC<ZoomingNewsProps> = ({ text, fontWeight = 'normal', fontSize = '60px' }) => {
  const items = text.split(',').map(item => item.trim()).filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomState, setZoomState] = useState<'zoom-in' | 'zoom-out'>('zoom-out'); // start zoomed out

  useEffect(() => {
    // Duration timings (in ms)
    const zoomInDuration = 800;
    const displayDuration = 3200;
    const zoomOutDuration = 800;

    let zoomInTimeout: NodeJS.Timeout;
    let zoomOutTimeout: NodeJS.Timeout;
    let changeIndexTimeout: NodeJS.Timeout;

    function cycle() {
      // Start zoom in (from big to normal)
      setZoomState('zoom-in');

      // After displayDuration, zoom out (normal to small)
      zoomOutTimeout = setTimeout(() => {
        setZoomState('zoom-out');
      }, displayDuration + zoomInDuration);

      // After displayDuration + zoomOutDuration + zoomInDuration, change text and start next zoom-in
      changeIndexTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setZoomState('zoom-in');
      }, displayDuration + zoomInDuration + zoomOutDuration);
    }

    cycle();

    // Repeat cycle every total duration
    const interval = setInterval(() => {
      cycle();
    }, displayDuration + zoomInDuration + zoomOutDuration);

    // Cleanup on unmount or text change
    return () => {
      clearTimeout(zoomOutTimeout);
      clearTimeout(changeIndexTimeout);
      clearInterval(interval);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight,
        fontFamily: 'Arial, sans-serif',
        fontSize: fontSize,
        lineHeight: 1,
        transition: 'transform 0.8s ease, opacity 0.8s ease',
        transform: zoomState === 'zoom-in' ? 'scale(1)' : 'scale(2.5)', // big to normal
        opacity: zoomState === 'zoom-in' ? 1 : 0,
      }}
    >
      {items[currentIndex]}
    </div>
  );
};

export default ZoomingNews;
