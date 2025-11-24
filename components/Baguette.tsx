import React from 'react';
import { PlayerAction } from '../types';

interface BaguetteProps {
  action: PlayerAction;
  chargePercent: number; // 0 to 1
}

const Baguette: React.FC<BaguetteProps> = ({ action, chargePercent }) => {
  
  // Calculate visual rotation/position based on charge
  // Resting: Lower right
  // Charging: Raises up and shakes slightly
  // Swinging: Rapid motion forward

  let transformClass = "translate-y-0 rotate-0";
  let shakeClass = "";

  if (action === PlayerAction.CHARGING) {
    // Raises up based on charge
    const lift = Math.min(chargePercent * 100, 100); 
    // Shake intensifies with charge
    if (chargePercent > 0.5) shakeClass = "animate-pulse";
    transformClass = `translate-y-[-${lift}px] -rotate-12 transition-transform duration-75`;
  } else if (action === PlayerAction.SWINGING) {
    transformClass = "translate-y-[100px] rotate-[-45deg] scale-110 origin-bottom-right duration-100 ease-in";
  } else {
    // Idle
    transformClass = "translate-y-[200px] rotate-[15deg] hover:translate-y-[180px] transition-all duration-300";
  }

  // Calculate dynamic size/glow based on charge power
  const glowStyle = action === PlayerAction.CHARGING ? {
    filter: `drop-shadow(0 0 ${chargePercent * 15}px gold)`
  } : {};

  return (
    <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      <div 
        className={`absolute -bottom-32 -right-12 w-[300px] h-[600px] flex justify-center items-end ${transformClass} ${shakeClass}`}
        style={glowStyle}
      >
        {/* ARM */}
        <div className="w-32 h-96 bg-blue-400 absolute bottom-0 right-20 rounded-full border-r-8 border-blue-600"></div>

        {/* HAND */}
        <div className="w-24 h-24 bg-orange-200 absolute bottom-[350px] right-[100px] rounded-full border-4 border-orange-300 z-10"></div>

        {/* BAGUETTE */}
        {/* Long oval shape with cuts */}
        <div className="w-20 h-[500px] bg-yellow-600 absolute bottom-[300px] right-[110px] rounded-full border-l-8 border-yellow-800 rotate-[-10deg] flex flex-col items-center justify-evenly py-10 shadow-xl origin-bottom">
           <div className="w-12 h-2 bg-yellow-800/40 -rotate-12 rounded-full"></div>
           <div className="w-12 h-2 bg-yellow-800/40 -rotate-12 rounded-full"></div>
           <div className="w-12 h-2 bg-yellow-800/40 -rotate-12 rounded-full"></div>
           <div className="w-12 h-2 bg-yellow-800/40 -rotate-12 rounded-full"></div>
           <div className="w-12 h-2 bg-yellow-800/40 -rotate-12 rounded-full"></div>
        </div>

      </div>
      
      {/* Charge Text Effect */}
      {action === PlayerAction.CHARGING && (
         <div className="absolute bottom-40 right-10 text-yellow-300 text-xl font-bold animate-bounce drop-shadow-md">
           POWER: {Math.round(chargePercent * 100)}%
         </div>
      )}
    </div>
  );
};

export default Baguette;
