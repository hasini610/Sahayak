/**
 * Verified Application Journey Workflows for Sahayak.
 * Reviewed and updated for factual accuracy as of November 2026.
 *
 * Grounded in official Government of India regulations and portals:
 * - Income Tax Department / Protean (TIN-NSDL) / UTIITSL PAN Regulations
 *   (Effective 1 April 2026, fresh PAN applications are governed by the revised
 *   F-series forms, e.g. Form F093 for Indian Citizen Individuals replacing legacy Form 49A)
 * - National Health Authority (NHA) PM-JAY Guidelines
 *   (General SECC/NFSA entitlement vs. universal expansion for senior citizens aged 70+
 *   under the Ayushman Vay Vandana Card)
 */

export const STORAGE_PREFIX = 'sahayak_journey_progress_';

export const JOURNEY_WORKFLOWS = {
  pan: {
    id: 'pan',
    titleKey: 'panCard',
    lastVerified: 'November 2026',
    officialPortalName: 'Protean (TIN-NSDL) / UTIITSL Portal',
    officialPortalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    officialSources: [
      {
        title: 'Income Tax Department - PAN Portal',
        url: 'https://www.incometax.gov.in/iec/foportal/'
      },
      {
        title: 'Protean eGov Technologies (TIN-NSDL PAN Portal)',
        url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
      },
      {
        title: 'UTIITSL PAN Online Services',
        url: 'https://www.pan.utiitsl.com/'
      }
    ],
    en: {
      title: 'PAN Card Application (Form F093)',
      subtitle: 'Official Paperless or Physical Submission Journey',
      steps: [
        {
          id: 1,
          title: 'Access Official Portal',
          desc: 'Visit the official Protean (TIN-NSDL), UTIITSL, or Income Tax e-Filing portal.',
          venue: 'official_portal',
          portalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
        },
        {
          id: 2,
          title: 'Select Applicable Form (Form F093)',
          desc: 'Select Form F093 for Indian Citizen Individuals (which replaced legacy Form 49A from 1 April 2026).',
          venue: 'official_portal'
        },
        {
          id: 3,
          title: 'Choose Submission Mode & Fill Details',
          desc: 'Choose Paperless (Aadhaar e-KYC), Scanned Image upload, or Physical document dispatch, then enter personal details.',
          venue: 'official_portal'
        },
        {
          id: 4,
          title: 'Identity & Document Verification',
          desc: 'Authenticate via Aadhaar OTP (paperless mode) or upload/courier prescribed identity, address, and DOB proofs.',
          venue: 'official_portal'
        },
        {
          id: 5,
          title: 'Pay Prescribed Government Fee',
          desc: 'Pay the applicable fee on the portal (e.g. ₹101 for paperless card delivery in India, ₹107 for physical mode, or ₹66–₹72 for e-PAN only).',
          venue: 'official_portal'
        },
        {
          id: 6,
          title: 'Save & Track Acknowledgement',
          desc: 'Record your 15-digit acknowledgement number to track processing and dispatch status on the portal.',
          venue: 'official_portal'
        }
      ]
    },
    hi: {
      title: 'पैन कार्ड आवेदन (फॉर्म F093)',
      subtitle: 'आधिकारिक डिजिटल या भौतिक आवेदन यात्रा',
      steps: [
        {
          id: 1,
          title: 'आधिकारिक पोर्टल खोलें',
          desc: 'Protean (TIN-NSDL), UTIITSL या आयकर विभाग के आधिकारिक ई-फाइलिंग पोर्टल पर जाएं।',
          venue: 'official_portal',
          portalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
        },
        {
          id: 2,
          title: 'वर्तमान फॉर्म F093 चुनें',
          desc: 'भारतीय नागरिक व्यक्तिगत आवेदन हेतु फॉर्म F093 चुनें (जिसने 1 अप्रैल 2026 से पुराने फॉर्म 49A का स्थान लिया है)।',
          venue: 'official_portal'
        },
        {
          id: 3,
          title: 'आवेदन माध्यम चुनें व विवरण भरें',
          desc: 'डिजिटल आधार e-KYC, स्कैन दस्तावेज़ अपलोड या भौतिक दस्तावेज़ माध्यम चुनें और अपना व्यक्तिगत विवरण दर्ज करें।',
          venue: 'official_portal'
        },
        {
          id: 4,
          title: 'पहचान व दस्तावेज़ सत्यापन',
          desc: 'आधार OTP से डिजिटल प्रमाणीकरण करें या पहचान, पते व जन्मतिथि के निर्धारित प्रमाण पत्र अपलोड/जमा करें।',
          venue: 'official_portal'
        },
        {
          id: 5,
          title: 'निर्धारित सरकारी शुल्क का भुगतान करें',
          desc: 'माध्यम अनुसार शुल्क दें (जैसे डिजिटल कार्ड डिलीवरी ₹101, भौतिक माध्यम ₹107, या केवल ई-पैन ₹66–₹72)।',
          venue: 'official_portal'
        },
        {
          id: 6,
          title: 'पावती संख्या सुरक्षित रखें व ट्रैक करें',
          desc: 'पोर्टल पर आवेदन की स्थिति जांचने के लिए 15-अंकों की पावती संख्या (Acknowledgement Number) सुरक्षित रखें।',
          venue: 'official_portal'
        }
      ]
    },
    te: {
      title: 'పాన్ కార్డ్ దరఖాస్తు (ఫారం F093)',
      subtitle: 'అధికారిక డిజిటల్ లేదా భౌతిక దరఖాస్తు ప్రయాణం',
      steps: [
        {
          id: 1,
          title: 'అధికారిక పోర్టల్ తెరవండి',
          desc: 'Protean (TIN-NSDL), UTIITSL లేదా ఆదాయపు పన్ను శాఖ అధికారిక ఈ-ఫైలింగ్ పోర్టల్‌ని సందర్శించండి.',
          venue: 'official_portal',
          portalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
        },
        {
          id: 2,
          title: 'ప్రస్తుత ఫారం F093 ఎంచుకోండి',
          desc: 'భారతీయ పౌరుల వ్యక్తిగత దరఖాస్తు కోసం ఫారం F093 ఎంచుకోండి (1 ఏప్రిల్ 2026 నుండి పాత ఫారం 49A స్థానంలో ఇది అమల్లోకి వచ్చింది).',
          venue: 'official_portal'
        },
        {
          id: 3,
          title: 'సమర్పణ విధానం & వివరాలు నమోదు చేయండి',
          desc: 'డిజిటల్ ఆధార్ e-KYC, స్కాన్ చేసిన పత్రాల అప్‌లోడ్ లేదా భౌతిక సమర్పణ విధానాన్ని ఎంచుకుని వివరాలు నమోదు చేయండి.',
          venue: 'official_portal'
        },
        {
          id: 4,
          title: 'గుర్తింపు & పత్రాల ధృవీకరణ',
          desc: 'ఆధార్ OTP ద్వారా డిజిటల్ ధృవీకరణ పూర్తి చేయండి లేదా గుర్తింపు, చిరునామా, పుట్టిన తేదీ పత్రాలను సమర్పించండి.',
          venue: 'official_portal'
        },
        {
          id: 5,
          title: 'ప్రభుత్వ రుసుము చెల్లించండి',
          desc: 'ఎంచుకున్న విధానం ప్రకారం రుసుము చెల్లించండి (డిజిటల్ కార్డు ₹101, భౌతిక విధానం ₹107, లేదా ఈ-పాన్ మాత్రమే అయితే ₹66–₹72).',
          venue: 'official_portal'
        },
        {
          id: 6,
          title: 'రశీదు సంఖ్య భద్రపరుచుకుని ట్రాక్ చేయండి',
          desc: 'దరఖాస్తు పురోగతిని పోర్టల్‌లో ట్రాక్ చేయడానికి 15 అంకెల అక్నాలెడ్జ్‌మెంట్ నంబర్‌ను భద్రపరుచుకోండి.',
          venue: 'official_portal'
        }
      ]
    }
  },

  ayushman: {
    id: 'ayushman',
    titleKey: 'ayushmanBharat',
    lastVerified: 'November 2026',
    officialPortalName: 'NHA PM-JAY Beneficiary Portal',
    officialPortalUrl: 'https://beneficiary.nha.gov.in/',
    officialSources: [
      {
        title: 'National Health Authority - PM-JAY Official Portal',
        url: 'https://nha.gov.in/PM-JAY'
      },
      {
        title: 'NHA Beneficiary Portal (Check Eligibility & Enrolment)',
        url: 'https://beneficiary.nha.gov.in/'
      },
      {
        title: 'PM-JAY Hospital Empanelled Search Portal',
        url: 'https://hospitals.pmjay.gov.in/'
      },
      {
        title: 'National Portal of India - Ayushman Vay Vandana Card (70+)',
        url: 'https://india.gov.in/'
      }
    ],
    en: {
      title: 'Ayushman Bharat PM-JAY Card Journey',
      subtitle: 'SECC/NFSA Entitlement & 70+ Senior Citizen Enrolment',
      steps: [
        {
          id: 1,
          title: 'Check Eligibility Criteria',
          desc: 'Verify if listed under SECC 2011 / State NFSA Ration Card database, OR if applying under universal 70+ Senior Citizen rules.',
          venue: 'official_portal',
          portalUrl: 'https://beneficiary.nha.gov.in/'
        },
        {
          id: 2,
          title: 'Aadhaar e-KYC Verification',
          desc: 'Authenticate via Aadhaar mobile OTP, biometric fingerprint, or face authentication on the portal or at a CSC/hospital kiosk.',
          venue: 'official_portal'
        },
        {
          id: 3,
          title: 'Family / Senior Record Approval',
          desc: 'Submit beneficiary records for matching against scheme databases (or age verification for 70+ Ayushman Vay Vandana cards).',
          venue: 'official_portal'
        },
        {
          id: 4,
          title: 'Download Ayushman / Vay Vandana Card',
          desc: 'Once approved, download the digital PVC Ayushman Card carrying the unique ABHA ID (or distinct Ayushman Vay Vandana Card for 70+ seniors).',
          venue: 'official_portal'
        },
        {
          id: 5,
          title: 'Access Cashless Hospitalization',
          desc: 'Present your verified card at any empanelled public or private hospital for up to ₹5 Lakh/year cashless secondary & tertiary care.',
          venue: 'official_portal'
        }
      ]
    },
    hi: {
      title: 'आयुष्मान भारत (PM-JAY) कार्ड यात्रा',
      subtitle: 'SECC/NFSA पात्रता व 70+ वरिष्ठ नागरिक नामांकन',
      steps: [
        {
          id: 1,
          title: 'पात्रता श्रेणी की जांच करें',
          desc: 'जांचें कि क्या आप SECC 2011 / राज्य राशन कार्ड डेटाबेस में सूचीबद्ध हैं, या 70+ वर्ष के वरिष्ठ नागरिक श्रेणी में आवेदन कर रहे हैं।',
          venue: 'official_portal',
          portalUrl: 'https://beneficiary.nha.gov.in/'
        },
        {
          id: 2,
          title: 'आधार e-KYC प्रमाणीकरण',
          desc: 'पोर्टल या CSC/अस्पताल केंद्र पर आधार OTP, बायोमेट्रिक फिंगरप्रिंट या फेस ऑथेंटिकेशन द्वारा पहचान सत्यापित करें।',
          venue: 'official_portal'
        },
        {
          id: 3,
          title: 'परिवार / वरिष्ठ नागरिक रिकॉर्ड अनुमोदन',
          desc: 'डेटाबेस मिलान हेतु विवरण सबमिट करें (70+ वरिष्ठ नागरिकों के लिए आधार अनुसार आयु सत्यापन किया जाता है)।',
          venue: 'official_portal'
        },
        {
          id: 4,
          title: 'आयुष्मान / वय वंदना कार्ड डाउनलोड करें',
          desc: 'स्वीकृति मिलते ही अपना डिजिटल आयुष्मान कार्ड या 70+ वरिष्ठ नागरिकों हेतु विशेष "आयुष्मान वय वंदना कार्ड" डाउनलोड करें।',
          venue: 'official_portal'
        },
        {
          id: 5,
          title: 'कैशलेस अस्पताल उपचार का लाभ लें',
          desc: 'किसी भी सूचीबद्ध सरकारी या निजी अस्पताल में भर्ती होने पर ₹5 लाख/वर्ष तक का मुफ़्त कैशलेस उपचार प्राप्त करें।',
          venue: 'official_portal'
        }
      ]
    },
    te: {
      title: 'ఆయుష్మాన్ భారత్ (PM-JAY) కార్డు ప్రయాణం',
      subtitle: 'SECC/NFSA అర్హత & 70+ సీనియర్ సిటిజన్ల నమోదు',
      steps: [
        {
          id: 1,
          title: 'అర్హత వర్గాన్ని తనిఖీ చేయండి',
          desc: 'మీరు SECC 2011 / రాష్ట్ర రేషన్ కార్డు డేటాబేస్‌లో ఉన్నారా లేదా 70+ సీనియర్ సిటిజన్ల వర్గంలో దరఖాస్తు చేస్తున్నారా అని పోర్టల్‌లో తనిఖీ చేయండి.',
          venue: 'official_portal',
          portalUrl: 'https://beneficiary.nha.gov.in/'
        },
        {
          id: 2,
          title: 'ఆధార్ e-KYC ధృవీకరణ',
          desc: 'పోర్టల్‌లో లేదా CSC/ఆసుపత్రి కేంద్రంలో ఆధార్ మొబైల్ OTP, బయోమెట్రిక్ లేదా ముఖ గుర్తింపు ద్వారా ధృవీకరణ పూర్తి చేయండి.',
          venue: 'official_portal'
        },
        {
          id: 3,
          title: 'కుటుంబం / సీనియర్ రికార్డుల ఆమోదం',
          desc: 'డేటాబేస్ సరిపోలిక కోసం వివరాలు సమర్పించండి (70+ వయస్సు గలవారికి ఆధార్ ఆధారంగా వయస్సు ధృవీకరణ జరుగుతుంది).',
          venue: 'official_portal'
        },
        {
          id: 4,
          title: 'ఆయుష్మాన్ / వయ వందన కార్డు డౌన్‌లోడ్',
          desc: 'ఆమోదం పొందిన తర్వాత ABHA ID తో కూడిన డిజిటల్ ఆయుష్మాన్ కార్డు లేదా 70+ వారికి ప్రత్యేక "ఆయుష్మాన్ వయ వందన కార్డు" డౌన్‌లోడ్ చేసుకోండి.',
          venue: 'official_portal'
        },
        {
          id: 5,
          title: 'నగదు రహిత వైద్య చికిత్స పొందండి',
          desc: 'ఏదైనా ఎంపానెల్ చేయబడిన ప్రభుత్వ లేదా ప్రైవేట్ ఆసుపత్రిలో సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత నగదు రహిత చికిత్స పొందండి.',
          venue: 'official_portal'
        }
      ]
    }
  }
};

