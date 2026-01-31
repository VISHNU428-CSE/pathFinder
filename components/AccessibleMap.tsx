
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NavStep, Density, MapObstacle, ObstacleType } from '../types';
import { AIRPORT_MAP_SIZE } from '../constants';
import { User, Info, ArrowUpCircle, Square, Layers, Scaling, MoveRight, MoveLeft, MoveUp, MapPin, Flag, Navigation, Accessibility } from 'lucide-react';

interface AccessibleMapProps {
  steps: NavStep[];
  currentStepIndex: number;
  isEmergency: boolean;
  obstacles: MapObstacle[];
  isAccessiblePath: boolean;
}

const getDensityColor = (density: Density) => {
  switch (density) {
    case Density.Low: return 'rgba(34, 197, 94, 0.08)';
    case Density.Medium: return 'rgba(234, 179, 8, 0.12)';
    case Density.High: return 'rgba(239, 68, 68, 0.15)';
    default: return 'transparent';
  }
};

const CrowdAvatar = ({ x, y, density }: { x: number, y: number, density: Density }) => {
  const color = density === Density.High ? '#ef4444' : density === Density.Medium ? '#f59e0b' : '#10b981';
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ 
        x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
        y: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <circle cx={x} cy={y} r="2.5" fill={color} />
    </motion.g>
  );
};

const ObstacleIcon = ({ type, size = 18 }: { type: ObstacleType, size?: number }) => {
  switch (type) {
    case ObstacleType.Stairs: return <Layers size={size} className="text-red-600" />;
    case ObstacleType.Escalator: return <Scaling size={size} className="text-orange-500" />;
    case ObstacleType.Lift: return <ArrowUpCircle size={size} className="text-blue-600" />;
    case ObstacleType.Ramp: return <Square size={size} className="text-emerald-500 rotate-45" />;
    default: return <Info size={size} />;
  }
};

const getCheckpointLabel = (instruction: string) => {
  return instruction
    .replace(/Start at |Arrive at: |Security screening point\.|Head toward |Use | for accessibility\./g, '')
    .trim();
};

