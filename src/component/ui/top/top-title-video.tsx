import React, { useState, useEffect } from 'react';
import TopTitle from './top-title';
import TopExtraComponent from './top-extra';

interface Props {
  width: string;
  height: string;
  backgroundColor: string;
  text: string;
  fontweight?: string;
  fontSize?: string;
  topExtraWidth?: string;
  topExtraHeight?: string;
  topExtraBackgroundColor?: string;
  top?: string;
  visible?: boolean;
  videoUrl?: string;
  unloadAfter?: number; // in milliseconds
}

const TopTitleVideoComponent: React.FC<Props> = ({
  width,
  height,
  backgroundColor,
  text,
  fontweight,
  fontSize,
  topExtraWidth,
  topExtraHeight,
  topExtraBackgroundColor,
  top,
  visible = false,
  videoUrl = '',
  unloadAfter, // default to 60 seconds if not provided
}) => { 
  const [videoReady, setVideoReady] = useState(false);
  const [showIframe, setShowIframe] = useState(true);

  const finalUrl = `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1&muted=1&controls=0`;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (videoReady) {
      timeout = setTimeout(() => {
        setShowIframe(false);
      }, unloadAfter); // hide after unloadAfter duration
    }

    return () => clearTimeout(timeout);
  }, [videoReady]);

  return (
    <>
      <TopTitle
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        text={text}
        fontweight={fontweight}
        fontSize={fontSize}
      />

      {visible && (
        <TopExtraComponent
          width={topExtraWidth || '90vw'}
          height={topExtraHeight || '80vh'}
          backgroundColor={topExtraBackgroundColor || 'black'}
          top={top || '120px'}
        >
          {!videoReady && (
            <div style={{ color: 'white', textAlign: 'center' }}>Loading video...</div>
          )}

          {showIframe && (
            <iframe
              src={finalUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{
                borderRadius: '10px',
                display: videoReady ? 'block' : 'none',
              }}
              onLoad={() => setVideoReady(true)}
            />
          )}
        </TopExtraComponent>
      )}
    </>
  );
};

export default TopTitleVideoComponent;