/**
 * Retrieves persisted step completion progress for a given service.
 * @param {string} serviceId 'pan' | 'ayushman'
 * @param {Storage} storage Storage provider (defaults to window.localStorage)
 * @returns {Record<string|number, boolean>} Map of step IDs to completion boolean
 */
export function getJourneyProgress(serviceId, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    const raw = storage?.getItem(`${STORAGE_PREFIX}${serviceId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading journey progress:', err);
  }
  return {};
}

/**
 * Persists step completion progress for a given service.
 * @param {string} serviceId 'pan' | 'ayushman'
 * @param {Record<string|number, boolean>} progress Map of step IDs to completion boolean
 * @param {Storage} storage Storage provider (defaults to window.localStorage)
 */
export function saveJourneyProgress(serviceId, progress, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    storage?.setItem(`${STORAGE_PREFIX}${serviceId}`, JSON.stringify(progress));
  } catch (err) {
    console.warn('Error saving journey progress:', err);
  }
}

/**
 * Clears persisted step completion progress for a given service.
 * @param {string} serviceId 'pan' | 'ayushman'
 * @param {Storage} storage Storage provider (defaults to window.localStorage)
 */
export function clearJourneyProgress(serviceId, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    storage?.removeItem(`${STORAGE_PREFIX}${serviceId}`);
  } catch (err) {
    console.warn('Error clearing journey progress:', err);
  }
}