export const AccessibleMap: React.FC<AccessibleMapProps> = ({ steps, currentStepIndex, isEmergency, obstacles, isAccessiblePath }) => {
  const currentPos = steps[currentStepIndex].point;

  const pathD = useMemo(() => {
    if (steps.length < 2) return "";
    let d = `M ${steps[0].point.x} ${steps[0].point.y}`;
    for (let i = 1; i < steps.length; i++) {
      d += ` L ${steps[i].point.x} ${steps[i].point.y}`;
    }
    return d;
  }, [steps]);

  // Procedural Evelity-style "Indoor Rooms" 
  const floorPlan = useMemo(() => (
    <g opacity="0.4">
      {/* Background Lock - Forced White */}
      <rect x="0" y="0" width={AIRPORT_MAP_SIZE.width} height={AIRPORT_MAP_SIZE.height} fill="white" />
      
      {/* Main Hall Layout */}
      <rect x="20" y="20" width="760" height="560" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      {/* Room Divisions */}
      <rect x="50" y="50" width="200" height="150" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="4" />
      <rect x="300" y="50" width="450" height="150" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="4" />
      <rect x="50" y="400" width="250" height="150" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="4" />
      <rect x="350" y="400" width="400" height="150" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="4" />
      {/* Central Island */}
      <circle cx="400" cy="300" r="60" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
    </g>
  ), []);

  return (
    <div className="w-full h-full bg-white overflow-hidden relative">
      <svg viewBox={`0 0 ${AIRPORT_MAP_SIZE.width} ${AIRPORT_MAP_SIZE.height}`} className="w-full h-full block">
        <defs>
          <filter id="evelity-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Layer */}
        <rect width="100%" height="100%" fill="white" />

        {/* Indoor Floor Plan Layout */}
        {floorPlan}

        {/* Accessibility Zones */}
        {steps.map((s, i) => (
          <circle key={`zone-${i}`} cx={s.point.x} cy={s.point.y} r={80} fill={getDensityColor(s.density)} />
        ))}

        {/* The Route Path (Evelity Bold Style) */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={isEmergency ? "#ef4444" : (isAccessiblePath ? "#10b981" : "#3b82f6")}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
          className="opacity-10"
        />

        <motion.path
          d={pathD}
          fill="none"
          stroke={isEmergency ? "#ef4444" : (isAccessiblePath ? "#10b981" : "#3b82f6")}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1, 20"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />

        {/* Infrastructure Nodes (Elevators, Stairs) */}
        {obstacles.map((obs, i) => (
          <g key={`obs-${i}`} transform={`translate(${obs.point.x}, ${obs.point.y})`} filter="url(#evelity-shadow)">
            <rect x="-24" y="-24" width="48" height="48" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
            <foreignObject x="-14" y="-14" width="28" height="28">
              <div className="flex items-center justify-center h-full"><ObstacleIcon type={obs.type} size={22} /></div>
            </foreignObject>
            <text y="42" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-400 uppercase tracking-tighter">{obs.label}</text>
          </g>
        ))}

        {/* Location Markers & Checkpoint Names */}
        {steps.map((s, i) => {
          const isStart = i === 0;
          const isEnd = i === steps.length - 1;
          const label = getCheckpointLabel(s.instruction);
          
          return (
            <g key={`marker-${i}`} transform={`translate(${s.point.x}, ${s.point.y})`}>
               <motion.circle 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                r={isStart || isEnd ? 10 : 5} 
                fill={isStart ? "#3b82f6" : isEnd ? "#10b981" : "#94a3b8"} 
                stroke="white" strokeWidth={isStart || isEnd ? 3 : 2} 
               />
               
               <g transform="translate(0, -22)" filter="url(#evelity-shadow)">
                  <rect x="-45" y="-12" width="90" height="18" rx="9" fill="white" className="opacity-95" />
                  <text textAnchor="middle" y="1" className="text-[9px] font-black fill-slate-900 uppercase italic tracking-tight">
                    {label || (isStart ? "START" : isEnd ? "GOAL" : "WAYPOINT")}
                  </text>
               </g>
            </g>
          );
        })}

        {/* User Marker */}
        <motion.g animate={{ x: currentPos.x, y: currentPos.y }} transition={{ type: "spring", stiffness: 80, damping: 20 }}>
          <motion.circle 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            r="40" fill={isAccessiblePath ? "#10b981" : "#3b82f6"}
          />
          <circle r="28" fill="#0f172a" filter="url(#evelity-shadow)" />
          <foreignObject x="-14" y="-14" width="28" height="28">
            <div className="text-white flex items-center justify-center">
              {isAccessiblePath ? <Accessibility size={22} /> : <User size={22} />}
            </div>
          </foreignObject>
          <g transform="rotate(-45)">
            <path d="M 0 -35 L 5 -25 L -5 -25 Z" fill="#0f172a" />
          </g>
        </motion.g>

        {/* Crowd Density Dots */}
        {steps.map((s, si) => 
          Array.from({ length: s.density === Density.High ? 8 : 2 }).map((_, i) => (
            <CrowdAvatar key={`dots-${si}-${i}`} x={s.point.x} y={s.point.y} density={s.density} />
          ))
        )}
      </svg>
      
      {isEmergency && (
        <div className="absolute inset-0 bg-red-600/5 backdrop-blur-[2px] pointer-events-none flex flex-col items-center justify-center gap-4">
          <div className="bg-red-600 text-white px-10 py-6 rounded-[40px] font-black text-3xl italic animate-pulse shadow-2xl border-4 border-white/20">
            EMERGENCY ROUTE
          </div>
          <p className="text-red-600 font-bold bg-white/90 px-4 py-1 rounded-full text-xs uppercase tracking-widest">Follow Floor Markers</p>
        </div>
      )}
    </div>
  );
};
