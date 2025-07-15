import React, { useEffect, useState } from 'react';
import TopExtraComponent from './top-extra';
import TopTitle from './top-title';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

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
}

interface CloudConfig {
  folder: string;
  subfolder: string;
}

const TopTitleImagesComponent: React.FC<Props> = ({
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
}) => {
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    folder: '',
    subfolder: '',
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scaleDown, setScaleDown] = useState(false);

  // Load cloudConfig from Firebase
  useEffect(() => {
    const configRef = ref(database, 'sections/top/topExtra/cloudConfig');
    return onValue(configRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.folder && data?.subfolder) {
        setCloudConfig({
          folder: data.folder,
          subfolder: data.subfolder,
        });
      }
    });
  }, []);

  // Fetch image URLs from API
  useEffect(() => {
    const fetchImages = async () => {
      if (!cloudConfig.folder || !cloudConfig.subfolder) return;

      const url = `https://apiganeshglive.vercel.app/api/v1/fileupload/view/folder?folder=${cloudConfig.folder}&subfolder=${cloudConfig.subfolder}`;

      try {
        const res = await fetch(url);
        const json = await res.json(); 

        if (json.success && Array.isArray(json.data)) {
          const sorted = json.data
            .sort((a: any, b: any) => parseInt(a.filename) - parseInt(b.filename))
            .map((img: any) => img.secure_url);

          setImageUrls(sorted);
        }
      } catch (err) {
        console.error('Error fetching Cloudinary images:', err);
      }
    };

    fetchImages();
  }, [cloudConfig]);

  // Slideshow logic
  useEffect(() => {
    if (!visible || imageUrls.length === 0) return;

    const interval = setInterval(() => {
      setScaleDown(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 2) % imageUrls.length);
        setScaleDown(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [visible, imageUrls]);

  const currentImages = imageUrls.slice(currentIndex, currentIndex + 2);
  const visibleImages =
    currentImages.length < 2
      ? [...currentImages, ...imageUrls.slice(0, 2 - currentImages.length)]
      : currentImages;

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

      {visible && imageUrls.length > 0 && (
        <TopExtraComponent
          width={topExtraWidth || '90vw'}
          height={topExtraHeight || '50vh'}
          backgroundColor={topExtraBackgroundColor || 'transparent'}
          top={top || '120px'}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            {visibleImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`img-${index}`}
                style={{
                  width: '25vw',
                  height: topExtraHeight,
                  borderRadius: '10px',
                  transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                  transform: scaleDown ? 'scale(0)' : 'scale(1)',
                  opacity: scaleDown ? 0 : 1,
                }}
              />
            ))}
          </div>
        </TopExtraComponent>
      )}
    </>
  );
};

export default TopTitleImagesComponent;
