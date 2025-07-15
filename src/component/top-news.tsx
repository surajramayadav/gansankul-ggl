import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import TopExtraComponent from './ui/top/top-extra';
import TopTitle from './ui/top/top-title';
import TopTitleImagesComponent from './ui/top/top-title-images';
import TopTitleVideoComponent from './ui/top/top-title-video';
import TopOnlyVideoComponent from './ui/top/top-only-video';

const TopNews = () => {
  const [config, setConfig] = useState<null | {
    width: string;
    height: string;
    backgroundColor: string;
    visible: boolean;
    fontweight?: string;
    fontSize?: string;
    layoutMode?: 'onlyTitle' | 'titleWithImages' | 'titleWithVideo' | 'onlyVideo';
    text?: string;
    topExtra?: {
      visible: boolean;
      height: string;
      backgroundColor: string;
      top: string;
      text?: string;
      videoUrl?: string;
      unloadAfter?: number;
    };
  }>(null);

  useEffect(() => {
    const sectionRef = ref(database, 'sections/top');
    const unsubscribe = onValue(sectionRef, (snapshot) => {
      const data = snapshot.val();

      if (!data || data.visible === false) {
        setConfig(null);
        return;
      }

      setConfig({
        width: data.width || '1000px',
        height: data.height || '80px',
        backgroundColor: data.backgroundColor || 'red',
        visible: data.visible !== false,
        layoutMode: data.layoutMode || 'onlyTitle',
        text: data.text || '',
        fontweight: data.fontweight || 'bolder',
        fontSize: data.fontSize || '60px',
        topExtra: data.topExtra || {
          visible: false,
          height: '300px',
          backgroundColor: 'darkred',
          top: '120px',
          text: data.topExtra.text || '',
          videoUrl: data.topExtra.videoUrl || '',
          unloadAfter: data.topExtra.unloadAfter || 0,
        },
      });
    });

    return () => unsubscribe();
  }, []); 

  return (
    <>
      {config && config.visible && (
  <>
    {config.layoutMode === 'onlyTitle' && (
      <TopTitle
        width={config.width}
        height={config.height}
        backgroundColor={config.backgroundColor}
        text={config?.text ?? ""}
        fontweight={config?.fontweight ?? "bolder"}
        fontSize={config?.fontSize ?? "60px"} 
      />
    )}

    {config.layoutMode === 'titleWithImages' && (
      <TopTitleImagesComponent
        width={config.width} 
        height={config.height}
        backgroundColor={config.backgroundColor}
        text={config?.text ?? ""}
        topExtraWidth={config.width}
        topExtraHeight={config?.topExtra?.height}
        topExtraBackgroundColor={config?.topExtra?.backgroundColor}
        top={config?.topExtra?.top}
        visible={config?.topExtra?.visible} 
        fontweight={config?.fontweight ?? "bolder"}
        fontSize={config?.fontSize ?? "60px"}
      />
    )}

    {config.layoutMode === 'titleWithVideo' && (
      <TopTitleVideoComponent
        width={config.width}
        height={config.height}
        backgroundColor={config.backgroundColor}
        text={config?.text ?? ""}
        top={config.topExtra?.top ?? "120px"}
        visible={config.topExtra?.visible ?? false}
        fontweight={config?.fontweight ?? "bolder"}
        fontSize={config?.fontSize ?? "60px"}
        topExtraWidth={config.width}
        topExtraHeight={config.topExtra?.height}
        topExtraBackgroundColor={config.topExtra?.backgroundColor ?? "black"}
        videoUrl={config.topExtra?.videoUrl ?? ""}
        unloadAfter={config.topExtra?.unloadAfter ?? 0}
      />
    )}

    {config.layoutMode === 'onlyVideo' && (
      <TopOnlyVideoComponent
        width={config.width}
        height={config.height}
        backgroundColor={config.backgroundColor}
        top={config.topExtra?.top ?? "120px"}
      />
    )}

    {/* {config.topExtra?.visible && (
      <TopExtraComponent
        width={config.width}
        height={config.topExtra.height}
        backgroundColor={config.topExtra.backgroundColor}
        top={config.topExtra.top}
      />
    )} */}
  </>
)}
    </>
  );
};

export default TopNews;
