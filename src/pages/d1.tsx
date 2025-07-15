import TopNews from '../component/top-news';
import MiddleNews from '../component/midddle-news';
import BottomNews from '../component/bottom-news';

const Dashboard = () => ( 
  <>
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



    <img
        src="/logo.png" // Make sure file is placed in public/logo.png
        alt="Logo"
        style={{
          position: 'absolute',
          right: '2.5vw',
          height: '13%',
          top: '2vh', // Adjust as needed
          objectFit: 'contain',
          zIndex :1
        }}
      />
      
  </>
);

export default Dashboard;
