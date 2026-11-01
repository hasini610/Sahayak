/**
 * Sahayak API Client
 * Connects to the Express backend (http://localhost:5000/api)
 * Includes smart fallback for offline/isolated frontend testing.
 */

const API_BASE = '/api';

// Verified fallback knowledge used if backend server is still starting up
const FALLBACK_KNOWLEDGE = {
  pan: {
    steps: [
      { id: 1, title: 'Visit Protean / UTIITSL Portal', desc: 'Go to the official Protean (formerly NSDL) e-Gov portal or UTIITSL website.' },
      { id: 2, title: 'Select Application Type', desc: 'Choose "New PAN - Indian Citizen (Form 49A)" and category "Individual".' },
      { id: 3, title: 'Fill Personal Details', desc: 'Enter name, date of birth, mobile number, and email ID.' },
      { id: 4, title: 'Submit Documents & Aadhaar e-KYC', desc: 'Use Aadhaar-based OTP authentication for instant paperless submission.' },
      { id: 5, title: 'Pay the Government Fee', desc: 'Physical card: ₹107 (incl. GST) for Indian address. e-PAN only: ₹72.' },
      { id: 6, title: 'Track via Acknowledgement No.', desc: 'Note down the 15-digit acknowledgement number to track delivery within 10-15 business days.' }
    ],
    checklist: [
      { id: 'c1', label: 'Aadhaar Card (serves as Proof of Identity, Address & Date of Birth)', required: true },
      { id: 'c2', label: '2 Passport-size color photographs (recent, white background)', required: true },
      { id: 'c3', label: 'Active mobile number linked with Aadhaar (for OTP e-KYC)', required: true },
      { id: 'c4', label: 'Valid email address for e-PAN delivery', required: true },
      { id: 'c5', label: 'Net Banking / UPI / Debit card for ₹107 fee', required: true }
    ],
    sources: [
      { title: 'Income Tax Department - PAN Portal', url: 'https://www.incometax.gov.in/iec/foportal/' },
      { title: 'Protean e-Gov Technologies (NSDL PAN Service)', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html' },
      { title: 'UTIITSL PAN Online Application', url: 'https://www.pan.utiitsl.com/' }
    ]
  },
  ayushman: {
    steps: [
      { id: 1, title: 'Check Eligibility Online or at CSC', desc: 'Visit beneficiary.nha.gov.in or nearest Common Service Centre (CSC) with your Ration Card or Aadhaar.' },
      { id: 2, title: 'Authenticate Identity', desc: 'Complete Aadhaar e-KYC authentication via biometric or mobile OTP.' },
      { id: 3, title: 'Family Verification', desc: 'Verify your name under SECC 2011 or state NFSA food security database.' },
      { id: 4, title: 'Download Ayushman Card (PM-JAY)', desc: 'Once approved, download the digital PVC Ayushman Card with unique ABHA ID.' },
      { id: 5, title: 'Avail Cashless Hospitalization', desc: 'Present your Ayushman Card at any empanelled public or private hospital for up to ₹5 Lakh/year cashless treatment.' }
    ],
    checklist: [
      { id: 'a1', label: 'Aadhaar Card for every family member', required: true },
      { id: 'a2', label: 'Ration Card / NFSA Food Security Card', required: true },
      { id: 'a3', label: 'Active Mobile number linked to Aadhaar', required: true },
      { id: 'a4', label: 'Passport photo (captured digitally at CSC / online)', required: false }
    ],
    sources: [
      { title: 'National Health Authority - Ayushman Bharat (PM-JAY)', url: 'https://nha.gov.in/PM-JAY' },
      { title: 'PM-JAY Beneficiary Portal (Check Eligibility & Download)', url: 'https://beneficiary.nha.gov.in/' },
      { title: 'Find Empanelled Hospital Portal', url: 'https://hospitals.pmjay.gov.in/' }
    ]
  }
};

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline
  }
  return { status: 'mock_mode', message: 'Running in frontend standalone mode with verified knowledge' };
}

