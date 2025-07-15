import TopNews from '../component/top-news';
import MiddleNews from '../component/midddle-news';
import BottomNews from '../component/bottom-news';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../firebase';

const Dashboard = () => {

  const [location, setLocation] = useState('');

  useEffect(() => {
    const locationRef = ref(database, 'common/location');
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const val = snapshot.val();
      if (typeof val === 'string') {
        setLocation(val);
      }
    });

    return () => unsubscribe();
  }, []);

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


      <img
        src="/logo.png" // Make sure file is placed in public/logo.png
        alt="Logo"
        style={{
          position: 'absolute',
          right: '2.5vw',
          height: '13%',
          top: '2vh', // Adjust as needed
          objectFit: 'contain',
          zIndex: 1
        }}
      />

    </>
  );
}

export default Dashboard;