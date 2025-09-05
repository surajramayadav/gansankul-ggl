import TopNews from '../component/top-news';
import MiddleNews from '../component/midddle-news';
import BottomNews from '../component/bottom-news';
import ScoreBoardModal from '../component/ScoreBoardModal';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../firebase';
import { url } from 'inspector';

const Dashboard = () => {

  const [location, setLocation] = useState('');
  const [logoVisible, setLogoVisible] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [timerText, setTimerText] = useState('');
  const [bottomOffsetVh, setBottomOffsetVh] = useState(10);
  const [isScoreBoard, setIsScoreBoard] = useState(false);
  const [scoreBoardData, setScoreBoardData] = useState([]);
  const [qrcodelink, setQrCodeLink] = useState('');


  useEffect(() => {
    const locationRef = ref(database, 'common/location');
    const qrVisibleRef = ref(database, 'common/qrVisible');
    const timerRef = ref(database, 'common/timer');
    const isScoreBoardVisibleRef = ref(database, 'common/scoreBoardVisible');
    const scordboardDataRef = ref(database, 'common/scordboard');
    const qrCodeRef = ref(database, 'common/qrcode');

    const locationUnsub = onValue(locationRef, (snapshot) => {
      const val = snapshot.val();
      if (typeof val === 'string') setLocation(val);
    });

    const qrUnsub = onValue(qrVisibleRef, (snapshot) => {
      setQrVisible(snapshot.val() === true); // 👈 Add this
    });

    const isScoreBoardVisibleUnsub = onValue(isScoreBoardVisibleRef, (snapshot) => {
      setIsScoreBoard(snapshot.val() === true); // 👈 Add this
    });

    const scordboardDataUnsub = onValue(scordboardDataRef, (snapshot) => {
      setScoreBoardData(snapshot.val() || [])
    });

    const qrCodeLinkUnsub = onValue(qrCodeRef, (snapshot) => {
      setQrCodeLink(snapshot.val()|| "")
    });


    const timerUnsub = onValue(timerRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data.duration === 'string') { // Changed to string
        setTimerText(data.text || '');
        setBottomOffsetVh(data.bottomOffsetVh || 10);
      }
    });

    const logoVisibleRef = ref(database, 'common/logoVisible');
    const logoVisibleUnsubscribe = onValue(logoVisibleRef, (snapshot) => {
      const val = snapshot.val();
      setLogoVisible(val !== false);
    });

    // const scoreBoardUnsub = onValue(scoreBoardRef, (snapshot) => {
    //   setIsScoreBoard(snapshot.val() === true);
    // });

    return () => {
      locationUnsub();
      timerUnsub();
      logoVisibleUnsubscribe();
      qrUnsub();
      isScoreBoardVisibleUnsub();
      scordboardDataUnsub()
      qrCodeLinkUnsub()
    };
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
        src={qrcodelink ? qrcodelink : "/images/qr/qr.jpg"}
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

      {timerText  && (
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
          {timerText}
        </div>

      )}

      {/* ScoreBoard Modal */}
      <ScoreBoardModal 
        users={scoreBoardData}
        isVisible={isScoreBoard}
        onClose={() => setIsScoreBoard(false)}
      />

    </>
  );
}

export default Dashboard;
