
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Accessibility, 
  Search,
  AlertTriangle,
  Lightbulb,
  Clock,
  Map as MapIcon,
  User
} from 'lucide-react';
import { NavStep, SpatialAdvice, Path, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavControlsProps {
  currentStep: NavStep;
  activePath: Path;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isSpeaking: boolean;
  onVoiceToggle: () => void;
  spatialAdvice: SpatialAdvice | null;
  isLoadingAdvice: boolean;
  language: Language;
}

export const NavControls: React.FC<NavControlsProps> = ({
  currentStep,
  activePath,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  isSpeaking,
  onVoiceToggle,
  spatialAdvice,
  isLoadingAdvice,
  language
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="h-full flex flex-col gap-6 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white italic">{t.navigate}</h2>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onVoiceToggle}
          className={`p-3.5 rounded-2xl border transition-all ${
            isSpeaking ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          {isSpeaking ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-3">
          <Clock size={20} className="text-blue-400" />
          <div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.eta}</div>
            <div className="font-extrabold text-sm text-white">{activePath.estimatedTime}</div>
          </div>
        </div>
        <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-3">
          <MapIcon size={20} className="text-emerald-400" />
          <div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.dist}</div>
            <div className="font-extrabold text-sm text-white">{activePath.distance}</div>
          </div>
        </div>
      </div>

      <motion.div 
        key={currentStep.id}
        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className={`min-h-[160px] rounded-[40px] p-8 flex flex-col justify-center gap-4 border-2 ${
          activePath.mode === 'wheelchair' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/20'
        }`}
      >
        <p className="text-lg font-extrabold text-white leading-tight italic">{currentStep.instruction}</p>
      </motion.div>

      <div className="bg-slate-900/50 border border-white/5 rounded-[36px] p-6 space-y-4 shadow-2xl mt-auto">
        <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
          <Search size={14} /> AI CORE
        </div>
        <AnimatePresence mode="wait">
          {isLoadingAdvice ? (
            <div className="flex gap-1">
              {[0,1,2].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />)}
            </div>
          ) : spatialAdvice ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Lightbulb className="text-blue-400 shrink-0" size={16} />
                <p className="text-[10px] font-bold text-slate-300 italic">{spatialAdvice.tip}</p>
              </div>
              <div className="flex gap-3">
                <AlertTriangle className="text-orange-400 shrink-0" size={16} />
                <p className="text-[10px] font-bold text-slate-300 italic">{spatialAdvice.caution}</p>
              </div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={onPrev} disabled={!hasPrev} className="h-14 rounded-3xl bg-white/5 text-slate-400 font-black text-xs disabled:opacity-5">BACK</button>
        <button onClick={onNext} disabled={!hasNext} className="h-14 rounded-3xl bg-blue-600 text-white font-black text-xs disabled:opacity-5">NEXT</button>
      </div>
    </div>
  );
};
