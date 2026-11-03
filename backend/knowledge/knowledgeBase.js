/**
 * Verified Official Public Service Knowledge Base for Sahayak.
 * Grounded in official Government of India portals:
 * - Income Tax Department / Protean (NSDL) / UTIITSL for PAN Card
 * - National Health Authority (NHA) for Ayushman Bharat (PM-JAY)
 * - Election Commission of India (ECI) for Voter ID
 */

export const VERIFIED_KNOWLEDGE = {
  pan_card: {
    serviceName: 'PAN Card Guidance (Permanent Account Number)',
    officialPortals: [
      { title: 'Income Tax Department - e-Filing Portal', url: 'https://www.incometax.gov.in/iec/foportal/' },
      { title: 'Protean eGov Technologies (Official PAN Portal)', url: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html' },
      { title: 'UTIITSL PAN Online Portal', url: 'https://www.pan.utiitsl.com/' }
    ],
    rules: {
      form: 'Form 49A for Indian Citizens, Form 49AA for Foreign Citizens',
      fee: {
        physicalCard: '₹107 (including GST for delivery within India)',
        ePan: '₹72 (digital copy delivered to email)',
        international: '₹1,017 for dispatch outside India'
      },
      paperlessMode: 'Aadhaar-based paperless e-KYC with mobile OTP (requires mobile number linked to Aadhaar)',
      dispatchTime: 'e-PAN in 24-48 hours via email; Physical card delivered in 10-15 business days'
    },
    en: {
      steps: [
        { id: 1, title: 'Visit Official Portal', desc: 'Go to Protean (NSDL) or UTIITSL official PAN application portal.' },
        { id: 2, title: 'Choose Form 49A', desc: 'Select "New PAN - Indian Citizen (Form 49A)" and category as "Individual".' },
        { id: 3, title: 'Fill Personal Details', desc: 'Enter name, date of birth, mobile number, and active email address.' },
        { id: 4, title: 'Complete Aadhaar e-KYC', desc: 'Select Aadhaar OTP authentication for completely paperless submission.' },
        { id: 5, title: 'Pay the Government Fee', desc: 'Pay ₹107 for physical card or ₹72 for e-PAN via UPI, Net Banking, or Card.' },
        { id: 6, title: 'Track Application', desc: 'Save the 15-digit acknowledgement number to track delivery status.' }
      ],
      checklist: [
        { id: 'c1', label: 'Aadhaar Card (serves as proof of identity, address & date of birth)', required: true },
        { id: 'c2', label: 'Active mobile number linked with Aadhaar (for OTP e-KYC)', required: true },
        { id: 'c3', label: 'Valid email address for e-PAN delivery', required: true },
        { id: 'c4', label: 'Recent passport-size color photographs (white background)', required: true },
        { id: 'c5', label: 'Online payment method (UPI / Debit Card / Net Banking) for ₹107 fee', required: true }
      ]
    },
    hi: {
      steps: [
        { id: 1, title: 'आधिकारिक पोर्टल पर जाएं', desc: 'Protean (पूर्व NSDL) या UTIITSL की आधिकारिक वेबसाइट खोलें।' },
        { id: 2, title: 'फॉर्म 49A चुनें', desc: '"नया पैन - भारतीय नागरिक (फॉर्म 49A)" और श्रेणी "व्यक्तिगत (Individual)" चुनें।' },
        { id: 3, title: 'व्यक्तिगत विवरण भरें', desc: 'अपना पूरा नाम, जन्मतिथि, मोबाइल नंबर और ईमेल आईडी दर्ज करें।' },
        { id: 4, title: 'आधार e-KYC प्रमाणीकरण करें', desc: 'कागज-रहित आवेदन के लिए आधार से जुड़े मोबाइल नंबर पर आए OTP से सत्यापन करें।' },
        { id: 5, title: 'सरकारी शुल्क का भुगतान करें', desc: 'फिजिकल कार्ड के लिए ₹107 या e-PAN के लिए ₹72 का भुगतान UPI/कार्ड से करें।' },
        { id: 6, title: 'आवेदन ट्रैक करें', desc: '15-अंकों की पावती (Acknowledgement) संख्या सुरक्षित रखें और स्थिति ट्रैक करें।' }
      ],
      checklist: [
        { id: 'c1', label: 'आधार कार्ड (पहचान, पते और जन्मतिथि के प्रमाण के लिए)', required: true },
        { id: 'c2', label: 'आधार से लिंक सक्रिय मोबाइल नंबर (OTP सत्यापन के लिए)', required: true },
        { id: 'c3', label: 'e-PAN प्राप्त करने के लिए वैध ईमेल आईडी', required: true },
        { id: 'c4', label: 'सफेद बैकग्राउंड वाली नवीनतम पासपोर्ट साइज फोटो', required: true },
        { id: 'c5', label: '₹107 शुल्क भुगतान हेतु ऑनलाइन माध्यम (UPI / कार्ड / नेट बैंकिंग)', required: true }
      ]
    },
    te: {
      steps: [
        { id: 1, title: 'అధికారిక పోర్టల్ సందర్శించండి', desc: 'Protean (NSDL) లేదా UTIITSL అధికారిక వెబ్‌సైట్‌కి వెళ్లండి.' },
        { id: 2, title: 'ఫారం 49A ఎంచుకోండి', desc: '"కొత్త పాన్ - భారత పౌరుడు (Form 49A)" మరియు కేటగిరీ "ఇండివిడ్యువల్" ఎంచుకోండి.' },
        { id: 3, title: 'వ్యక్తిగత వివరాలు నమోదు చేయండి', desc: 'మీ పేరు, పుట్టిన తేదీ, మొబైల్ నంబర్ మరియు ఈమెయిల్ ఐడీ ఇవ్వండి.' },
        { id: 4, title: 'ఆధార్ e-KYC పూర్తి చేయండి', desc: 'పేపర్‌లెస్ ప్రాసెస్ కోసం ఆధార్ లింక్డ్ మొబైల్ OTP తో ధృవీకరించండి.' },
        { id: 5, title: 'ప్రభుత్వ రుసుము చెల్లించండి', desc: 'ఫిజికల్ కార్డ్ కోసం ₹107 లేదా e-PAN కోసం ₹72 UPI/నెట్ బ్యాంకింగ్ ద్వారా చెల్లించండి.' },
        { id: 6, title: 'దరఖాస్తును ట్రాక్ చేయండి', desc: '15 అంకెల అక్నాలెడ్జ్‌మెంట్ నంబర్ భద్రపరుచుకుని డెలివరీ స్థితి తెలుసుకోండి.' }
      ],
      checklist: [
        { id: 'c1', label: 'ఆధార్ కార్డ్ (గుర్తింపు, చిరునామా & పుట్టిన తేదీ ధృవీకరణకు)', required: true },
        { id: 'c2', label: 'ఆధార్‌తో లింక్ అయిన యాక్టివ్ మొబైల్ నంబర్ (OTP కోసం)', required: true },
        { id: 'c3', label: 'e-PAN అందుకోవడానికి సరైన ఈమెయిల్ ఐడీ', required: true },
        { id: 'c4', label: 'తాజా పాస్‌పోర్ట్ సైజ్ కలర్ ఫోటోగ్రాఫ్‌లు', required: true },
        { id: 'c5', label: '₹107 రుసుము చెల్లించడానికి ఆన్‌లైన్ పేమెంట్ సౌకర్యం (UPI/కార్డ్)', required: true }
      ]
    }
  },

  ayushman_bharat: {
    serviceName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    officialPortals: [
      { title: 'PM-JAY Official Portal - National Health Authority', url: 'https://nha.gov.in/PM-JAY' },
      { title: 'PM-JAY Beneficiary Portal (Check Eligibility & Card Download)', url: 'https://beneficiary.nha.gov.in/' },
      { title: 'Empanelled Hospital Search Portal', url: 'https://hospitals.pmjay.gov.in/' }
    ],
    rules: {
      benefit: '₹5,00,000 per family per year for secondary and tertiary cashless healthcare hospitalization',
      eligibilityBasis: 'Identified based on SECC 2011 (Socio-Economic Caste Census) or state food security (NFSA / Ration Card) database',
      cost: 'Card creation and treatment at empanelled public/private hospitals is completely FREE for eligible families',
      ageLimit: 'No family size limit and no age restriction. Recently extended to all senior citizens aged 70+ years irrespective of income.'
    },
    en: {
      steps: [
        { id: 1, title: 'Check Eligibility', desc: 'Visit beneficiary.nha.gov.in or nearest Common Service Centre (CSC) with your Ration Card or Aadhaar.' },
        { id: 2, title: 'Aadhaar e-KYC Verification', desc: 'Authenticate family members via mobile OTP or biometric fingerprint at CSC/hospital kiosk.' },
        { id: 3, title: 'Family Record Approval', desc: 'Verify name matching in the beneficiary database and submit for approval.' },
        { id: 4, title: 'Download Ayushman Card', desc: 'Once approved, download the digital PVC Ayushman Card carrying the unique ABHA ID.' },
        { id: 5, title: 'Cashless Hospitalization', desc: 'Present your Ayushman Card at any empanelled public or private hospital for up to ₹5 Lakh free care/year.' }
      ],
      checklist: [
        { id: 'a1', label: 'Aadhaar Card for each family member to be enrolled', required: true },
        { id: 'a2', label: 'Ration Card / NFSA Food Security Card', required: true },
        { id: 'a3', label: 'Active mobile number linked to Aadhaar', required: true },
        { id: 'a4', label: 'Passport photo (captured digitally during e-KYC)', required: false }
      ]
    },
    hi: {
      steps: [
        { id: 1, title: 'पात्रता की जांच करें', desc: 'beneficiary.nha.gov.in पर जाएं या राशन कार्ड व आधार लेकर नजदीकी जन सेवा केंद्र (CSC) जाएं।' },
        { id: 2, title: 'आधार e-KYC प्रमाणीकरण', desc: 'मोबाइल OTP या बायोमेट्रिक फिंगरप्रिंट द्वारा परिवार के सदस्यों का सत्यापन कराएं।' },
        { id: 3, title: 'परिवार सत्यापन व स्वीकृति', desc: 'डेटाबेस में नाम सत्यापित होने के बाद अनुमोदन के लिए सबमिट करें।' },
        { id: 4, title: 'आयुष्मान कार्ड डाउनलोड करें', desc: 'स्वीकृति मिलते ही अपना डिजिटल PVC आयुष्मान कार्ड (ABHA ID सहित) डाउनलोड करें।' },
        { id: 5, title: 'मुफ़्त कैशलेस इलाज पाएं', desc: 'किसी भी सूचीबद्ध अस्पताल में भर्ती होने पर ₹5 लाख/वर्ष तक का पूरी तरह मुफ़्त इलाज कराएं।' }
      ],
      checklist: [
        { id: 'a1', label: 'नामांकन के लिए सभी पारिवारिक सदस्यों का आधार कार्ड', required: true },
        { id: 'a2', label: 'राशन कार्ड / खाद्य सुरक्षा कार्ड', required: true },
        { id: 'a3', label: 'आधार से लिंक सक्रिय मोबाइल नंबर', required: true },
        { id: 'a4', label: 'पासपोर्ट फोटो (e-KYC के दौरान डिजिटल रूप से ली जाती है)', required: false }
      ]
    },
    te: {
      steps: [
        { id: 1, title: 'అర్హత తనిఖీ చేయండి', desc: 'beneficiary.nha.gov.in లో లేదా రేషన్ కార్డ్, ఆధార్‌తో దగ్గరలోని CSC కేంద్రాన్ని సంప్రదించండి.' },
        { id: 2, title: 'ఆధార్ e-KYC ధృవీకరణ', desc: 'మొబైల్ OTP లేదా బయోమెట్రిక్ ద్వారా కుటుంబ సభ్యుల గుర్తింపు ధృవీకరణ పూర్తి చేయండి.' },
        { id: 3, title: 'రికార్డుల ఆమోదం', desc: 'డేటాబేస్‌లో వివరాలు సరిచూసుకుని ఆమోదం కోసం సమర్పించండి.' },
        { id: 4, title: 'ఆయుష్మాన్ కార్డ్ డౌన్‌లోడ్', desc: 'ఆమోదం పొందిన తర్వాత ABHA ID తో కూడిన డిజిటల్ ఆయుష్మాన్ కార్డును డౌన్‌లోడ్ చేసుకోండి.' },
        { id: 5, title: 'నగదు రహిత వైద్య చికిత్స', desc: 'ఎంపానెల్ చేయబడిన ఆసుపత్రులలో సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత చికిత్స పొందండి.' }
      ],
      checklist: [
        { id: 'a1', label: 'కుటుంబ సభ్యులందరి ఆధార్ కార్డులు', required: true },
        { id: 'a2', label: 'రేషన్ కార్డ్ / ఆహార భద్రత కార్డ్', required: true },
        { id: 'a3', label: 'ఆధార్‌తో లింక్ అయిన యాక్టివ్ మొబైల్ నంబర్', required: true },
        { id: 'a4', label: 'పాస్‌పోర్ట్ సైజ్ ఫోటో (e-KYC సమయంలో డిజిటల్‌గా తీసుకుంటారు)', required: false }
      ]
    }
  },

  general: {
    officialPortals: [
      { title: 'National Portal of India', url: 'https://www.india.gov.in/' },
      { title: 'Digital India Initiatives', url: 'https://www.digitalindia.gov.in/' }
    ],
    voterPortals: [
      { title: 'National Voters\' Services Portal (ECI)', url: 'https://voters.eci.gov.in/' },
      { title: 'Election Commission of India (ECI)', url: 'https://eci.gov.in/' }
    ],
    steps: [],
    checklist: []
  }
};