export async function fetchServices() {
  try {
    const res = await fetch(`${API_BASE}/services`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }
  return [
    { id: 'pan', name: 'PAN Card Guidance (Form 49A)', active: true },
    { id: 'ayushman', name: 'Ayushman Bharat PM-JAY', active: true }
  ];
}

export async function sendChatMessage({ message, language = 'en', sessionId = 'session_1' }) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, sessionId }),
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend not reachable, activating intelligent frontend mock fallback:', err.message);
  }

  // Standalone verified response generator for frontend testing
  const lower = message.toLowerCase();
  const isAyushman = lower.includes('ayushman') || lower.includes('health') || lower.includes('pmjay') || lower.includes('आयुष्मान') || lower.includes('ఆయుష్మాన్');
  const isSimpler = lower.includes('simple') || lower.includes('सरल') || lower.includes('आसान') || lower.includes('సులభం');

  let text = '';
  let data = isAyushman ? FALLBACK_KNOWLEDGE.ayushman : FALLBACK_KNOWLEDGE.pan;

  if (language === 'hi') {
    if (isAyushman) {
      text = isSimpler
        ? 'आयुष्मान भारत कार्ड से हर गरीब परिवार को अस्पताल में भर्ती होने पर 5 लाख रुपये तक का मुफ़्त इलाज मिलता है। आपको सिर्फ अपना आधार कार्ड और राशन कार्ड लेकर नज़दीकी जन सेवा केंद्र (CSC) जाना है।'
        : 'आयुष्मान भारत (PM-JAY) योजना के तहत प्रत्येक पात्र परिवार को प्रति वर्ष ₹5 लाख का कैशलेस स्वास्थ्य बीमा मिलता है। आप beneficiary.nha.gov.in पर जाकर राशन कार्ड या आधार से अपनी पात्रता जांच सकते हैं।';
    } else {
      text = isSimpler
        ? 'नया पैन कार्ड बनवाना बहुत आसान है। आपको Protean वेबसाइट पर फॉर्म 49A भरना है, आधार कार्ड की फोटो लगानी है और 107 रुपये शुल्क देना है। 10 से 15 दिनों में पैन कार्ड आपके पते पर आ जाएगा।'
        : 'नया पैन कार्ड (Form 49A) बनवाने के लिए आधिकारिक Protean/UTIITSL पोर्टल पर जाएं। पहचान, पते और जन्मतिथि के लिए केवल आधार कार्ड पर्याप्त है। सरकारी शुल्क ₹107 है।';
    }
  } else if (language === 'te') {
    if (isAyushman) {
      text = isSimpler
        ? 'ఆయుష్మాన్ భారత్ కార్డుతో మీ కుటుంబానికి ఏడాదికి 5 లక్షల రూపాయల వరకు ఉచిత ఆసుపత్రి చికిత్స లభిస్తుంది. ఆధార్ కార్డు, రేషన్ కార్డుతో దగ్గరలోని CSC సెంటర్‌కు వెళ్లండి.'
        : 'ఆయుష్మాన్ భారత్ (PM-JAY) పథకం ద్వారా అర్హులైన కుటుంబాలకు సంవత్సరానికి ₹5 లక్షల నగదు రహిత ఆరోగ్య బీమా లభిస్తుంది. beneficiary.nha.gov.in లో మీ అర్హత తనిఖీ చేసుకోవచ్చు.';
    } else {
      text = isSimpler
        ? 'కొత్త పాన్ కార్డ్ తీసుకోవడం చాలా సులభం. అధికారిక వెబ్‌సైట్‌లో ఫారం 49A పూరించండి. ఆధార్ ద్వారా e-KYC చేసి ₹107 రుసుము చెల్లించండి. 10-15 రోజుల్లో మీ ఇంటికి వస్తుంది.'
        : 'కొత్త పాన్ కార్డ్ (Form 49A) కోసం Protean లేదా UTIITSL పోర్టల్‌లో దరఖాస్తు చేయండి. ఆధార్ కార్డ్ గుర్తింపు మరియు చిరునామా రుజువుగా పనిచేస్తుంది. రుసుము ₹107.';
    }
  } else {
    if (isAyushman) {
      text = isSimpler
        ? 'Ayushman Bharat gives your family up to ₹5 Lakh free hospital treatment every year. All you need is your Ration Card and Aadhaar at your nearest Common Service Centre (CSC).'
        : 'Under Ayushman Bharat (PM-JAY), eligible families receive cashless healthcare cover of up to ₹5,00,000 per year at empanelled public and private hospitals across India.';
    } else {
      text = isSimpler
        ? 'Getting a PAN card is simple. Go online, fill Form 49A, verify with your Aadhaar OTP, and pay ₹107. Your physical PAN card will arrive at your home in 10-15 business days.'
        : 'To apply for a new PAN card, fill Form 49A on the official Protean (NSDL) or UTIITSL website. Aadhaar is accepted as complete proof of identity, address, and date of birth. The fee is ₹107.';
    }
  }

  return {
    reply: text,
    language,
    workflow: isAyushman ? 'ayushman_bharat' : 'pan_card',
    steps: data.steps,
    checklist: data.checklist,
    sources: data.sources,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
