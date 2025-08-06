import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, set, update, off } from 'firebase/database';
import { database } from '../firebase';

const ConfigPage = () => {
  const [selected, setSelected] = useState<'top' | 'middle' | 'bottom'>('bottom');
  const [bottomMode, setBottomMode] = useState<'heading' | 'scrolling'>('heading');
  const [headingText, setHeadingText] = useState('');
  const [scrollingText, setScrollingText] = useState('');
  const [timerText, setTimerText] = useState('');
  const [timerDuration, setTimerDuration] = useState(0);
  const [bottomOffsetVh, setBottomOffsetVh] = useState<number>(10);

  const [config, setConfig] = useState({
    text: '',
    width: '1000px',
    height: '200px',
    backgroundColor: 'red',
    visible: true,
    fontWeight: 'normal',
    layoutMode: 'onlyTitle',
    fontSize: '60px',
    location: '',
    logoVisible: true,
    qrVisible: true,
    bottomOffsetVh: bottomOffsetVh
  });
  const [topExtra, setTopExtra] = useState({
    visible: false,
    height: '300px',
    backgroundColor: 'darkred',
    top: '120px',
    videoUrl: '',
    unloadAfter: 60000,
    cloudConfig: {
      cloudName: "surajyadav",
      folder: "ganeshg-live",
      subfolder: "padya-pujan",
      totalImages: 4,
    }
  });


  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

 const latestData = useRef({
    section: null,
    common: null,
  });

useEffect(() => {
  const sectionRef = ref(database, `sections/${selected}`);
  const commonRef = ref(database, 'common');

  setFetching(true);

 

  const updateConfig = () => {
    const data:any = latestData.current.section;
    const common:any = latestData.current.common;

    if (!data || !common) return;

    setConfig({
      text: data?.text || '',
      width: data?.width || '1000px',
      height: data.height || '200px',
      backgroundColor: data.backgroundColor || 'red',
      visible: data.visible !== false,
      fontWeight: data.fontWeight || 'normal',
      layoutMode: data.layoutMode || 'onlyTitle',
      fontSize: data.fontSize || '60px',
      location: common.location || '',
      logoVisible: data.logoVisible !== false,
      bottomOffsetVh: data.bottomOffsetVh || 10,
      qrVisible: data.qrVisible !== false,
    });

    if (selected === 'top') {
      const extra = data.topExtra || {};
      setTopExtra({
        visible: extra.visible !== false,
        height: extra.height || '300px',
        backgroundColor: extra.backgroundColor || 'darkred',
        top: extra.top || '120px',
        videoUrl: extra.videoUrl || '',
        unloadAfter: extra.unloadAfter || 60000,
        cloudConfig: extra.cloudConfig || {
          cloudName: "surajyadav",
          folder: "ganeshg-live",
          subfolder: "padya-pujan",
          totalImages: 4,
        },
      });
    }

    if (selected === 'bottom') {
      const bottomCfg = data.bottomConfig || {};
      setBottomMode(bottomCfg.bottomMode || 'heading');
      setHeadingText(bottomCfg.headingText || '');
      setScrollingText(bottomCfg.scrollingText || '');
    }

    setFetching(false);
  };

  const sectionListener = onValue(sectionRef, (snapshot) => {
    latestData.current.section = snapshot.val();
    updateConfig();
  });

  const commonListener = onValue(commonRef, (snapshot) => {
    latestData.current.common = snapshot.val();
    updateConfig();
  });

  return () => {
    off(sectionRef);
    off(commonRef);
  };
}, [selected]);


  useEffect(() => {
    const timerRef = ref(database, 'common/timer');
    return onValue(timerRef, (snap) => {
      const val = snap.val();
      if (val) {
        setTimerText(val.text || '');
        setTimerDuration(val.duration || 0);
        setBottomOffsetVh(val.bottomOffsetVh);
      }
    });
  }, []);

  useEffect(() => {
    if (selected === 'bottom') {
      if (bottomMode === 'heading') {
        handleChange('text', headingText);
      } else if (bottomMode === 'scrolling') {
        handleChange('text', scrollingText);
      }
    }
  }, [bottomMode, headingText, scrollingText, selected]);

  useEffect(() => {
    const commonRef = ref(database, 'common');
    const unsubscribe = onValue(commonRef, (snapshot) => {
      const data = snapshot.val();
      setConfig((prev) => ({
        ...prev,  
        ...data,
        // location: data?.location || '',
        logoVisible: data?.logoVisible !== false,
        qrVisible: data?.qrVisible !== false, // 👈 Add this
      }));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selected === 'top' && config.layoutMode === 'titleWithVideo') {
      setTopExtra((prev) => ({
        ...prev,
        height: '80vh',
      }));

      // Optional: hide bottom section in Firebase
      update(ref(database, `sections/bottom`), { visible: false });
    } else {
      setTopExtra((prev) => ({
        ...prev,
        height: '60vh',
      }));
      update(ref(database, `sections/bottom`), { visible: true });
    }
  }, [config.layoutMode, selected]);

  const handleChange = (key: string, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { location, ...sectionPayload } = config; // ✅ Exclude location
    const payload: any = sectionPayload;

    if (selected === 'bottom') {
      payload.bottomConfig = {
        bottomMode,
        headingText,
        scrollingText,
      };
    }

    if (selected === 'top') {
      payload.topExtra = {
        visible: topExtra.visible,
        height: topExtra.height,
        backgroundColor: topExtra.backgroundColor,
        top: topExtra.top,
        videoUrl: topExtra.videoUrl,
        unloadAfter: topExtra.unloadAfter,
        cloudConfig: topExtra.cloudConfig,
      };
    }

    // 1. Save full payload to selected section
    await set(ref(database, `sections/${selected}`), payload);

    // 2. Share only width to all (without overwriting others)
    await Promise.all(
      ['top', 'middle', 'bottom'].map((section) =>
        update(ref(database, `sections/${section}`), { width: config.width })
      )
    );
    await set(ref(database, 'common/location'), config.location);
    await update(ref(database, 'common'), { logoVisible: config.logoVisible });
    await update(ref(database, 'common'), { qrVisible: config.qrVisible });

    const timerRef = ref(database, 'common/timer');
    set(timerRef, {
      text: timerText,
      duration: timerDuration,
      bottomOffsetVh: bottomOffsetVh
    });

    setSaving(false);
    alert(`${selected} section updated`);
  };
  return (
    <div
      style={{
        maxWidth: '95%',
        width: '600px',
        margin: '0px auto',
        padding: '0rem 1rem',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ fontSize: '1.5rem' }}>Configure News Section</h2>

      <div style={{ marginBottom: '15px' }}>
        {['top', 'middle', 'bottom'].map((key) => (
          <label key={key} style={{ marginRight: '15px' }}>
            <input
              type="radio"
              name="section"
              value={key}
              checked={selected === key}
              onChange={() => setSelected(key as 'top' | 'middle' | 'bottom')}
              disabled={saving}
            />{' '}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>

      {fetching && (
        <p style={{ color: '#999', fontStyle: 'italic', marginBottom: '1rem' }}>
          Fetching configuration for "{selected}"...
        </p>
      )}

      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Visibility:</label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name="visibility"
            value="showing"
            checked={config.visible === true}
            onChange={() => handleChange('visible', true)}
          />{' '}
          Show
        </label>
        <label>
          <input
            type="radio"
            name="visibility"
            value="hiding"
            checked={config.visible === false}
            onChange={() => handleChange('visible', false)}
          />{' '}
          Hide
        </label>
      </div>

      {selected === 'bottom' && (
        <details
          style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
            Additional Settings
          </summary>
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Display Mode:
              </label>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="bottomMode"
                  value="heading"
                  checked={bottomMode === 'heading'}
                  onChange={() => setBottomMode('heading')}
                />{' '}
                Heading
              </label>
              <label>
                <input
                  type="radio"
                  name="bottomMode"
                  value="scrolling"
                  checked={bottomMode === 'scrolling'}
                  onChange={() => setBottomMode('scrolling')}
                />{' '}
                Scrolling
              </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Heading Text:</label>
              <textarea
                rows={5}
                value={headingText}
                onChange={(e) => setHeadingText(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Scrolling Text:</label>
              <textarea
                rows={5}
                value={scrollingText}
                onChange={(e) => setScrollingText(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          </div>
        </details>
      )}



      {selected === 'top' && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <label>Layout Mode:</label>
            <select
              value={config.layoutMode}
              onChange={(e) =>
                setConfig({ ...config, layoutMode: e.target.value })
              }
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="onlyTitle">Only Title</option>
              <option value="titleWithImages">Title and Images</option>
              <option value="titleWithVideo">Title and Video</option>
              <option value="onlyVideo">Only Video (Full)</option>
            </select>
          </div>
          <details
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Top Extra Box</summary>

            {config.layoutMode === 'titleWithVideo' && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <label>Video URL (e.g., Vimeo):</label>
                  <input
                    type="text"
                    value={topExtra.videoUrl}
                    onChange={(e) =>
                      setTopExtra((prev) => ({ ...prev, videoUrl: e.target.value }))
                    }
                    style={{ width: '100%', padding: '10px' }}
                    placeholder="https://player.vimeo.com/video/..."
                  />
                </div>
                <label style={{ marginTop: '10px', display: 'block' }}>
                  Unload After (ms):
                </label>
                <input
                  type="number"
                  value={topExtra.unloadAfter || 0}
                  onChange={(e) =>
                    setTopExtra((prev) => ({
                      ...prev,
                      unloadAfter: parseInt(e.target.value || '0', 10),
                    }))
                  }
                  style={{ width: '100%', padding: '10px' }}
                  placeholder="Eg: 180000 for 3 minutes"
                />

              </>
            )}

            <div style={{ marginTop: '10px' }}>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="topExtraVisibility"
                  checked={topExtra.visible === true}
                  onChange={() =>
                    setTopExtra((prev) => ({ ...prev, visible: true }))
                  }
                />{' '}
                Show
              </label>
              <label>
                <input
                  type="radio"
                  name="topExtraVisibility"
                  checked={topExtra.visible === false} onChange={() =>
                    setTopExtra((prev) => ({ ...prev, visible: false }))
                  }
                />{' '}
                Hide
              </label>

              <div style={{ marginTop: '10px' }}>
                <label>Extra Height:</label>
                <input
                  value={topExtra.height}
                  onChange={(e) => setTopExtra({ ...topExtra, height: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
              </div>

              <label>Top Offset:</label>
              <input
                value={topExtra.top}
                onChange={(e) => setTopExtra({ ...topExtra, top: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />

              <label>Background Color:</label>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <input
                  type="color"
                  value={topExtra.backgroundColor}
                  onChange={(e) =>
                    setTopExtra({ ...topExtra, backgroundColor: e.target.value })
                  }
                  style={{ width: '50px', height: '40px', padding: '0', border: 'none' }}
                />
                <input
                  type="text"
                  value={topExtra.backgroundColor}
                  onChange={(e) =>
                    setTopExtra({ ...topExtra, backgroundColor: e.target.value })
                  }
                  style={{ flex: 1, padding: '10px' }}
                />
              </div>
            </div>

            {config.layoutMode === 'titleWithImages' && (
              <details
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              >
                <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                  Cloudinary Image Settings
                </summary>

                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label>
                    Cloud Name:
                    <input
                      type="text"
                      value={topExtra.cloudConfig?.cloudName || ''}
                      onChange={(e) =>
                        setTopExtra((prev) => ({
                          ...prev,
                          cloudConfig: {
                            ...prev.cloudConfig,
                            cloudName: e.target.value,
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </label>

                  <label>
                    Folder:
                    <input
                      type="text"
                      value={topExtra.cloudConfig?.folder || ''}
                      onChange={(e) =>
                        setTopExtra((prev) => ({
                          ...prev,
                          cloudConfig: {
                            ...prev.cloudConfig,
                            folder: e.target.value,
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </label>

                  <label>
                    Subfolder:
                    <input
                      type="text"
                      value={topExtra.cloudConfig?.subfolder || ''}
                      onChange={(e) =>
                        setTopExtra((prev) => ({
                          ...prev,
                          cloudConfig: {
                            ...prev.cloudConfig,
                            subfolder: e.target.value,
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </label>

                  <label>
                    Total Images:
                    <input
                      type="number"
                      value={topExtra.cloudConfig?.totalImages || 0}
                      onChange={(e) =>
                        setTopExtra((prev) => ({
                          ...prev,
                          cloudConfig: {
                            ...prev.cloudConfig,
                            totalImages: parseInt(e.target.value),
                          },
                        }))
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </label>
                </div>
              </details>
            )}


          </details>
        </>
      )}




      <label>Edit Text:</label>
      <textarea
        value={config.text}
        onChange={(e) => handleChange('text', e.target.value)}
        rows={5}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: selected === 'bottom' ? '#eee' : 'white',
          cursor: selected === 'bottom' ? 'not-allowed' : 'text',
        }}
      />

      <label>Location:</label>
      <input
        value={config.location}
        onChange={(e) => handleChange('location', e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <label>Font Size (e.g., 40px, 3rem):</label>
      <input
        value={config.fontSize}
        onChange={(e) => handleChange('fontSize', e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <label>Font Weight:</label>
      <select
        value={config.fontWeight}
        onChange={(e) => handleChange('fontWeight', e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      >
        <option value="normal">Normal</option>
        <option value="bold">Bold</option>
        <option value="lighter">Lighter</option>
        <option value="bolder">Bolder</option>
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="300">300</option>
        <option value="400">400</option>
        <option value="500">500</option>
        <option value="600">600</option>
        <option value="700">700</option>
        <option value="800">800</option>
        <option value="900">900</option>
      </select>

      {selected === 'top' && (
        <>
          <label>Width:</label>
          <input
            value={config.width}
            onChange={(e) => handleChange('width', e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        </>
      )}

      <label>Height:</label>
      <input
        value={config.height}
        onChange={(e) => handleChange('height', e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <label>Background Color:</label>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <input
          type="color"
          value={config.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          style={{ width: '50px', height: '40px', padding: '0', border: 'none' }}
        />
        <input
          type="text"
          value={config.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          style={{ flex: 1, padding: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Logo Visibility:</label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name="logoVisibility"
            value="show"
            checked={config.logoVisible !== false}
            onChange={() => handleChange('logoVisible', true)}
          /> Show
        </label>
        <label>
          <input
            type="radio"
            name="logoVisibility"
            value="hide"
            checked={config.logoVisible === false}
            onChange={() => handleChange('logoVisible', false)}
          /> Hide
        </label>
      </div>


      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>QR Visibility:</label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name="qrVisibility"
            value="show"
            checked={config.qrVisible !== false}
            onChange={() => handleChange('qrVisible', true)}
          /> Show
        </label>
        <label>
          <input
            type="radio"
            name="qrVisibility"
            value="hide"
            checked={config.qrVisible === false}
            onChange={() => handleChange('qrVisible', false)}
          /> Hide
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>⏳ Countdown Timer</h3>

        <div style={{ marginBottom: '8px' }}>
          <label>Timer Text:</label>
          <input
            type="text"
            value={timerText}
            onChange={(e) => setTimerText(e.target.value)}
            placeholder="E.g. Time left for Aagman"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Duration (in seconds):</label>
          <input
            type="number"
            value={timerDuration}
            onChange={(e) => setTimerDuration(Number(e.target.value))}
            placeholder="E.g. 600"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Timer Bottom Offset (vh):</label>
          <input
            type="number"
            value={bottomOffsetVh}
            onChange={(e) => setBottomOffsetVh(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || fetching}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: saving || fetching ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving...' : 'Save to Firebase'}
      </button>
    </div>
  );
};

export default ConfigPage;
