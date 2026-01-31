
import { Path, Density, Location, NavStep, Airport, ObstacleType, NavMode, Language } from './types';

export const AIRPORT_MAP_SIZE = { width: 800, height: 600 };

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: "WELCOME",
    tagline: "Precision Indoor Navigation",
    initialize: "INITIALIZE ENGINE",
    helperTitle: "MOBILITY ASSISTANCE",
    helperQuestion: "Do you require a mobility helper for your journey?",
    yes: "YES, REQUEST HELPER",
    no: "NO, I'M INDEPENDENT",
    findingHelper: "LOCATING NEAREST HELPER...",
    helperFound: "HELPER ASSIGNED: ARJUN V.",
    selectHub: "SELECT HUB",
    traveler: "TRAVELER PROFILE",
    destination: "FLIGHT GATE",
    commence: "COMMENCE MISSION",
    eta: "ETA",
    dist: "DISTANCE",
    navigate: "NAVIGATE",
    congestion: "Congestion Levels",
    high: "High Traffic",
    med: "Medium Flow",
    quiet: "Quiet Path",
    sos: "EMERGENCY EXIT (SOS)",
    cancelSos: "CANCEL EVACUATION",
    stepStart: "Start at ",
    stepHead: "Head toward corridor junction.",
    stepSecurity: "Security screening point.",
    stepUse: "Use ",
    stepAccessibility: " for accessibility.",
    stepArrive: "Arrive at: "
  },
  hi: {
    welcome: "स्वागत है",
    tagline: "सटीक इनडोर नेविगेशन",
    initialize: "इंजन शुरू करें",
    helperTitle: "गतिशीलता सहायता",
    helperQuestion: "क्या आपको अपनी यात्रा के लिए सहायक की आवश्यकता है?",
    yes: "हाँ, सहायक का अनुरोध करें",
    no: "नहीं, मैं स्वतंत्र हूँ",
    findingHelper: "निकटतम सहायक की तलाश...",
    helperFound: "सहायक नियुक्त: अर्जुन वी.",
    selectHub: "हब चुनें",
    traveler: "यात्री प्रोफाइल",
    destination: "फ्लाइट गेट",
    commence: "मिशन शुरू करें",
    eta: "समय",
    dist: "दूरी",
    navigate: "नेविगेट करें",
    congestion: "भीड़ का स्तर",
    high: "अधिक भीड़",
    med: "सामान्य",
    quiet: "शांत रास्ता",
    sos: "आपातकालीन निकास",
    cancelSos: "निकासी रद्द करें",
    stepStart: "शुरू करें: ",
    stepHead: "कॉरिडोर जंक्शन की ओर बढ़ें।",
    stepSecurity: "सुरक्षा जांच बिंदु।",
    stepUse: "उपयोग करें: ",
    stepAccessibility: " सुलभता के लिए।",
    stepArrive: "पहुंचें: "
  },
  te: {
    welcome: "స్వాగతం",
    tagline: "ఖచ్చితమైన ఇండోర్ నావిగేషన్",
    initialize: "ప్రారంభించు",
    helperTitle: "మొబిలిటీ సహాయం",
    helperQuestion: "మీ ప్రయాణం కోసం మీకు మొబిలిటీ హెల్పర్ అవసరమా?",
    yes: "అవును, హెల్పర్‌ని కోరండి",
    no: "లేదు, నేను స్వతంత్రంగా వెళ్తాను",
    findingHelper: "సమీప హెల్పర్‌ను వెతుకుతోంది...",
    helperFound: "హెల్పర్ కేటాయించబడింది: అర్జున్ వి.",
    selectHub: "విమానాశ్రయాన్ని ఎంచుకోండి",
    traveler: "ప్రయాణీకుల ప్రొఫైల్",
    destination: "ఫ్లైట్ గేట్",
    commence: "ప్రయాణాన్ని ప్రారంభించండి",
    eta: "సమయం",
    dist: "దూరం",
    navigate: "నావిగేట్",
    congestion: "రద్దీ స్థాయిలు",
    high: "ఎక్కువ రద్దీ",
    med: "మధ్యస్థ రద్దీ",
    quiet: "ప్రశాంత మార్గం",
    sos: "అత్యవసర నిష్క్రమణ (SOS)",
    cancelSos: "తరలింపును రద్దు చేయండి",
    stepStart: "ప్రారంభం: ",
    stepHead: "కారిడార్ జంక్షన్ వైపు వెళ్ళండి.",
    stepSecurity: "సెక్యూరిటీ స్క్రీనింగ్ పాయింట్.",
    stepUse: "ఉపయోగించండి: ",
    stepAccessibility: " యాక్సెసిబిలిటీ కోసం.",
    stepArrive: "చేరుకోండి: "
  },
  ta: {
    welcome: "வரவேற்பு",
    tagline: "துல்லியமான உட்புற வழிசெலுத்தல்",
    initialize: "தொடங்கவும்",
    helperTitle: "இயக்க உதவி",
    helperQuestion: "உங்கள் பயணத்திற்கு இயக்க உதவியாளர் தேவையா?",
    yes: "ஆம், உதவியாளரைக் கோரவும்",
    no: "இல்லை, நான் சுதந்திரமானவன்",
    findingHelper: "அருகிலுள்ள உதவியாளரைக் கண்டறிகிறது...",
    helperFound: "உதவியாளர் நியமிக்கப்பட்டார்: அர்ஜுன் வி.",
    selectHub: "மையத்தைத் தேர்ந்தெடுக்கவும்",
    traveler: "பயணியின் சுயவிவரம்",
    destination: "விமான வாயில்",
    commence: "பயணத்தைத் தொடங்கு",
    eta: "நேரம்",
    dist: "தூரம்",
    navigate: "வழிசெலுத்து",
    congestion: "நெரிசல் நிலைகள்",
    high: "அதிக போக்குவரத்து",
    med: "மிதமான ஓட்டம்",
    quiet: "அமைதியான பாதை",
    sos: "அவசரகால வெளியேற்றம் (SOS)",
    cancelSos: "வெளியேற்றத்தை ரத்து செய்",
    stepStart: "தொடக்க இடம்: ",
    stepHead: "தாழ்வார சந்திப்பை நோக்கிச் செல்லவும்.",
    stepSecurity: "பாதுகாப்பு சோதனை மையம்.",
    stepUse: "பயன்படுத்தவும்: ",
    stepAccessibility: " எளிதாக செல்ல.",
    stepArrive: "சென்றடையும் இடம்: "
  },
  ml: {
    welcome: "സ്വാഗതം",
    tagline: "കൃത്യമായ ഇൻഡോർ നാവിഗേഷൻ",
    initialize: "തുടങ്ങുക",
    helperTitle: "മൊബിലിറ്റി സഹായം",
    helperQuestion: "നിങ്ങളുടെ യാത്രയ്ക്ക് ഒരു സഹായിയെ ആവശ്യമുണ്ടോ?",
    yes: "അതെ, സഹായിയെ ആവശ്യപ്പെടുക",
    no: "ഇല്ല, ഞാൻ ഒറ്റയ്ക്ക് പോകും",
    findingHelper: "സഹായിയെ കണ്ടെത്തുന്നു...",
    helperFound: "സഹായിയെ നിയോഗിച്ചു: അർജുൻ വി.",
    selectHub: "വിമാനത്താവളം തിരഞ്ഞെടുക്കുക",
    traveler: "യാത്രക്കാരന്റെ വിവരങ്ങൾ",
    destination: "ഫ്ലൈറ്റ് ഗേറ്റ്",
    commence: "യാത്ര ആരംഭിക്കുക",
    eta: "സമയം",
    dist: "ദൂരം",
    navigate: "നാവിഗേറ്റ് ചെയ്യുക",
    congestion: "തിരക്ക് നില",
    high: "കൂടുതൽ തിരക്ക്",
    med: "മിതമായ തിരക്ക്",
    quiet: "ശാന്തമായ വഴി",
    sos: "അടിയന്തര പുറത്തുകടക്കൽ (SOS)",
    cancelSos: "ഒഴിപ്പിക്കൽ റദ്ദാക്കുക",
    stepStart: "ആരംഭം: ",
    stepHead: "കോറിഡോർ ജംഗ്ഷനിലേക്ക് നീങ്ങുക.",
    stepSecurity: "സെക്യൂരിറ്റി പരിശോധനാ കേന്ദ്രം.",
    stepUse: "ഉപയോഗിക്കുക: ",
    stepAccessibility: " എളുപ്പത്തിലുള്ള യാത്രയ്ക്ക്.",
    stepArrive: "എത്തിച്ചേരുക: "
  }
};

