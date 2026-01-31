
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ShieldAlert, 
  Accessibility, 
  ChevronRight,
  ArrowRight,
  User,
  ArrowLeft,
  Building2,
  Menu,
  X,
  RotateCcw,
  Compass,
  Globe,
  Loader2,
  UserCheck,
  Activity,
  ChevronLeft,
  Volume2,
  Languages
} from 'lucide-react';
import { AccessibleMap } from './components/AccessibleMap';
import { NavControls } from './components/NavControls';
import { INDIAN_AIRPORTS, generatePath, EMERGENCY_ROUTE, TRANSLATIONS } from './constants';
import { useVoice } from './hooks/useVoice';
import { getSpatialAdvice } from './geminiService';
import { SpatialAdvice, Location, Path, Airport, NavMode, Language } from './types';

const SiteLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 opacity-30 blur-md"
    />
    <div className="absolute inset-0 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center">
      <Compass size={size * 0.6} className="text-blue-400 relative z-10" strokeWidth={2.5} />
    </div>
  </div>
);

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [isAudioDrawerOpen, setIsAudioDrawerOpen] = useState(false);
  const [mobilityHelperStep, setMobilityHelperStep] = useState<'question' | 'finding' | 'assigned' | 'none'>('none');
  const [isPlanning, setIsPlanning] = useState(true);
  const [planningStep, setPlanningStep] = useState<0 | 1 | 2 | 3>(0); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [selectedAirport, setSelectedAirport] = useState<Airport>(INDIAN_AIRPORTS[0]);
  const [selectedMode, setSelectedMode] = useState<NavMode>('wheelchair');
  const [startLoc, setStartLoc] = useState<Location | null>(null);
  const [endLoc, setEndLoc] = useState<Location | null>(null);
  
  const [activePath, setActivePath] = useState<Path | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const [spatialAdvice, setSpatialAdvice] = useState<SpatialAdvice | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  
  const { speak, isSpeaking, stop } = useVoice();
  const t = TRANSLATIONS[language];

  const handleVoiceToggle = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else if (activePath) {
      speak(activePath.steps[currentStepIndex].instruction, language);
    }
  }, [isSpeaking, stop, activePath, currentStepIndex, speak, language]);

  // Regenerate path if language changes mid-navigation to update instruction strings
  useEffect(() => {
    if (activePath && startLoc && endLoc && !isEmergency) {
      const updatedPath = generatePath(selectedAirport, startLoc, endLoc, selectedMode, language);
      setActivePath(updatedPath);
    }
  }, [language, selectedAirport, startLoc, endLoc, selectedMode, isEmergency]);

  useEffect(() => {
    setStartLoc(null);
    setEndLoc(null);
  }, [selectedAirport]);

  const fetchAdvice = useCallback(async () => {
    if (!activePath || isEmergency) return;
    const currentStep = activePath.steps[currentStepIndex];
    setIsLoadingAdvice(true);
    try {
      const advice = await getSpatialAdvice(currentStep.instruction, activePath.to, language);
      setSpatialAdvice(advice);
    } catch (error) {
      console.error("AI Advice failed", error);
      // Even though geminiService has its own catch, we provide a final safety net here
      const localFallbacks: Record<Language, SpatialAdvice> = {
        en: { tip: "Follow the blue markers for the smoothest tiles.", caution: "Watch for crowd clusters near main exits." },
        hi: { tip: "सुगम टाइलों के लिए नीले निशानों का पालन करें।", caution: "मुख्य निकास के पास भीड़ से सावधान रहें।" },
        te: { tip: "మృదువైన టైల్స్ కోసం నీలిరంగు గుర్తులను అనుసరించండి.", caution: "ప్రధాన నిష్క్రమణల వద్ద రద్దీని గమనించండి." },
        ta: { tip: "மென்மையான தரைக்கு நீல நிறக் குறிகளைப் பின்தொடரவும்.", caution: "முக்கிய வெளியேறும் இடங்களில் நெரிசலைக் கவனியுங்கள்." },
        ml: { tip: "സുഗമമായ യാത്രയ്ക്കായി നീല അടയാളങ്ങൾ പിന്തുടരുക.", caution: "പ്രധാന കവാടത്തിന് സമീപം തിരക്ക് ശ്രദ്ധിക്കുക." }
      };
      setSpatialAdvice(localFallbacks[language] || localFallbacks.en);
    } finally {
      setIsLoadingAdvice(false);
    }
  }, [currentStepIndex, activePath, isEmergency, language]);

  useEffect(() => {
    if (!isPlanning && activePath) {
      fetchAdvice();
    }
  }, [currentStepIndex, fetchAdvice, isPlanning, activePath]);

  const handleStartNavigation = () => {
    if (startLoc && endLoc) {
      const path = generatePath(selectedAirport, startLoc, endLoc, selectedMode, language);
      setActivePath(path);
      setCurrentStepIndex(0);
      setIsPlanning(false);
      speak(t.commence, language);
    }
  };

  const handleMobilityResponse = (needed: boolean) => {
    if (needed) {
      setMobilityHelperStep('finding');
      setTimeout(() => {
        setMobilityHelperStep('assigned');
        setTimeout(() => {
          setPlanningStep(1);
        }, 2000);
      }, 2500);
    } else {
      setPlanningStep(1);
    }
  };

  const triggerEmergency = () => {
    if (!isEmergency) {
      setIsEmergency(true);
      setActivePath(EMERGENCY_ROUTE);
      setCurrentStepIndex(0);
      setIsPlanning(false);
      speak("SOS ACTIVE. Evacuating now.", 'en'); 
    } else {
      setIsEmergency(false);
      setIsPlanning(true);
      setPlanningStep(1);
    }
  };

  const sidebarVariants: Variants = {
    open: { width: 'min(90vw, 400px)', opacity: 1, x: 0 },
    closed: { width: 0, opacity: 0, x: -100 }
  };

  const languageOptions: { id: Language; label: string; native: string }[] = [
    { id: 'en', label: 'English', native: 'English' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { id: 'te', label: 'Telugu', native: 'తెలుగు' },
    { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { id: 'ml', label: 'Malayalam', native: 'മലയാളം' }
  ];

  return (
    <div className="fixed inset-0 flex overflow-hidden font-sans select-none text-slate-100">
      
      {/* Audio Language Drawer */}
      <AnimatePresence>
        {isAudioDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAudioDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 rounded-t-[40px] z-[160] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="max-w-md mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <Languages className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight italic uppercase">Audio Language</h3>
                  </div>
                  <button 
                    onClick={() => setIsAudioDrawerOpen(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid gap-3">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setLanguage(opt.id);
                        setIsAudioDrawerOpen(false);
                      }}
                      className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${
                        language === opt.id 
                          ? 'bg-blue-600 border-blue-400 text-white' 
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-black text-sm uppercase tracking-wide">{opt.label}</div>
                        <div className={`text-[11px] opacity-60 ${language === opt.id ? 'text-white' : 'text-slate-400'}`}>
                          {opt.native}
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${language === opt.id ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Volume2 size={18} className={language === opt.id ? 'animate-pulse' : ''} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SOS EXIT Button */}
      <AnimatePresence>
        {!isPlanning && activePath && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-[110]"
          >
            <button
              onClick={triggerEmergency}
              className={`px-5 py-4 rounded-3xl font-black text-[10px] flex items-center gap-3 shadow-2xl border-2 transition-all ${
                isEmergency ? 'bg-white text-red-600 border-red-600' : 'bg-red-600/90 text-white border-white/20'
              }`}
            >
              <ShieldAlert size={18} className={isEmergency ? 'animate-bounce' : ''} />
              <span>{isEmergency ? t.cancelSos : t.sos}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="h-full bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-8 pb-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SiteLogo size={36} />
                <div>
                  <h1 className="text-lg font-extrabold text-white leading-none tracking-tight">PATHFINDER</h1>
                  <p className="text-[9px] uppercase tracking-widest text-blue-400 mt-1.5 font-bold">Aero Transit AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAudioDrawerOpen(true)}
                  className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-2 rounded-xl text-[10px] font-black text-blue-400 hover:bg-blue-500/20 transition-all uppercase tracking-tighter"
                >
                  <Languages size={14} />
                  <span>{language.toUpperCase()}</span>
                </button>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {isPlanning ? (
                  <div className="p-8 space-y-10">
                    
                    {/* STEP 0: MOBILITY HELPER QUESTION */}
                    {planningStep === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <Accessibility size={32} className="text-blue-400" />
                          </div>
                          <h2 className="text-xl font-black text-white italic">{t.helperTitle}</h2>
                          <p className="text-sm text-slate-400 font-bold">{t.helperQuestion}</p>
                        </div>
                        
                        <div className="space-y-4">
                          {mobilityHelperStep === 'finding' ? (
                            <div className="flex flex-col items-center gap-4 p-8 bg-white/5 rounded-3xl border border-white/10">
                              <Loader2 className="animate-spin text-blue-400" size={32} />
                              <span className="text-xs font-black text-blue-400 animate-pulse uppercase">{t.findingHelper}</span>
                            </div>
                          ) : mobilityHelperStep === 'assigned' ? (
                            <motion.div 
                              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                              className="flex flex-col items-center gap-4 p-8 bg-emerald-500/10 rounded-3xl border border-emerald-500/50"
                            >
                              <UserCheck className="text-emerald-500" size={32} />
                              <span className="text-xs font-black text-emerald-500 uppercase">{t.helperFound}</span>
                            </motion.div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleMobilityResponse(true)}
                                className="w-full p-6 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 hover:bg-blue-500 transition-all"
                              >
                                {t.yes}
                              </button>
                              <button
                                onClick={() => handleMobilityResponse(false)}
                                className="w-full p-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-sm active:scale-95 hover:bg-white/10 transition-all"
                              >
                                {t.no}
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 1: HUB SELECTION */}
                    {planningStep === 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase italic">{t.selectHub}</h2>
                        <div className="grid gap-3">
                          {INDIAN_AIRPORTS.map(airport => (
                            <button
                              key={airport.id}
                              onClick={() => { setSelectedAirport(airport); setPlanningStep(2); }}
                              className={`p-4 rounded-2xl border transition-all text-sm font-semibold text-left group relative overflow-hidden ${
                                selectedAirport.id === airport.id 
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-100' 
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                              }`}
                            >
                              <div className="relative z-10">
                                <div className="text-white group-hover:text-amber-300 transition-colors">{airport.name}</div>
                                <div className="text-[10px] uppercase opacity-40 group-hover:opacity-100 transition-opacity">{airport.city} • {airport.code}</div>
                              </div>
                              {selectedAirport.id === airport.id && (
                                <motion.div layoutId="selection-glow" className="absolute inset-0 bg-amber-500/5 blur-xl pointer-events-none" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: TRAVELER PROFILE */}
                    {planningStep === 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <button onClick={() => setPlanningStep(1)} className="text-blue-400 text-[10px] font-bold flex items-center gap-2 hover:text-blue-300 transition-colors"><ArrowLeft size={12}/> CHANGE HUB</button>
                        <h2 className="text-xl font-bold text-white uppercase italic">{t.traveler}</h2>
                        <div className="grid gap-4">
                          <button
                            onClick={() => { setSelectedMode('wheelchair'); setPlanningStep(3); }}
                            className={`p-6 rounded-3xl border text-left transition-all group ${
                              selectedMode === 'wheelchair' ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-white/5 border-white/5'
                            }`}
                          >
                            <Accessibility size={28} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-extrabold text-sm uppercase italic">Wheelchair</div>
                          </button>
                          <button
                            onClick={() => { setSelectedMode('standard'); setPlanningStep(3); }}
                            className={`p-6 rounded-3xl border text-left transition-all group ${
                              selectedMode === 'standard' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/5'
                            }`}
                          >
                            <User size={28} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-extrabold text-sm uppercase italic">Standard</div>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: DESTINATION */}
                    {planningStep === 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <button onClick={() => setPlanningStep(2)} className="text-blue-400 text-[10px] font-bold flex items-center gap-2 hover:text-blue-300 transition-colors"><ArrowLeft size={12}/> CHANGE PROFILE</button>
                        <h2 className="text-xl font-bold text-white uppercase italic">{t.destination}</h2>
                        <div className="space-y-4">
                           <div className="relative group">
                             <select 
                              value={startLoc?.id || ""}
                              onChange={(e) => setStartLoc(selectedAirport.locations.find(l => l.id === e.target.value) || null)}
                              className="w-full p-4 rounded-2xl bg-slate-900/50 border border-white/10 text-white font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all hover:bg-slate-800"
                            >
                              <option value="" className="bg-slate-900">Start location...</option>
                              {selectedAirport.locations.map(loc => <option key={loc.id} value={loc.id} className="bg-slate-900">{loc.name}</option>)}
                            </select>
                            <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-amber-400 rotate-90 transition-all pointer-events-none" />
                           </div>
                           
                           <div className="relative group">
                             <select 
                              value={endLoc?.id || ""}
                              onChange={(e) => setEndLoc(selectedAirport.locations.find(l => l.id === e.target.value) || null)}
                              className="w-full p-4 rounded-2xl bg-slate-900/50 border border-white/10 text-white font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all hover:bg-slate-800"
                            >
                              <option value="" className="bg-slate-900">Destination...</option>
                              {selectedAirport.locations.map(loc => <option key={loc.id} value={loc.id} className="bg-slate-900">{loc.name}</option>)}
                            </select>
                            <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-amber-400 rotate-90 transition-all pointer-events-none" />
                           </div>

                          <button
                            disabled={!startLoc || !endLoc || startLoc.id === endLoc.id}
                            onClick={handleStartNavigation}
                            className="w-full h-14 bg-white text-slate-900 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-3 disabled:opacity-20 mt-6 shadow-xl hover:bg-amber-400 transition-colors"
                          >
                            {t.commence} <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : activePath ? (
                  <div className="flex flex-col h-full">
                    <NavControls
                      currentStep={activePath.steps[currentStepIndex]}
                      activePath={activePath}
                      onNext={() => currentStepIndex < activePath.steps.length - 1 && setCurrentStepIndex(c => c + 1)}
                      onPrev={() => currentStepIndex > 0 && setCurrentStepIndex(c => c - 1)}
                      hasNext={currentStepIndex < activePath.steps.length - 1}
                      hasPrev={currentStepIndex > 0}
                      isSpeaking={isSpeaking}
                      onVoiceToggle={handleVoiceToggle}
                      spatialAdvice={spatialAdvice}
                      isLoadingAdvice={isLoadingAdvice}
                      language={language}
                    />
                    <button 
                      onClick={() => setIsPlanning(true)}
                      className="m-8 p-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] hover:bg-white/10 transition-colors"
                    >
                      <RotateCcw size={14} className="inline mr-2" /> RECONFIGURE
                    </button>
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map Area */}
      <main className="flex-1 relative flex items-center justify-center p-8 lg:p-16 overflow-hidden">
        
        {!isSidebarOpen && (
           <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-6 left-6 z-[60] p-4 bg-slate-950/90 text-white rounded-[24px] shadow-2xl border border-white/10 hover:bg-slate-900 transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Legend Overlay */}
        <AnimatePresence>
          {!isPlanning && activePath && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-12 z-[100] px-6 py-3 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-6 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.congestion}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-200">{t.high}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span className="text-[10px] font-bold text-slate-200">{t.med}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-200">{t.quiet}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="w-full h-full lg:w-[92%] lg:h-[95%] bg-white rounded-[64px] overflow-hidden relative shadow-2xl border-[12px] border-slate-950/80"
        >
          <AnimatePresence mode="wait">
            {activePath ? (
              <>
                <AccessibleMap 
                  steps={activePath.steps} 
                  currentStepIndex={currentStepIndex} 
                  isEmergency={isEmergency} 
                  obstacles={selectedAirport.obstacles}
                  isAccessiblePath={selectedMode === 'wheelchair'}
                />
                
                {/* Floating Map Controls */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 right-6 z-[120] flex items-center gap-3"
                >
                  <button 
                    onClick={() => setIsPlanning(true)}
                    className="px-5 py-4 rounded-3xl font-black text-[10px] flex items-center gap-3 shadow-2xl border-2 bg-slate-900/90 backdrop-blur-md text-white border-white/20 hover:bg-slate-800 transition-all"
                  >
                    <RotateCcw size={18} />
                    <span>REROUTE</span>
                  </button>

                  <button 
                    onClick={() => currentStepIndex > 0 && setCurrentStepIndex(c => c - 1)}
                    disabled={currentStepIndex === 0}
                    className="px-5 py-4 rounded-3xl font-black text-[10px] flex items-center gap-3 shadow-2xl border-2 bg-slate-900/90 backdrop-blur-md text-white border-white/20 hover:bg-slate-800 transition-all disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                    <span>PREVIOUS</span>
                  </button>

                  <button 
                    onClick={() => currentStepIndex < activePath.steps.length - 1 && setCurrentStepIndex(c => c + 1)}
                    disabled={currentStepIndex === activePath.steps.length - 1}
                    className="px-5 py-4 rounded-3xl font-black text-[10px] flex items-center gap-3 shadow-2xl border-2 bg-blue-600 text-white border-white/20 hover:bg-blue-500 transition-all disabled:opacity-30 shadow-blue-500/20"
                  >
                    <span>NEXT</span>
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-100 bg-slate-950">
                 <SiteLogo size={100} />
                 <h2 className="text-2xl font-extrabold uppercase tracking-widest opacity-30 italic mt-8">Satellite Uplink Ready</h2>
                 <p className="text-xs font-bold text-blue-400/40 tracking-[0.3em] uppercase mt-4">Awaiting Indian Hub Selection</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Welcome Screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-950/98 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
              className="bg-slate-900 max-w-sm w-full rounded-[64px] p-12 text-center border border-white/5 space-y-12 shadow-2xl"
            >
              <SiteLogo size={64} className="mx-auto" />
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-white tracking-tighter italic uppercase">{t.welcome}</h2>
                <p className="text-sm text-slate-400 font-bold leading-relaxed">{t.tagline}</p>
              </div>
              <button 
                onClick={() => setShowWelcome(false)} 
                className="w-full h-16 bg-blue-600 text-white font-black text-sm rounded-3xl active:scale-95 hover:bg-blue-500 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
              >
                {t.initialize}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
