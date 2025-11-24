import React from 'react';

export const PixelBlock = ({ 
  color, 
  w, 
  h, 
  className = "" 
}: { 
  color: string; 
  w: string; 
  h: string; 
  className?: string 
}) => (
  <div className={`${color} ${w} ${h} absolute ${className} shadow-sm`} />
);

// A helper for the bump animation - Pixel Art Style
export const BumpEffect = () => (
  <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
    {/* Stars/daze effect */}
    <div className="absolute -top-8 w-32 flex justify-center gap-6 animate-pulse">
       <div className="text-yellow-400 text-2xl font-bold animate-[spin_1s_infinite]">★</div>
       <div className="text-yellow-400 text-xl font-bold mt-4 animate-[spin_1.5s_infinite_reverse]">★</div>
       <div className="text-orange-400 text-lg font-bold mt-1 animate-[bounce_0.5s_infinite]">★</div>
    </div>
    
    {/* The Bump Itself (Flesh/Rose colored swelling) */}
    <div className="flex flex-col items-center drop-shadow-lg transform scale-125 origin-bottom">
       {/* Top Dome */}
       <div className="w-8 h-6 bg-[#ebaea4] rounded-t-full border-x-2 border-t-2 border-[#d68c82] relative overflow-hidden">
          {/* Shine */}
          <div className="absolute top-1 right-2 w-3 h-2 bg-white/60 rounded-full rotate-[-20deg]"></div>
       </div>
       
       {/* Swollen Base */}
       <div className="w-12 h-6 bg-[#e0988d] rounded-xl -mt-2 relative z-10 border-2 border-[#c27b70] flex items-center justify-center">
           {/* Veins */}
           <div className="w-1 h-3 bg-[#c27b70]/50 rotate-45 absolute left-2"></div>
           <div className="w-1 h-2 bg-[#c27b70]/50 -rotate-45 absolute right-3"></div>
       </div>
       
       {/* Redness at skin contact */}
       <div className="w-14 h-2 bg-[#d67c7c]/80 rounded-full -mt-1 blur-[1px]"></div>
    </div>
    
    {/* Text bubble */}
    <div className="text-white font-black text-xs mt-1 bg-red-600 px-2 py-1 rounded-lg border-2 border-white shadow-xl rotate-[-5deg]">
      OUCH!
    </div>
  </div>
);

export const Bookshelf = () => (
  <div className="w-48 h-96 bg-amber-900 border-4 border-amber-950 shadow-2xl flex flex-col justify-start p-1 relative">
    <div className="absolute -top-2 left-0 w-full h-2 bg-amber-950/50"></div>
    {[1, 2, 3, 4, 5].map((shelf) => (
      <div key={shelf} className="relative w-full flex-1 border-b-4 border-amber-950/50 flex items-end px-1 gap-[2px]">
         {/* Random Books */}
         {shelf !== 2 && (
             <>
                <div className="w-3 h-4/5 bg-red-800 rounded-sm border-r border-black/20"></div>
                <div className="w-4 h-5/6 bg-blue-900 rounded-sm border-r border-black/20"></div>
                <div className="w-2 h-3/4 bg-green-800 rounded-sm border-r border-black/20"></div>
                <div className="w-5 h-5/6 bg-yellow-800 rounded-sm border-r border-black/20"></div>
                <div className="w-3 h-4/5 bg-slate-700 rounded-sm border-r border-black/20"></div>
                {shelf % 2 === 0 && <div className="w-8 h-2/3 bg-purple-900 rounded-sm skew-x-6 border-r border-black/20"></div>}
             </>
         )}
         {shelf === 2 && (
             // Messy shelf
             <div className="w-full flex items-end justify-end gap-1">
                 <div className="w-10 h-10 bg-gray-600 rounded-full relative overflow-hidden border-2 border-gray-700">
                     <div className="absolute bottom-0 w-full h-1/2 bg-blue-400/30"></div>
                 </div>
                 <div className="w-2 h-16 bg-red-900 rotate-12 origin-bottom-left"></div>
             </div>
         )}
      </div>
    ))}
  </div>
);