export const INDIAN_AIRPORTS: Airport[] = [
  {
    id: 'del-t3',
    name: 'Delhi IGI Terminal 3',
    city: 'Delhi',
    code: 'DEL',
    locations: [
      { id: 'del-e1', name: 'Main Entry Gate 1', point: { x: 50, y: 300 }, type: 'service' },
      { id: 'del-check-a', name: 'Check-in Counter A', point: { x: 150, y: 100 }, type: 'checkin' },
      { id: 'del-sec-intl', name: 'Security Check-In', point: { x: 300, y: 300 }, type: 'security' },
      { id: 'del-g1', name: 'Gate 01', point: { x: 700, y: 50 }, type: 'gate' },
      { id: 'del-g15', name: 'Gate 15', point: { x: 750, y: 300 }, type: 'gate' },
      { id: 'del-lounge', name: 'Plaza Premium Lounge', point: { x: 450, y: 150 }, type: 'service' },
    ],
    obstacles: [
      { type: ObstacleType.Escalator, point: { x: 400, y: 200 }, label: 'Main Escalator' },
      { type: ObstacleType.Lift, point: { x: 420, y: 400 }, label: 'Priority Lift' },
    ]
  },
  {
    id: 'bom-t2',
    name: 'Mumbai CSMIA T2',
    city: 'Mumbai',
    code: 'BOM',
    locations: [
      { id: 'bom-e', name: 'Level 4 Departure Entry', point: { x: 100, y: 300 }, type: 'service' },
      { id: 'bom-check-b', name: 'Check-in Island B', point: { x: 200, y: 150 }, type: 'checkin' },
      { id: 'bom-sec', name: 'Central Security', point: { x: 350, y: 300 }, type: 'security' },
      { id: 'bom-g65', name: 'Gate 65', point: { x: 700, y: 100 }, type: 'gate' },
      { id: 'bom-g80', name: 'Gate 80', point: { x: 720, y: 500 }, type: 'gate' },
    ],
    obstacles: [
      { type: ObstacleType.Lift, point: { x: 300, y: 150 }, label: 'Elevator 4B' },
    ]
  },
  {
    id: 'blr-t2',
    name: 'Bengaluru Kempegowda T2',
    city: 'Bengaluru',
    code: 'BLR',
    locations: [
      { id: 'blr-e', name: 'Main Entry Forest Plaza', point: { x: 50, y: 300 }, type: 'service' },
      { id: 'blr-check', name: 'Island D Check-in', point: { x: 180, y: 120 }, type: 'checkin' },
      { id: 'blr-sec', name: 'Domestic Security', point: { x: 320, y: 300 }, type: 'security' },
      { id: 'blr-g201', name: 'Gate 201', point: { x: 680, y: 80 }, type: 'gate' },
      { id: 'blr-g215', name: 'Gate 215', point: { x: 740, y: 450 }, type: 'gate' },
    ],
    obstacles: [
      { type: ObstacleType.Ramp, point: { x: 250, y: 300 }, label: 'Garden Ramp' },
      { type: ObstacleType.Lift, point: { x: 400, y: 100 }, label: 'Lift L3' },
    ]
  },
  {
    id: 'hyd-rgi',
    name: 'Hyderabad Rajiv Gandhi Intl',
    city: 'Hyderabad',
    code: 'HYD',
    locations: [
      { id: 'hyd-e', name: 'Departure Entry 3', point: { x: 80, y: 300 }, type: 'service' },
      { id: 'hyd-sec', name: 'Domestic Security South', point: { x: 350, y: 300 }, type: 'security' },
      { id: 'hyd-g22', name: 'Gate 22', point: { x: 710, y: 120 }, type: 'gate' },
      { id: 'hyd-g30', name: 'Gate 30', point: { x: 750, y: 400 }, type: 'gate' },
    ],
    obstacles: [
      { type: ObstacleType.Lift, point: { x: 450, y: 200 }, label: 'Main Concourse Lift' },
    ]
  },
  {
    id: 'maa-t4',
    name: 'Chennai International T4',
    city: 'Chennai',
    code: 'MAA',
    locations: [
      { id: 'maa-e', name: 'Departure Entry 1', point: { x: 60, y: 300 }, type: 'service' },
      { id: 'maa-sec', name: 'Domestic Security', point: { x: 300, y: 300 }, type: 'security' },
      { id: 'maa-g4', name: 'Gate 4', point: { x: 650, y: 90 }, type: 'gate' },
      { id: 'maa-g12', name: 'Gate 12', point: { x: 730, y: 480 }, type: 'gate' },
    ],
    obstacles: [
      { type: ObstacleType.Lift, point: { x: 350, y: 150 }, label: 'Elevator Alpha' },
    ]
  },
  {
    id: 'cok-t3',
    name: 'Kochi International T3',
    city: 'Kochi',
    code: 'COK',
    locations: [
      { id: 'cok-e', name: 'Main Departure Porch', point: { x: 40, y: 300 }, type: 'service' },
      { id: 'cok-check', name: 'Check-in Row C', point: { x: 150, y: 150 }, type: 'checkin' },
      { id: 'cok-sec', name: 'International Security', point: { x: 320, y: 300 }, type: 'security' },
      { id: 'cok-g1', name: 'Gate 1', point: { x: 700, y: 70 }, type: 'gate' },
      { id: 'cok-g9', name: 'Gate 9', point: { x: 760, y: 420 }, type: 'gate' },
    ],
    obstacles: [
      { type: ObstacleType.Ramp, point: { x: 280, y: 300 }, label: 'Kerala Heritage Ramp' },
    ]
  },
  {
    id: 'ccu-t2',
    name: 'Kolkata Netaji Subhash T2',
    city: 'Kolkata',
    code: 'CCU',
    locations: [
      { id: 'ccu-e', name: 'Departure Gate 3', point: { x: 70, y: 300 }, type: 'service' },
      { id: 'ccu-sec', name: 'Security Hold Area', point: { x: 340, y: 300 }, type: 'security' },
      { id: 'ccu-g18', name: 'Gate 18', point: { x: 690, y: 100 }, type: 'gate' },
      { id: 'ccu-g25', name: 'Gate 25', point: { x: 740, y: 510 }, type: 'gate' },
    ],
    obstacles: [
      { type: ObstacleType.Lift, point: { x: 380, y: 120 }, label: 'Concourse Lift' },
    ]
  }
];

