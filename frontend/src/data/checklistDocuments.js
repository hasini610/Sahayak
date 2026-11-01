/**
 * Verified Smart Document Checklist Data for Sahayak.
 * Reviewed and grounded in official Government of India public service regulations:
 * - Income Tax Department / Protean / UTIITSL PAN Regulations under Rule 114
 * - National Health Authority (NHA) PM-JAY & Ayushman Vay Vandana Guidelines
 */

export const CHECKLIST_STORAGE_PREFIX = 'sahayak_checklist_progress_';

export const CHECKLIST_SERVICES = {
  pan: {
    id: 'pan',
    titleKey: 'panCard',
    lastVerified: 'November 2026',
    officialPortalName: 'Protean (TIN-NSDL) / UTIITSL Portal',
    officialPortalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    officialSources: [
      {
        title: 'Income Tax Department - List of Documents for PAN (Rule 114)',
        url: 'https://www.incometax.gov.in/iec/foportal/'
      },
      {
        title: 'Protean eGov Technologies - Documents Required for Form F093',
        url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
      },
      {
        title: 'UTIITSL PAN Application Guidance',
        url: 'https://www.pan.utiitsl.com/'
      }
    ],
    en: {
      title: 'PAN Card Document Preparation',
      subtitle: 'Documents accepted under Income Tax Rule 114',
      documents: [
        {
          id: 'pan_aadhaar',
          name: 'Aadhaar Card',
          explanation: 'Serves as complete Proof of Identity, Address, and Date of Birth for paperless e-KYC. If you do not have Aadhaar, you can submit alternative government IDs via physical or scanned mode.',
          statusType: 'depends_on_mode',
          category: 'Identity & Address'
        },
        {
          id: 'pan_mobile',
          name: 'Active Mobile Number Linked to Aadhaar',
          explanation: 'Required if choosing instant paperless Aadhaar OTP authentication. If your mobile is not linked, you can use biometric verification at a PAN center or submit documents physically.',
          statusType: 'conditional',
          category: 'Verification'
        },
        {
          id: 'pan_alt_poi_poa',
          name: 'Alternative Identity, Address & DOB Proofs',
          explanation: 'Required only if not using Aadhaar e-KYC. Officially accepted proofs include Voter ID, Passport, Driving License, Birth Certificate, or Bank Statement (< 3 months old).',
          statusType: 'depends_on_mode',
          category: 'Alternative Proofs'
        },
        {
          id: 'pan_photos',
          name: 'Two Recent Passport-Size Photographs',
          explanation: 'Required only for physical submission or scanned document mode (white background, 3.5cm x 2.5cm). Not required for paperless Aadhaar e-KYC as the photo from Aadhaar database is used.',
          statusType: 'depends_on_mode',
          category: 'Photographs'
        },
        {
          id: 'pan_email',
          name: 'Valid Email Address',
          explanation: 'Required for receiving digital e-PAN in PDF format, application status updates, and the 15-digit acknowledgement receipt.',
          statusType: 'required',
          category: 'Delivery'
        },
        {
          id: 'pan_payment',
          name: 'Government Fee Payment Means',
          explanation: 'UPI, Debit/Credit Card, Net Banking (for online portal) or Cash/Demand Draft (at physical TIN center) for the applicable fee (e.g. ₹101 paperless card delivery / ₹107 physical mode / ₹66–₹72 e-PAN).',
          statusType: 'required',
          category: 'Fee Payment'
        }
      ]
    },
    hi: {
      title: 'पैन कार्ड दस्तावेज़ तैयारी',
      subtitle: 'आयकर नियम 114 के तहत मान्य दस्तावेज़',
      documents: [
        {
          id: 'pan_aadhaar',
          name: 'आधार कार्ड (Aadhaar Card)',
          explanation: 'डिजिटल आधार e-KYC के लिए पहचान, पता और जन्मतिथि के पूर्ण प्रमाण के रूप में मान्य। यदि आधार नहीं है, तो भौतिक या स्कैन माध्यम से अन्य सरकारी पहचान पत्र जमा किए जा सकते हैं।',
          statusType: 'depends_on_mode',
          category: 'पहचान व पता'
        },
        {
          id: 'pan_mobile',
          name: 'आधार से लिंक सक्रिय मोबाइल नंबर',
          explanation: 'कागज-रहित आधार OTP सत्यापन चुनने पर आवश्यक। यदि मोबाइल आधार से लिंक नहीं है, तो केंद्र पर बायोमेट्रिक या भौतिक दस्तावेज़ माध्यम का उपयोग करें।',
          statusType: 'conditional',
          category: 'सत्यापन'
        },
        {
          id: 'pan_alt_poi_poa',
          name: 'वैकल्पिक पहचान, पता व जन्मतिथि प्रमाण',
          explanation: 'केवल तभी आवश्यक जब आधार e-KYC का उपयोग न कर रहे हों। आयकर नियम 114 के अनुसार वोटर आईडी, पासपोर्ट, ड्राइविंग लाइसेंस या 3 महीने पुराना बैंक स्टेटमेंट मान्य हैं।',
          statusType: 'depends_on_mode',
          category: 'वैकल्पिक प्रमाण'
        },
        {
          id: 'pan_photos',
          name: 'दो नवीनतम पासपोर्ट साइज फोटो',
          explanation: 'केवल भौतिक आवेदन या स्कैन दस्तावेज़ माध्यम के लिए आवश्यक (सफेद बैकग्राउंड, 3.5cm x 2.5cm)। कागज-रहित आधार e-KYC में फोटो सीधे आधार से ली जाती है।',
          statusType: 'depends_on_mode',
          category: 'फ़ोटो'
        },
        {
          id: 'pan_email',
          name: 'वैध ईमेल आईडी (Email Address)',
          explanation: 'डिजिटल ई-पैन (PDF कॉपी), आवेदन स्थिति सूचनाएं और पावती रसीद प्राप्त करने के लिए अनिवार्य।',
          statusType: 'required',
          category: 'डिलिवरी'
        },
        {
          id: 'pan_payment',
          name: 'सरकारी शुल्क भुगतान माध्यम',
          explanation: 'माध्यम अनुसार निर्धारित शुल्क (जैसे डिजिटल डिलीवरी ₹101 / भौतिक माध्यम ₹107 / केवल ई-पैन ₹66–₹72) हेतु UPI, डेबिट कार्ड, नेट बैंकिंग या केंद्र पर नकद।',
          statusType: 'required',
          category: 'शुल्क भुगतान'
        }
      ]
    },
    te: {
      title: 'పాన్ కార్డ్ పత్రాల సన్నద్ధత',
      subtitle: 'ఆదాయపు పన్ను నిబంధన 114 ప్రకారం ఆమోదించబడిన పత్రాలు',
      documents: [
        {
          id: 'pan_aadhaar',
          name: 'ఆధార్ కార్డ్ (Aadhaar Card)',
          explanation: 'పేపర్‌లెస్ e-KYC కోసం గుర్తింపు, చిరునామా మరియు పుట్టిన తేదీకి పూర్తి ధృవీకరణగా పనిచేస్తుంది. ఒకవేళ ఆధార్ లేకపోతే, భౌతిక లేదా స్కాన్ పద్ధతిలో ఇతర గుర్తింపు పత్రాలు సమర్పించవచ్చు.',
          statusType: 'depends_on_mode',
          category: 'గుర్తింపు & చిరునామా'
        },
        {
          id: 'pan_mobile',
          name: 'ఆధార్‌తో లింక్ అయిన యాక్టివ్ మొబైల్ నంబర్',
          explanation: 'తక్షణ పేపర్‌లెస్ ఆధార్ OTP ధృవీకరణ ఎంచుకుంటే అవసరం. మొబైల్ లింక్ కాకపోతే, కేంద్రంలో బయోమెట్రిక్ లేదా భౌతిక సమర్పణ ద్వారా దరఖాస్తు చేసుకోవచ్చు.',
          statusType: 'conditional',
          category: 'ధృవీకరణ'
        },
        {
          id: 'pan_alt_poi_poa',
          name: 'ప్రత్యామ్నాయ గుర్తింపు, చిరునామా & పుట్టిన తేదీ పత్రాలు',
          explanation: 'ఆధార్ e-KYC ఉపయోగించనప్పుడు మాత్రమే అవసరం. ఆదాయపు పన్ను నిబంధనల ప్రకారం ఓటర్ ఐడి, పాస్‌పోర్ట్, డ్రైవింగ్ లైసెన్స్ లేదా 3 నెలల లోపు బ్యాంక్ స్టేట్‌మెంట్ అధికారికంగా ఆమోదించబడతాయి.',
          statusType: 'depends_on_mode',
          category: 'ప్రత్యామ్నాయ పత్రాలు'
        },
        {
          id: 'pan_photos',
          name: 'రెండు తాజా పాస్‌పోర్ట్ సైజ్ ఫోటోలు',
          explanation: 'భౌతిక సమర్పణ లేదా స్కాన్ పత్రాల విధానంలో మాత్రమే అవసరం (తెల్లని బ్యాక్‌గ్రౌండ్, 3.5cm x 2.5cm). పేపర్‌లెస్ ఆధార్ e-KYC లో ఫోటో ఆధార్ నుండే వస్తుంది.',
          statusType: 'depends_on_mode',
          category: 'ఫోటోగ్రాఫ్‌లు'
        },
        {
          id: 'pan_email',
          name: 'సరైన ఈమెయిల్ ఐడీ (Email ID)',
          explanation: 'డిజిటల్ ఈ-పాన్ (PDF కాపీ), దరఖాస్తు పురోగతి మరియు రశీదు అందుకోవడానికి తప్పనిసరి.',
          statusType: 'required',
          category: 'డెలివరీ'
        },
        {
          id: 'pan_payment',
          name: 'ప్రభుత్వ రుసుము చెల్లింపు సౌకర్యం',
          explanation: 'ప్రభుత్వ రుసుము (ఉదా: డిజిటల్ కార్డు ₹101 / భౌతిక విధానం ₹107 / ఈ-పాన్ ₹66–₹72) చెల్లించడానికి UPI, డెబిట్ కార్డు, నెట్ బ్యాంకింగ్ లేదా కేంద్రంలో నగదు.',
          statusType: 'required',
          category: 'రుసుము చెల్లింపు'
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
        title: 'National Health Authority - Beneficiary Identification System (BIS)',
        url: 'https://beneficiary.nha.gov.in/'
      },
      {
        title: 'PM-JAY Scheme Guidelines & Deprivation Criteria',
        url: 'https://nha.gov.in/PM-JAY'
      },
      {
        title: 'National Portal of India - Ayushman Vay Vandana Enrolment Guidelines',
        url: 'https://india.gov.in/'
      }
    ],
    en: {
      title: 'Ayushman Bharat PM-JAY Document Preparation',
      subtitle: 'Documents for SECC/NFSA Families & 70+ Senior Citizens',
      documents: [
        {
          id: 'ayush_aadhaar',
          name: 'Aadhaar Card for Each Family Member',
          explanation: 'Mandatory primary document for individual identity authentication and age verification (for 70+ Senior Citizen Ayushman Vay Vandana Card). Every enrolled member undergoes e-KYC.',
          statusType: 'required',
          category: 'Identity & Age'
        },
        {
          id: 'ayush_ration_card',
          name: 'Ration Card / NFSA Food Security Card',
          explanation: 'Required for general families to prove inclusion in state food security or SECC database. NOT required for senior citizens aged 70 and above, who qualify universally based on age.',
          statusType: 'conditional',
          category: 'Family Eligibility'
        },
        {
          id: 'ayush_mobile',
          name: 'Active Mobile Number',
          explanation: 'Required for receiving e-KYC OTP on beneficiary.nha.gov.in, linking your ABHA health ID, and receiving treatment approval SMS at hospitals.',
          statusType: 'required',
          category: 'Communication'
        },
        {
          id: 'ayush_secc_proof',
          name: 'SECC 2011 Family Deprivation Proof',
          explanation: 'Only needed if enrolling under SECC 2011 rural/urban categories without an integrated state ration card. Not applicable for 70+ senior citizen beneficiaries.',
          statusType: 'conditional',
          category: 'General Entitlement'
        },
        {
          id: 'ayush_cghs_echs_card',
          name: 'Existing Public Health Scheme Card (CGHS/ECHS/CAPF)',
          explanation: 'Applicable only for 70+ seniors currently enrolled in other government schemes like CGHS, ECHS, or CAPF. They can choose to continue their existing scheme or switch to PM-JAY.',
          statusType: 'conditional',
          category: 'Scheme Coordination'
        }
      ]
    },
    hi: {
      title: 'आयुष्मान भारत (PM-JAY) दस्तावेज़ तैयारी',
      subtitle: 'SECC/NFSA परिवारों व 70+ वरिष्ठ नागरिकों हेतु दस्तावेज़',
      documents: [
        {
          id: 'ayush_aadhaar',
          name: 'सभी सदस्यों का आधार कार्ड (Aadhaar Card)',
          explanation: 'पहचान सत्यापन और 70+ वरिष्ठ नागरिकों हेतु आयु निर्धारण के लिए अनिवार्य। प्रत्येक नामांकित पारिवारिक सदस्य का व्यक्तिगत आधार e-KYC किया जाता है।',
          statusType: 'required',
          category: 'पहचान व आयु'
        },
        {
          id: 'ayush_ration_card',
          name: 'राशन कार्ड / राष्ट्रीय खाद्य सुरक्षा कार्ड',
          explanation: 'सामान्य परिवारों के लिए राशन कार्ड या SECC डेटाबेस में पात्रता दर्शाने हेतु आवश्यक। 70 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिकों के लिए राशन कार्ड आवश्यक नहीं है।',
          statusType: 'conditional',
          category: 'पारिवारिक पात्रता'
        },
        {
          id: 'ayush_mobile',
          name: 'सक्रिय मोबाइल नंबर (Active Mobile Number)',
          explanation: 'beneficiary.nha.gov.in पर OTP प्रमाणीकरण, ABHA हेल्थ आईडी लिंक करने और अस्पताल स्वीकृति संदेश प्राप्त करने के लिए अनिवार्य।',
          statusType: 'required',
          category: 'संचार व OTP'
        },
        {
          id: 'ayush_secc_proof',
          name: 'SECC 2011 परिवार सूची प्रमाण',
          explanation: 'केवल तभी आवश्यक जब राज्य राशन कार्ड के बिना SECC 2011 सूची के तहत नामांकन करा रहे हों। 70+ वरिष्ठ नागरिकों के लिए लागू नहीं।',
          statusType: 'conditional',
          category: 'सामान्य पात्रता'
        },
        {
          id: 'ayush_cghs_echs_card',
          name: 'मौजूदा सरकारी स्वास्थ्य योजना कार्ड (CGHS/ECHS/CAPF)',
          explanation: 'केवल उन 70+ वरिष्ठ नागरिकों के लिए जो पहले से CGHS, ECHS या CAPF के लाभार्थी हैं। वे अपनी पुरानी योजना जारी रख सकते हैं या PM-JAY चुन सकते हैं।',
          statusType: 'conditional',
          category: 'योजना समन्वय'
        }
      ]
    },
    te: {
      title: 'ఆయుష్మాన్ భారత్ (PM-JAY) పత్రాల సన్నద్ధత',
      subtitle: 'SECC/NFSA కుటుంబాలు & 70+ సీనియర్ సిటిజన్లకు అవసరమైన పత్రాలు',
      documents: [
        {
          id: 'ayush_aadhaar',
          name: 'కుటుంబ సభ్యులందరి ఆధార్ కార్డులు',
          explanation: 'గుర్తింపు ధృవీకరణ మరియు 70+ సీనియర్ సిటిజన్ల వయ వందన కార్డు కోసం వయస్సు నిర్ధారణకు తప్పనిసరి. ప్రతి సభ్యుడు వ్యక్తిగత e-KYC పూర్తి చేయాలి.',
          statusType: 'required',
          category: 'గుర్తింపు & వయస్సు'
        },
        {
          id: 'ayush_ration_card',
          name: 'రేషన్ కార్డ్ / ఆహార భద్రత కార్డ్',
          explanation: 'సాధారణ కుటుంబాలకు రేషన్ కార్డు లేదా SECC డేటాబేస్‌లో అర్హత రుజువు చేయడానికి అవసరం. 70 లేదా అంతకంటే ఎక్కువ వయస్సు గల సీనియర్ సిటిజన్లకు రేషన్ కార్డు అవసరం లేదు.',
          statusType: 'conditional',
          category: 'కుటుంబ అర్హత'
        },
        {
          id: 'ayush_mobile',
          name: 'యాక్టివ్ మొబైల్ నంబర్ (Mobile Number)',
          explanation: 'beneficiary.nha.gov.in పోర్టల్‌లో OTP ధృవీకరణ, ABHA హెల్త్ ఐడీ లింక్ చేయడం మరియు ఆసుపత్రి ఆమోద సందేశాల కోసం తప్పనిసరి.',
          statusType: 'required',
          category: 'సమాచార మార్పిడి'
        },
        {
          id: 'ayush_secc_proof',
          name: 'SECC 2011 కుటుంబ సమాచార పత్రం',
          explanation: 'రాష్ట్ర రేషన్ కార్డు లేకుండా SECC 2011 జాబితా ప్రకారం నమోదు చేసుకుంటుంటే మాత్రమే అవసరం. 70+ సీనియర్ సిటిజన్లకు ఇది వర్తించదు.',
          statusType: 'conditional',
          category: 'సాధారణ అర్హత'
        },
        {
          id: 'ayush_cghs_echs_card',
          name: 'ప్రస్తుత ప్రభుత్వ ఆరోగ్య పథకం కార్డు (CGHS/ECHS/CAPF)',
          explanation: 'ఇప్పటికే CGHS, ECHS లేదా CAPF ఆరోగ్య పథకాల్లో ఉన్న 70+ సీనియర్ సిటిజన్ల కోసం. వారు పాత పథకాన్ని కొనసాగించవచ్చు లేదా PM-JAY కి మారవచ్చు.',
          statusType: 'conditional',
          category: 'పథకం సమన్వయం'
        }
      ]
    }
  }
};

/**
 * Retrieves persisted checklist progress for a given service.
 * @param {string} serviceId 'pan' | 'ayushman'
 * @param {Storage} storage Storage provider (defaults to window.localStorage)
 * @returns {Record<string, boolean>} Map of document IDs to ready boolean
 */
export function getChecklistProgress(serviceId, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    const raw = storage?.getItem(`${CHECKLIST_STORAGE_PREFIX}${serviceId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading checklist progress:', err);
  }
  return {};
}

/**
 * Persists checklist progress for a given service.
 * @param {string} serviceId 'pan' | 'ayushman'
 * @param {Record<string, boolean>} progress Map of document IDs to ready boolean
 * @param {Storage} storage Storage provider (defaults to window.localStorage)
 */
export function saveChecklistProgress(serviceId, progress, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    storage?.setItem(`${CHECKLIST_STORAGE_PREFIX}${serviceId}`, JSON.stringify(progress));
  } catch (err) {
    console.warn('Error saving checklist progress:', err);
  }
}

/**
 * Clears persisted checklist progress for a given service.
 * @param {string} serviceId 'pan' | 'ayushman'
 * @param {Storage} storage Storage provider (defaults to window.localStorage)
 */
export function clearChecklistProgress(serviceId, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    storage?.removeItem(`${CHECKLIST_STORAGE_PREFIX}${serviceId}`);
  } catch (err) {
    console.warn('Error clearing checklist progress:', err);
  }
}
