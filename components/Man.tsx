
import React from 'react';
import { EnemyState } from '../types';
import { BumpEffect } from './PixelComponents';

interface ManProps {
  state: EnemyState;
}

const Man: React.FC<ManProps> = ({ state }) => {
  const isWorking = state === EnemyState.WORKING;
  const isAlert = state === EnemyState.ALERT;
  const isWatching = state === EnemyState.WATCHING || state === EnemyState.CAUGHT_YOU;
  const isHit = state === EnemyState.HIT;
  const isSmiling = state === EnemyState.CAUGHT_YOU;

  // Visual State Helpers
  const scaleEffect = isWatching ? 'scale-105' : '';
  const hitEffect = isHit ? 'translate-y-8 scale-y-90 scale-x-105 transition-transform duration-75' : 'transition-all duration-200';

  return (
    // MOVED DOWN: Changed bottom-[10px] to -bottom-[50px] (Moved down 60px)
    <div className={`absolute -bottom-[50px] left-1/2 -translate-x-1/2 w-64 h-80 z-20 ${scaleEffect} ${hitEffect}`}>
      
      {/* Alert Icon */}
      {isAlert && (
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl animate-bounce drop-shadow-md z-50">
           ❗
         </div>
      )}

      {/* --- OFFICE CHAIR BASE --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-32 z-10 pointer-events-none">
          {/* Central Piston - Extended to connect to seat */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-32 bg-zinc-800 rounded-t-lg"></div>
          
          {/* Simple Base Legs (Removed diagonals) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-5 bg-zinc-700 rounded-full shadow-lg border-t border-zinc-600"></div>
          {/* Wheels */}
          <div className="absolute bottom-0 left-0 w-6 h-4 bg-black/60 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-6 h-4 bg-black/60 rounded-full"></div>
      </div>

      {/* --- LEGS & SHOES --- */}
      {/* Dynamic rotation based on turning state */}
      <div className={`transition-all duration-300 ${isWatching ? 'z-30' : 'z-10'}`}>
        
        {isWatching ? (
          // FRONT VIEW (Facing Camera)
          <>
             {/* Thighs/Knees coming forward */}
             <div className="absolute bottom-12 left-20 w-10 h-20 bg-[#2a2a2a] rounded-b-xl border-2 border-black/30 shadow-lg"></div>
             <div className="absolute bottom-12 right-20 w-10 h-20 bg-[#2a2a2a] rounded-b-xl border-2 border-black/30 shadow-lg"></div>
             
             {/* Shoes Facing Front */}
             <div className="absolute bottom-4 left-18 w-14 h-10 bg-[#e3dcd3] rounded-2xl border-b-8 border-[#d4c5b5] shadow-md flex justify-center items-start pt-2 transform -translate-x-2">
                <div className="w-8 h-4 bg-white/30 rounded-sm"></div> {/* Laces */}
             </div>
             <div className="absolute bottom-4 right-18 w-14 h-10 bg-[#e3dcd3] rounded-2xl border-b-8 border-[#d4c5b5] shadow-md flex justify-center items-start pt-2 transform translate-x-2">
                <div className="w-8 h-4 bg-white/30 rounded-sm"></div>
             </div>
          </>
        ) : (
          // SIDE/BACK VIEW (Under table)
          <>
            <div className="absolute bottom-10 left-14 w-12 h-28 bg-[#2a2a2a] rotate-12 rounded-lg border-2 border-black/30 flex flex-col justify-end">
                <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>
            </div>
            <div className="absolute bottom-10 right-14 w-12 h-28 bg-[#2a2a2a] -rotate-12 rounded-lg border-2 border-black/30 flex flex-col justify-end">
                <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>
            </div>

            {/* Chunky Beige Sneakers Side View */}
            <div className="absolute bottom-6 left-10 w-16 h-10 bg-[#e3dcd3] rotate-12 rounded-xl border-b-8 border-[#d4c5b5] shadow-sm">
               <div className="absolute bottom-1 w-full h-2 bg-[#cbb8a5]"></div> 
            </div>
            <div className="absolute bottom-6 right-10 w-16 h-10 bg-[#e3dcd3] -rotate-12 rounded-xl border-b-8 border-[#d4c5b5] shadow-sm">
               <div className="absolute bottom-1 w-full h-2 bg-[#cbb8a5]"></div>
            </div>
          </>
        )}
      </div>

      {/* --- CHAIR SEAT & MECHANISM --- */}
      {/* Seat Cushion - Connected to piston via z-indexing overlap */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-52 h-12 bg-zinc-800 rounded-xl border-2 border-zinc-900 z-15 shadow-lg flex justify-center">
         {/* Mechanism under seat connecting to backrest */}
         <div className="absolute -bottom-4 w-32 h-6 bg-zinc-900 rounded-b-md"></div>
      </div>

      {/* --- CHAIR BACKREST --- */}
      {/* Connected via the mechanism above */}
      <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 w-40 h-44 transition-all duration-300 ${isWatching ? 'z-0 scale-x-90 brightness-75' : 'z-30 shadow-2xl'}`}>
          
          {/* Spine Connector (Visual Link) */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-zinc-900 z-0"></div>

          {/* Frame */}
          <div className="w-full h-full bg-zinc-900 rounded-t-2xl border-x-4 border-t-4 border-zinc-800 relative overflow-hidden flex flex-col items-center pt-2 z-10">
             {/* Mesh Pattern */}
             <div className="w-[90%] h-[90%] bg-zinc-800/50 rounded-t-xl border border-zinc-700 bg-[radial-gradient(circle,theme(colors.zinc.900)_2px,transparent_2px)] bg-[length:6px_6px]"></div>
             <div className="absolute bottom-8 w-full h-12 bg-black/40 blur-sm"></div>
          </div>
      </div>


      {/* --- BODY (Green Puffy Jacket) --- */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-52 h-48 bg-[#4f5f3e] rounded-t-[3rem] rounded-b-xl shadow-inner flex justify-center border-x-2 border-[#3a462e] z-20">
         {/* Texture */}
         <div className="absolute top-1/4 w-full h-1 bg-black/10"></div>
         <div className="absolute top-1/2 w-full h-1 bg-black/10"></div>
         
         {/* Zipper only visible if facing front */}
         {isWatching ? (
             <div className="w-4 h-full bg-[#3a462e] flex flex-col items-center">
                 <div className="w-1 h-full bg-zinc-400 opacity-50 dashed"></div>
                 <div className="w-3 h-4 bg-zinc-300 rounded-sm mt-4 shadow-sm"></div>
             </div>
         ) : (
            // Back seam
             <div className="w-1 h-full bg-black/20"></div>
         )}

         {/* Hood */}
         {!isWatching && (
           <div className="absolute -top-4 w-44 h-24 bg-[#425034] rounded-t-full rounded-b-lg shadow-md z-30 flex items-end justify-center pb-2">
              <div className="w-full h-1 bg-black/10"></div>
           </div>
         )}
      </div>

      {/* --- ARMS --- */}
      {(isWorking || isAlert || isHit) && (
        <>
          <div className="absolute bottom-40 -left-6 w-16 h-32 bg-[#4f5f3e] rounded-full z-20 rotate-12 border border-[#3a462e] shadow-lg"></div>
          <div className="absolute bottom-40 -right-6 w-16 h-32 bg-[#4f5f3e] rounded-full z-20 -rotate-12 border border-[#3a462e] shadow-lg"></div>
        </>
      )}
      
      {isWatching && (
           <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-48 h-16 bg-[#4f5f3e] rounded-full border-2 border-[#3a462e] z-30 flex items-center justify-center shadow-lg">
              <div className="w-1 h-full bg-black/20 rotate-12"></div>
           </div>
      )}

      {/* --- HEAD & CAP --- */}
      <div className={`absolute bottom-[280px] left-1/2 -translate-x-1/2 w-32 h-36 z-40 origin-bottom ${isWatching ? 'scale-105' : ''}`}>
        
        {/* --- BUMP EFFECT --- */}
        {isHit && (
           <div className="absolute left-1/2 -translate-x-1/2 z-50" style={{ top: '-40px' }}>
              <BumpEffect />
           </div>
        )}

        {/* Neck */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-10 bg-[#dcbca0] border-x border-[#c4a488] z-10"></div>

        {/* HEAD BASE */}
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl z-20">
           {/* Face Skin */}
           <div className="w-full h-full bg-[#e8cbb0]"></div>

           {/* --- CAP --- */}
           <div className="absolute top-0 w-full h-1/2 bg-[#d8c4a4] border-b-2 border-[#bfa885] rounded-t-xl z-20">
               {isWatching && (
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-6 bg-[#3a633a] rounded-sm border border-white/30 skew-x-6 flex items-center justify-center">
                      <div className="w-4 h-2 bg-white/50"></div>
                   </div>
               )}
               <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#bfa885] rounded-full"></div>
           </div>

           {/* Cap Bill */}
           {!isWatching ? (
               <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-16 h-4 bg-[#bfa885] rounded-sm flex items-center justify-center gap-1">
                   <div className="w-1 h-1 bg-black/30 rounded-full"></div>
                   <div className="w-1 h-1 bg-black/30 rounded-full"></div>
               </div>
           ) : (
               <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[110%] h-6 bg-[#bfab8a] rounded-full shadow-md z-30"></div>
           )}

           {/* Hair */}
           <div className="absolute top-1/2 -left-1 w-3 h-10 bg-black"></div>
           <div className="absolute top-1/2 -right-1 w-3 h-10 bg-black"></div>

           {/* --- FACE DETAILS --- */}
           {isWatching && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center pt-16 z-10">
               <div className="flex gap-5 mt-3">
                  <div className="relative">
                      <div className="w-4 h-2 bg-[#2d2d2d] rounded-full"></div>
                      <div className="absolute -top-1 w-5 h-1 bg-[#2d2d2d]/30 rounded-full"></div>
                  </div>
                  <div className="relative">
                      <div className="w-4 h-2 bg-[#2d2d2d] rounded-full"></div>
                      <div className="absolute -top-1 w-5 h-1 bg-[#2d2d2d]/30 rounded-full"></div>
                  </div>
               </div>
               <div className="w-3 h-3 bg-[#d4b69c] rounded-full mt-1 shadow-sm"></div>
               {isSmiling ? (
                  <div className="mt-2 w-10 h-5 bg-white border-2 border-[#d4b69c] rounded-b-2xl flex justify-center overflow-hidden">
                     <div className="w-full h-2 bg-pink-300 mt-3 rounded-t-xl"></div>
                  </div> 
               ) : (
                  <div className="mt-3 w-4 h-1 bg-[#bfa885] rounded-full"></div>
               )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Man;
