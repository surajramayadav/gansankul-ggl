import TopNews from '../component/top-news';
import MiddleNews from '../component/midddle-news';
import BottomNews from '../component/bottom-news';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../firebase';

const Dashboard = () => {

  const [location, setLocation] = useState('');
  const [logoVisible, setLogoVisible] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [timerText, setTimerText] = useState('');
  const [timerDuration, setTimerDuration] = useState(''); // Change to string for 24-hour time
  const [timeLeft, setTimeLeft] = useState(0);
  const [bottomOffsetVh, setBottomOffsetVh] = useState(10);

  useEffect(() => {
    const locationRef = ref(database, 'common/location');
    const qrVisibleRef = ref(database, 'common/qrVisible');
    const timerRef = ref(database, 'common/timer');

    const locationUnsub = onValue(locationRef, (snapshot) => {
      const val = snapshot.val();
      if (typeof val === 'string') setLocation(val);
    });

    const qrUnsub = onValue(qrVisibleRef, (snapshot) => {
      setQrVisible(snapshot.val() === true); // 👈 Add this
    });

    const timerUnsub = onValue(timerRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data.duration === 'string') { // Changed to string
        setTimerText(data.text || '');
        setTimerDuration(data.duration || ''); // Changed to string
        setBottomOffsetVh(data.bottomOffsetVh || 10);
      }
    });

    const logoVisibleRef = ref(database, 'common/logoVisible');
    const logoVisibleUnsubscribe = onValue(logoVisibleRef, (snapshot) => {
      const val = snapshot.val();
      setLogoVisible(val !== false);
    });

    return () => {
      locationUnsub();
      timerUnsub();
      logoVisibleUnsubscribe();
      qrUnsub();
    };
  }, []);

  useEffect(() => {
    if (!timerText || !timerDuration) return;

    // Parse timerDuration as 'HH.mm' (e.g., '14.30')
    const [targetHour, targetMinute] = timerDuration.split('.').map(Number);
    if (
      isNaN(targetHour) ||
      isNaN(targetMinute) ||
      targetHour < 0 ||
      targetHour > 23 ||
      targetMinute < 0 ||
      targetMinute > 59
    ) {
      setTimeLeft(0);
      return;
    }

    // Get current IST time
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istNow = new Date(utc + 5.5 * 60 * 60 * 1000);

    // Target time today in IST
    const target = new Date(istNow);
    target.setHours(targetHour, targetMinute, 0, 0);

    // If target time is before now, assume it's for the next day
    if (target < istNow) {
      target.setDate(target.getDate() + 1);
    }

    const diffSeconds = Math.floor((target.getTime() - istNow.getTime()) / 1000);
    setTimeLeft(diffSeconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerText, timerDuration]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
    const seconds = (secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <>

      <style>
        {`
    @keyframes blinker {
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
  `}
      </style>
      <div style={{ height: '100vh', width: '100vw', }}>
        <div
          style={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            background: 'transparent',
          }}
        >
          <TopNews />
          <MiddleNews />
          <BottomNews />
        </div>
      </div>


      {location && <div
        style={{
          position: 'absolute',
          left: '1vw',
          top: '5vh',
          backgroundColor: 'white',
          padding: '6px 20px 2px 32px', // 👈 increased left padding to avoid overlap
          borderRadius: '5px',
          fontSize: '1.6em',
          fontWeight: 'bold',
          zIndex: 2,
          maxWidth: '25vw',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          border: '2px solid red',
        }}
      >
        {/* 🔴 Blinking Dot */}
        <span
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '10px',
            backgroundColor: 'red',
            borderRadius: '50%',
            animation: 'blinker 1s infinite',
          }}
        />
        {location}
      </div>}


      {logoVisible && (
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            position: 'absolute',
            right: '2.5vw',
            height: '13%',
            top: '2vh',
            objectFit: 'contain',
            zIndex: 1
          }}
        />
      )}

      {qrVisible && (<img
        src="/images/qr/qr.jpg"
        alt="QR Code"
        style={{
          position: 'absolute',
          bottom: '15vh',
          right: '3vw',
          width: '10vw',
          height: 'auto',
          zIndex: 20,
        }}
      />
      )}

      {timerText && timeLeft > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: `${bottomOffsetVh}vh`,
            transform: 'translate(-50%, -50%)',
            color: 'white',
            padding: '12px 24px',
            fontSize: '3rem',
            fontWeight: 'bold',
            zIndex: 10,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: `
      0 0 2px rgba(0,0,0,0.5),
      1px 1px 2px rgba(0,0,0,0.4),
      -1px -1px 2px rgba(0,0,0,0.4)
    `
          }}
        >
          {timerText} {formatTime(timeLeft)}
        </div>

      )}

    </>
  );
}

export default Dashboard;
