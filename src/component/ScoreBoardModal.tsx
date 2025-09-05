import React from 'react';

interface User {
  name: string;
  amount: number | string;
}

interface ScoreBoardModalProps {
  isVisible: boolean;
  onClose: () => void;
  users?: User[];
}

const ScoreBoardModal: React.FC<ScoreBoardModalProps> = ({
  isVisible,
  onClose,
  users = []
}) => {
  // Default sample data if no users provided
  const defaultUsers: User[] = [
    { name: "Player 1", amount: 1250 },
    { name: "Player 2", amount: 1180 },
    { name: "Player 3", amount: 1100 },
    { name: "Player 4", amount: 950 },
    { name: "Player 5", amount: 875 },
    { name: "Player 6", amount: 800 },
    { name: "Player 7", amount: 720 },
    { name: "Player 8", amount: 650 },
    { name: "Player 9", amount: 580 },
    { name: "Player 10", amount: 500 }
  ];

  const displayUsers = users.length > 0 ? users.slice(0, 10) : defaultUsers;

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="scoreboard-backdrop"
       
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Modal Container */}
        <div
          className="scoreboard-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '15px', // rounded modal
            boxShadow: '0 20px 40px rgba(220, 20, 60, 0.3)',
            width: '90vw',
            maxWidth: '800px',
            height: '90vh',
            maxHeight: '700px',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease-out',
            overflow: 'hidden' // ✅ keeps header corners rounded
          }}
        >
          {/* Header */}
          <div style={{
            backgroundColor: '#DC143C', // Crimson header
            padding: '12px 20px',
            borderBottom: '2px solid #B22222',
            flexShrink: 0
          }}>
            <h2 style={{
              margin: 0,
              color: '#FFFFFF',
              fontSize: '35px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '1px',
              textTransform: "uppercase"
            }}>
              🙏 Top supporters 🙏
            </h2>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            overflow: 'hidden'
          }}>
            {/* User List */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {displayUsers.map((user, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FFF5F5', // Alternating white and light red row colors
                    borderBottom: '1px solid rgba(220, 20, 60, 0.2)',
                    transition: 'background-color 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFF5F5' : '#FFE5E5';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#FFF5F5';
                  }}
                >
                  {/* Rank Badge */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: index < 3 ? '#FFD700' : '#DC143C', // Gold for top 3, red for others
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: index < 3 ? '#8B0000' : '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(220, 20, 60, 0.3)',
                    border: '2px solid rgba(220, 20, 60, 0.3)'
                  }}>
                    {index + 1}
                  </div>

                  {/* Player Name */}
                  <div style={{
                    flex: 1,
                    color: 'black', // Red color for player names
                    fontSize: '30px',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: 'none'
                  }}>
                    {user.name}
                  </div>

                  {/* Repues Score */}
                  <div style={{
                    color: 'black', // Red color for scores
                    fontSize: '30px',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: 'none',
                    minWidth: '80px',
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                    <span style={{ marginRight: '4px' }}>₹</span>
                    {user.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .scoreboard-modal {
              width: 95vw !important;
              max-width: 95vw !important;
              height: 85vh !important;
            }
            
            .scoreboard-modal h2 {
              font-size: 18px !important;
            }
            
            .scoreboard-modal div[style*="fontSize: 14px"] {
              font-size: 12px !important;
            }
            
            .scoreboard-modal div[style*="fontSize: 16px"] {
              font-size: 14px !important;
            }
            
            .scoreboard-modal div[style*="width: 28px"] {
              width: 24px !important;
              height: 24px !important;
              font-size: 10px !important;
            }
            
            .scoreboard-modal div[style*="minWidth: 80px"] {
              min-width: 70px !important;
            }
            
            .scoreboard-modal div[style*="padding: 8px 16px"] {
              padding: 6px 12px !important;
            }
          }

          @media (max-width: 480px) {
            .scoreboard-modal {
              width: 98vw !important;
              max-width: 98vw !important;
              height: 90vh !important;
            }
            
            .scoreboard-modal h2 {
              font-size: 16px !important;
            }
            
            .scoreboard-modal div[style*="fontSize: 14px"] {
              font-size: 11px !important;
            }
            
            .scoreboard-modal div[style*="fontSize: 16px"] {
              font-size: 13px !important;
            }
            
            .scoreboard-modal div[style*="width: 28px"] {
              width: 20px !important;
              height: 20px !important;
              font-size: 9px !important;
            }
            
            .scoreboard-modal div[style*="minWidth: 80px"] {
              min-width: 60px !important;
            }
            
            .scoreboard-modal div[style*="padding: 8px 16px"] {
              padding: 4px 8px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ScoreBoardModal;