export const Plant = () => (
  <div className="relative group w-24 h-32 flex flex-col items-center justify-end">
    {/* Pot */}
    <div className="w-16 h-12 bg-orange-700 rounded-b-xl border-2 border-orange-900 shadow-lg relative z-10">
      <div className="absolute top-0 w-full h-3 bg-orange-800 rounded-sm shadow-sm -ml-[1px] w-[calc(100%+2px)]"></div>
    </div>
    {/* Leaves */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full h-24 flex justify-center pointer-events-none">
       <div className="absolute bottom-0 w-2 h-12 bg-green-800"></div>
       {/* Leaf 1 */}
       <div className="absolute bottom-4 -left-4 w-12 h-12 bg-green-600 rounded-tr-[50px] rounded-bl-[50px] rotate-[-45deg] border-2 border-green-800 origin-bottom-right">
          <div className="w-full h-full bg-green-500 rounded-tr-[40px] rounded-bl-[40px] scale-75 opacity-50"></div>
       </div>
       {/* Leaf 2 */}
       <div className="absolute bottom-6 right-0 w-10 h-14 bg-green-500 rounded-tl-[50px] rounded-br-[50px] rotate-[30deg] border-2 border-green-700 origin-bottom-left"></div>
       {/* Leaf 3 */}
       <div className="absolute top-2 left-2 w-8 h-12 bg-green-700 rounded-full rotate-[-10deg] z-0"></div>
       {/* Leaf 4 */}
       <div className="absolute bottom-8 -right-6 w-8 h-8 bg-green-400 rounded-full rotate-[60deg] border border-green-800"></div>
    </div>
  </div>
);

export const StackOfBooks = () => (
    <div className="flex flex-col items-center gap-0.5 transform rotate-3">
        <div className="w-16 h-4 bg-blue-900 rounded-sm border-l-4 border-gray-100 shadow-sm relative">
            <div className="absolute right-2 top-0 h-full w-4 bg-white/10"></div>
        </div>
        <div className="w-20 h-5 bg-red-900 rounded-sm border-l-4 border-gray-100 shadow-sm relative -rotate-2">
             <div className="absolute right-8 top-0 h-full w-8 bg-white/10"></div>
        </div>
        <div className="w-14 h-4 bg-green-900 rounded-sm border-l-4 border-gray-100 shadow-sm relative rotate-1"></div>
    </div>
);

export const BigMonitor = () => (
    <div className="relative flex flex-col items-center">
        {/* Screen Bezel */}
        <div className="w-[300px] h-[180px] bg-gray-800 rounded-lg border-4 border-gray-900 shadow-2xl flex items-center justify-center relative overflow-hidden z-20">
             {/* Screen Content */}
             <div className="w-full h-full bg-slate-950 relative p-3 flex flex-col opacity-95">
                 {/* Header Bar */}
                 <div className="w-full h-6 bg-slate-800 flex items-center justify-between px-2 mb-2 rounded-sm">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="w-1/3 h-2 bg-slate-700 rounded-full"></div>
                 </div>
                 
                 {/* Main Content Area */}
                 <div className="flex gap-3 h-full">
                    {/* Left Panel: Code/Text */}
                    <div className="w-2/3 space-y-2 pt-2">
                        <div className="w-3/4 h-2 bg-blue-500 rounded-full opacity-60 animate-pulse"></div>
                        <div className="w-1/2 h-2 bg-purple-500 rounded-full opacity-60"></div>
                        <div className="w-full h-2 bg-green-500 rounded-full opacity-60"></div>
                        <div className="w-5/6 h-2 bg-blue-500 rounded-full opacity-60"></div>
                        
                        {/* A small inner window */}
                        <div className="mt-4 w-full h-20 bg-slate-900 border border-slate-700 p-1 flex items-end gap-1">
                            <div className="w-2 h-4 bg-indigo-500"></div>
                            <div className="w-2 h-8 bg-indigo-500"></div>
                            <div className="w-2 h-6 bg-indigo-500"></div>
                            <div className="w-2 h-12 bg-indigo-400"></div>
                            <div className="w-2 h-10 bg-indigo-500"></div>
                        </div>
                    </div>
                    
                    {/* Right Panel: Sidebar */}
                    <div className="w-1/3 bg-slate-900 border-l-2 border-slate-800 p-2 flex flex-col gap-2">
                        <div className="w-full h-12 bg-slate-800 rounded-sm"></div>
                        <div className="space-y-1">
                           <div className="w-full h-1 bg-gray-600"></div>
                           <div className="w-full h-1 bg-gray-600"></div>
                           <div className="w-full h-1 bg-gray-600"></div>
                        </div>
                        {/* Alert Icon placeholder if needed */}
                        <div className="mt-auto w-full h-8 border border-red-900/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                    </div>
                 </div>
             </div>
             
             {/* Screen Reflection/Glare */}
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 via-transparent to-transparent pointer-events-none z-30"></div>
        </div>
        
        {/* Monitor Neck & Stand */}
        <div className="w-12 h-16 bg-gray-700 -mt-2 z-10 shadow-inner"></div>
        <div className="w-40 h-4 bg-gray-700 rounded-t-lg shadow-md z-10"></div>
    </div>
);