export const generatePath = (airport: Airport, start: Location, end: Location, mode: NavMode, lang: Language = 'en'): Path => {
  const lift = airport.obstacles.find(o => o.type === ObstacleType.Lift);
  const steps: NavStep[] = [];
  const trans = TRANSLATIONS[lang];
  
  steps.push({ 
    id: 's1', 
    instruction: `${trans.stepStart}${start.name}`, 
    point: start.point, 
    density: Density.Low, 
    icon: 'MapPin' 
  });

  const waypoint1 = {
    x: (start.point.x + end.point.x) / 2 + 50,
    y: (start.point.y + end.point.y) / 2 - 50
  };
  steps.push({ 
    id: 's-turn1', 
    instruction: trans.stepHead, 
    point: waypoint1, 
    density: Density.Medium, 
    icon: 'Navigation' 
  });

  const security = airport.locations.find(l => l.type === 'security');
  if (security) {
    steps.push({ 
      id: 's-sec', 
      instruction: trans.stepSecurity, 
      point: security.point, 
      density: Density.High, 
      icon: 'Shield' 
    });
  }

  if (mode === 'wheelchair' && lift) {
    steps.push({ 
      id: 's-lift', 
      instruction: `${trans.stepUse}${lift.label}${trans.stepAccessibility}`, 
      point: lift.point, 
      density: Density.Low, 
      icon: 'Elevator', 
      isElevator: true, 
      obstacleFound: ObstacleType.Lift 
    });
  }

  steps.push({ 
    id: 's-end', 
    instruction: `${trans.stepArrive}${end.name}`, 
    point: end.point, 
    density: Density.Low, 
    icon: 'Flag' 
  });

  return {
    id: `p-${mode}-${Date.now()}`,
    from: start.name,
    to: end.name,
    steps,
    mode,
    distance: mode === 'wheelchair' ? '850m' : '620m',
    estimatedTime: mode === 'wheelchair' ? '14m' : '8m'
  };
};

export const EMERGENCY_ROUTE: Path = {
  id: 'emergency-1',
  from: 'Current',
  to: 'Exit',
  steps: [
    { id: 'e1', instruction: 'EMERGENCY: Follow priority lane.', point: { x: 400, y: 300 }, density: Density.Low, icon: 'AlertTriangle' },
    { id: 'e2', instruction: 'Exit via nearest safe zone.', point: { x: 50, y: 50 }, density: Density.Low, icon: 'DoorOpen' },
  ],
  mode: 'wheelchair',
  distance: '180m',
  estimatedTime: '2m'
};
