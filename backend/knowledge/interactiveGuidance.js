/**
 * Interactive Step-by-Step Guidance Engine for Sahayak
 * Grounded in verified Income Tax / Protean and NHA government procedures.
 */

export const STEP_GUIDANCE_DATA = {
  pan_card: {
    totalSteps: 6,
    en: {
      serviceName: 'PAN Card Application',
      initialPrompt: "Sure! I'll guide you through applying for a PAN card one step at a time.",
      steps: [
        {
          stepNumber: 1,
          title: 'Open Official Application Portal',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Open the official Protean PAN application portal (https://onlineservices.proteantech.in/paam/endUserRegisterContact.html) and select the online application option.',
          simplerGuidance: 'Open your web browser and go to the official Protean PAN website at https://onlineservices.proteantech.in/paam/endUserRegisterContact.html. Look for the "Apply Online" tab on the page.',
          checkQuestion: 'Have you opened the portal? Or do you need help with this step?'
        },
        {
          stepNumber: 2,
          title: 'Select Application Type & Category',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Under "Application Type", select "New PAN - Indian Citizen (Form 49A / Form F093)". Under "Category", select "Individual".',
          simplerGuidance: 'On the application form, there are two dropdowns at the top. Choose "New PAN - Indian Citizen" in the first box, and "Individual" (meaning for a single person) in the second box.',
          checkQuestion: "Let me know when you've selected these, or ask me if anything is unclear."
        },
        {
          stepNumber: 3,
          title: 'Fill Applicant Personal Details',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Fill in your Title, Last Name/Surname, First Name, Date of Birth, active Mobile Number, and Email Address. Check the consent box and submit to generate a temporary token number.',
          simplerGuidance: 'Enter your basic details: full name as per Aadhaar, date of birth, mobile number, and email. Then tick the agreement checkbox and click submit.',
          checkQuestion: 'Have you filled your details and generated the token number? Let me know when ready for the next step.'
        },
        {
          stepNumber: 4,
          title: 'Choose Submission Mode & e-KYC',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Select "Submit digitally through e-KYC & e-Sign (Paperless)". This uses your Aadhaar and mobile OTP, so no physical documents need to be posted.',
          simplerGuidance: 'Choose the paperless digital option with Aadhaar OTP. This is the fastest way because you do not have to mail physical papers anywhere.',
          checkQuestion: 'Have you completed the Aadhaar OTP authentication? Or are you using a different submission mode?'
        },
        {
          stepNumber: 5,
          title: 'Pay the Government Application Fee',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Pay the official government fee (₹101 to ₹107 depending on mode for physical card delivery in India, or ₹66 to ₹72 for e-PAN only) using UPI, net banking, or debit card.',
          simplerGuidance: 'Make the online payment of approximately ₹101 to ₹107 for a physical card using UPI, Google Pay, debit card, or net banking.',
          checkQuestion: 'Has your payment gone through? Let me know when you receive the payment confirmation.'
        },
        {
          stepNumber: 6,
          title: 'Save Acknowledgement & Track Delivery',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Download and save the 15-digit acknowledgement receipt. You can use this number on the Protean portal to track your PAN card delivery status.',
          simplerGuidance: 'Download your receipt and write down the 15-digit acknowledgement number. Your digital e-PAN will arrive in your email in 1-2 days, and the physical card will be delivered to your address in 10-15 days.',
          checkQuestion: 'Did you save your 15-digit acknowledgement receipt?'
        }
      ]
    },
    hi: {
      serviceName: 'पैन कार्ड आवेदन',
      initialPrompt: 'ज़रूर! मैं आपको नया पैन कार्ड बनवाने की प्रक्रिया में एक-एक कदम करके मार्गदर्शन करूंगा।',
      steps: [
        {
          stepNumber: 1,
          title: 'आधिकारिक पोर्टल खोलें',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'आधिकारिक Protean पैन पोर्टल (https://onlineservices.proteantech.in/paam/endUserRegisterContact.html) खोलें और ऑनलाइन आवेदन का विकल्प चुनें।',
          simplerGuidance: 'अपने मोबाइल या कंप्यूटर के ब्राउज़र में Protean की आधिकारिक वेबसाइट https://onlineservices.proteantech.in/paam/endUserRegisterContact.html खोलें।',
          checkQuestion: 'क्या आपने पोर्टल खोल लिया है? या आपको इस कदम में कोई सहायता चाहिए?'
        },
        {
          stepNumber: 2,
          title: 'आवेदन प्रकार व श्रेणी चुनें',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'आवेदन प्रकार (Application Type) में "New PAN - Indian Citizen (Form 49A / Form F093)" और श्रेणी (Category) में "Individual" चुनें।',
          simplerGuidance: 'फॉर्म के सबसे ऊपर पहले बॉक्स में "New PAN - Indian Citizen" चुनें और दूसरे बॉक्स में "Individual" (व्यक्तिगत) चुनें।',
          checkQuestion: 'क्या आपने यह चुन लिया है? हो जाने पर मुझे बताएं, या कोई संदेह हो तो पूछें।'
        },
        {
          stepNumber: 3,
          title: 'आवेदक का व्यक्तिगत विवरण भरें',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'अपना उपनाम (Surname), पहला नाम, जन्मतिथि, आधार से जुड़ा मोबाइल नंबर और ईमेल आईडी भरें, फिर सहमति देकर सबमिट करें।',
          simplerGuidance: 'अपना आधार कार्ड के अनुसार सही नाम, जन्मतिथि, मोबाइल नंबर और ईमेल भरें। फिर सहमति पर टिक करके आगे बढ़ें।',
          checkQuestion: 'क्या आपने अपना विवरण भरकर टोकन नंबर प्राप्त कर लिया है?'
        },
        {
          stepNumber: 4,
          title: 'आवेदन माध्यम व आधार e-KYC चुनें',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'कागज-रहित डिजिटल आवेदन के लिए "Submit digitally through e-KYC & e-Sign" चुनें और आधार से जुड़े मोबाइल पर आए OTP से प्रमाणीकरण करें।',
          simplerGuidance: 'आधार OTP वाला डिजिटल माध्यम चुनें। इसमें कोई कागज़ डाक से भेजने की ज़रूरत नहीं होती।',
          checkQuestion: 'क्या आपका आधार OTP सत्यापन पूरा हो गया है? या कोई समस्या आ रही है?'
        },
        {
          stepNumber: 5,
          title: 'सरकारी शुल्क का भुगतान करें',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'माध्यम के अनुसार निर्धारित सरकारी शुल्क (फिजिकल कार्ड हेतु ₹101 से ₹107, या केवल ई-पैन हेतु ₹66 से ₹72) का भुगतान UPI या नेट बैंकिंग से करें।',
          simplerGuidance: 'फिजिकल कार्ड के लिए लगभग ₹101 से ₹107 का ऑनलाइन भुगतान UPI (जैसे Google Pay/PhonePe) या कार्ड से करें।',
          checkQuestion: 'क्या भुगतान सफलतापूर्वक हो गया है? रसीद आने पर मुझे बताएं।'
        },
        {
          stepNumber: 6,
          title: 'पावती संख्या सुरक्षित रखें व ट्रैक करें',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'उत्पन्न हुई 15-अंकों की पावती रसीद (Acknowledgement Receipt) डाउनलोड करें। इस संख्या से आप पोर्टल पर अपने पैन कार्ड की स्थिति ट्रैक कर सकते हैं।',
          simplerGuidance: 'अपनी 15-अंकों की पावती संख्या को लिखकर या डाउनलोड करके सुरक्षित रख लें। 1-2 दिन में ई-पैन ईमेल पर और 10-15 दिन में कार्ड पते पर आ जाएगा।',
          checkQuestion: 'क्या आपने अपनी 15-अंकों की पावती संख्या सुरक्षित रख ली है?'
        }
      ]
    },
    te: {
      serviceName: 'పాన్ కార్డ్ దరఖాస్తు',
      initialPrompt: 'ఖచ్చితంగా! పాన్ కార్డ్ దరఖాస్తు కోసం నేను మీకు ఒక్కో దశగా మార్గదర్శకత్వం చేస్తాను.',
      steps: [
        {
          stepNumber: 1,
          title: 'అధికారిక పోర్టల్ తెరవండి',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'అధికారిక Protean పాన్ పోర్టల్ (https://onlineservices.proteantech.in/paam/endUserRegisterContact.html) ఓపెన్ చేసి ఆన్‌లైన్ దరఖాస్తు ఎంపికను ఎంచుకోండి.',
          simplerGuidance: 'మీ బ్రౌజర్‌లో అధికారిక Protean వెబ్‌సైట్ https://onlineservices.proteantech.in/paam/endUserRegisterContact.html ఓపెన్ చేయండి.',
          checkQuestion: 'మీరు పోర్టల్ తెరిచారా? లేదా ఈ దశలో ఏదైనా సహాయం కావాలా?'
        },
        {
          stepNumber: 2,
          title: 'దరఖాస్తు రకం & కేటగిరీ ఎంచుకోండి',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'Application Type లో "New PAN - Indian Citizen (Form 49A / Form F093)" ఎంచుకోండి మరియు Category లో "Individual" ఎంచుకోండి.',
          simplerGuidance: 'మొదటి బాక్స్‌లో "New PAN - Indian Citizen" ఎంచుకోండి మరియు రెండో బాక్స్‌లో "Individual" (వ్యక్తిగతం) ఎంచుకోండి.',
          checkQuestion: 'ఇది పూర్తి చేశారా? సందేహాలు ఉంటే అడగండి లేదా పూర్తయిన తర్వాత చెప్పండి.'
        },
        {
          stepNumber: 3,
          title: 'దరఖాస్తుదారు వ్యక్తిగత వివరాలు నమోదు చేయండి',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'మీ ఇంటిపేరు, పేరు, పుట్టిన తేదీ, మొబైల్ నంబర్ మరియు ఈమెయిల్ ఐడీ నమోదు చేసి నిబంధనలను అంగీకరించి సమర్పించండి.',
          simplerGuidance: 'ఆధార్ ప్రకారం మీ పేరు, పుట్టిన తేదీ, మొబైల్ నంబర్ మరియు ఈమెయిల్ ఇవ్వండి. తర్వాత సబ్మిట్ చేయండి.',
          checkQuestion: 'మీ వివరాలు ఇచ్చి టోకెన్ నంబర్ పొందారా? తదుపరి దశకు సిద్ధంగా ఉన్నారా?'
        },
        {
          stepNumber: 4,
          title: 'సమర్పణ విధానం & ఆధార్ e-KYC ఎంచుకోండి',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'పేపర్‌లెస్ ప్రాసెస్ కోసం "Submit digitally through e-KYC & e-Sign" ఎంచుకుని ఆధార్ లింక్డ్ మొబైల్ OTP ద్వారా ధృవీకరించండి.',
          simplerGuidance: 'ఆధార్ OTP ద్వారా డిజిటల్ పద్ధతిని ఎంచుకోండి. కాగితాలు ఎక్కడికీ పోస్ట్ చేయాల్సిన అవసరం ఉండదు.',
          checkQuestion: 'మీ ఆధార్ OTP ధృవీకరణ పూర్తయిందా? లేదా ఏదైనా సమస్య ఉందా?'
        },
        {
          stepNumber: 5,
          title: 'ప్రభుత్వ రుసుము చెల్లించండి',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'ఎంచుకున్న విధానం ప్రకారం ప్రభుత్వ రుసుము (ఫిజికల్ కార్డుకు ₹101 నుండి ₹107, లేదా ఈ-పాన్‌కు ₹66 నుండి ₹72) UPI లేదా నెట్ బ్యాంకింగ్ ద్వారా చెల్లించండి.',
          simplerGuidance: 'ఫిజికల్ కార్డు కోసం దాదాపు ₹101 నుండి ₹107 వరకు UPI (Google Pay / PhonePe) లేదా కార్డుతో చెల్లించండి.',
          checkQuestion: 'చెల్లింపు విజయవంతంగా జరిగిందా? రసీదు వచ్చిన తర్వాత నాకు తెలియజేయండి.'
        },
        {
          stepNumber: 6,
          title: 'అక్నాలెడ్జ్‌మెంట్ నంబర్ భద్రపరుచుకోండి',
          portalUrl: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
          guidance: 'వచ్చిన 15 అంకెల అక్నాలెడ్జ్‌మెంట్ రసీదును డౌన్‌లోడ్ చేసి భద్రపరుచుకోండి. దీని ద్వారా మీ పాన్ కార్డ్ డెలివరీ స్థితిని ట్రాక్ చేయవచ్చు.',
          simplerGuidance: 'మీ 15 అంకెల రసీదు నంబర్‌ను భద్రపరుచుకోండి. 1-2 రోజుల్లో ఈ-పాన్ ఈమెయిల్‌కు, 10-15 రోజుల్లో కార్డ్ ఇంటికి వస్తుంది.',
          checkQuestion: 'మీ 15 అంకెల అక్నాలెడ్జ్‌మెంట్ రసీదును భద్రపరుచుకున్నారా?'
        }
      ]
    }
  },

  ayushman_bharat: {
    totalSteps: 5,
    en: {
      serviceName: 'Ayushman Bharat PM-JAY Enrolment',
      initialPrompt: "Sure! I'll guide you through checking eligibility and obtaining your Ayushman Bharat card one step at a time.",
      steps: [
        {
          stepNumber: 1,
          title: 'Check Eligibility Online',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'Visit the official NHA Beneficiary portal (https://beneficiary.nha.gov.in/). Log in with your mobile number to search your family in the beneficiary list by Ration Card, Aadhaar, or PM-JAY ID.',
          simplerGuidance: 'Go to https://beneficiary.nha.gov.in/ on your phone or computer. Enter your mobile number, get an OTP to log in, and search using your Ration Card or Aadhaar number.',
          checkQuestion: 'Have you logged in and searched for your family? Or do you need help checking your eligibility?'
        },
        {
          stepNumber: 2,
          title: 'Verify Family Details & Category',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'Confirm your name in the verified beneficiary list (SECC / NFSA database, or select the universal 70+ Senior Citizen category if applying for senior family members).',
          simplerGuidance: 'Check if your family members are listed. Note: If you have family members aged 70 or older, they are eligible under the universal senior citizen expansion regardless of income.',
          checkQuestion: "Did you find your family records on the screen? Let me know what you see, or if you need assistance."
        },
        {
          stepNumber: 3,
          title: 'Complete Aadhaar e-KYC',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'Click on the "e-KYC" button next to the beneficiary name. Authenticate via Aadhaar OTP on the registered mobile, or visit your nearest CSC centre for fingerprint verification.',
          simplerGuidance: 'Click e-KYC next to your name and verify using the OTP sent to your Aadhaar-linked mobile phone.',
          checkQuestion: 'Have you completed the Aadhaar OTP verification? Or would you prefer to visit a local CSC centre?'
        },
        {
          stepNumber: 4,
          title: 'Await Approval & Download Ayushman Card',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'After verification is submitted, wait for automatic or administrative approval. Once approved, download the digital Ayushman Card containing your unique ABHA ID.',
          simplerGuidance: 'Once approved (often within a few hours to a day), you can download your official Ayushman Card PDF right from the portal or DigiLocker.',
          checkQuestion: 'Has your card status updated to Approved? Let me know when you have downloaded it.'
        },
        {
          stepNumber: 5,
          title: 'Access Cashless Hospital Treatment',
          portalUrl: 'https://hospitals.pmjay.gov.in/',
          guidance: 'You can now present your Ayushman Card at any empanelled public or private hospital across India (search at https://hospitals.pmjay.gov.in/) for up to ₹5 Lakh free cashless care per year.',
          simplerGuidance: 'You are all set! Show this card at any listed government or private hospital to receive free hospital care up to ₹5 Lakh a year.',
          checkQuestion: 'Do you need help finding empanelled hospitals in your area?'
        }
      ]
    },
    hi: {
      serviceName: 'आयुष्मान भारत (PM-JAY) कार्ड',
      initialPrompt: 'ज़रूर! मैं आयुष्मान भारत योजना की पात्रता जांचने और कार्ड बनवाने के लिए एक-एक कदम करके आपका मार्गदर्शन करूंगा।',
      steps: [
        {
          stepNumber: 1,
          title: 'पात्रता की ऑनलाइन जांच करें',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'आधिकारिक NHA लाभार्थी पोर्टल (https://beneficiary.nha.gov.in/) खोलें। अपने मोबाइल नंबर से लॉगिन करें और राशन कार्ड या आधार से अपनी पात्रता खोजें।',
          simplerGuidance: 'https://beneficiary.nha.gov.in/ पोर्टल खोलें, मोबाइल नंबर पर आए OTP से लॉगिन करें और राशन कार्ड या आधार नंबर डालकर पात्रता चेक करें।',
          checkQuestion: 'क्या आपने लाभार्थी पोर्टल खोलकर पात्रता चेक कर ली है? या आपको इसमें मदद चाहिए?'
        },
        {
          stepNumber: 2,
          title: 'परिवार का विवरण व श्रेणी सत्यापित करें',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'पात्र लाभार्थी सूची में अपने परिवार के सदस्यों का नाम जांचें। (70 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिक आय की सीमा के बिना पात्र हैं)।',
          simplerGuidance: 'स्क्रीन पर अपने परिवार के नाम देखें। ध्यान दें कि 70 वर्ष से अधिक उम्र के बुजुर्गों के लिए अलग वरिष्ठ नागरिक कार्ड उपलब्ध है।',
          checkQuestion: 'क्या सूची में आपका या आपके परिवार का नाम दिख रहा है?'
        },
        {
          stepNumber: 3,
          title: 'आधार e-KYC प्रमाणीकरण करें',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'नाम के आगे "e-KYC" बटन पर क्लिक करें। आधार से जुड़े मोबाइल पर आए OTP से सत्यापन करें, या नजदीकी CSC केंद्र में फिंगरप्रिंट से सत्यापन कराएं।',
          simplerGuidance: 'नाम के सामने e-KYC पर क्लिक करके आधार OTP से सत्यापन पूरा करें।',
          checkQuestion: 'क्या आपका e-KYC सत्यापन पूरा हो गया है? या कोई कठिनाई आ रही है?'
        },
        {
          stepNumber: 4,
          title: 'स्वीकृति के बाद आयुष्मान कार्ड डाउनलोड करें',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'सत्यापन स्वीकृत होने के बाद, अपने अद्वितीय ABHA ID वाला डिजिटल आयुष्मान कार्ड सीधे पोर्टल या डिजिलॉकर से डाउनलोड करें।',
          simplerGuidance: 'स्वीकृति मिलने के बाद आप अपना आयुष्मान कार्ड पीडीएफ पोर्टल या डिजिलॉकर से डाउनलोड कर सकते हैं।',
          checkQuestion: 'क्या आपका कार्ड स्वीकृत हो गया है और आपने डाउनलोड कर लिया है?'
        },
        {
          stepNumber: 5,
          title: 'कैशलेस अस्पताल में मुफ़्त इलाज प्राप्त करें',
          portalUrl: 'https://hospitals.pmjay.gov.in/',
          guidance: 'सूचीबद्ध किसी भी सरकारी या निजी अस्पताल (hospitals.pmjay.gov.in पर देखें) में आयुष्मान कार्ड दिखाकर प्रति वर्ष ₹5 लाख तक का मुफ़्त कैशलेस इलाज प्राप्त करें।',
          simplerGuidance: 'आप तैयार हैं! किसी भी सूचीबद्ध अस्पताल में यह कार्ड दिखाकर परिवार के लिए प्रति वर्ष ₹5 लाख तक का मुफ़्त इलाज लें।',
          checkQuestion: 'क्या आपको अपने नज़दीक के सूचीबद्ध अस्पतालों को खोजने में मदद चाहिए?'
        }
      ]
    },
    te: {
      serviceName: 'ఆయుష్మాన్ భారత్ (PM-JAY)',
      initialPrompt: 'ఖచ్చితంగా! ఆయుష్మాన్ భారత్ కార్డు పొందడానికి నేను మీకు ఒక్కో దశగా మార్గదర్శకత్వం చేస్తాను.',
      steps: [
        {
          stepNumber: 1,
          title: 'ఆన్‌లైన్‌లో అర్హతను తనిఖీ చేయండి',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'అధికారిక NHA బెనిఫిషియరీ పోర్టల్ (https://beneficiary.nha.gov.in/) సందర్శించండి. మొబైల్ నంబర్‌తో లాగిన్ అయి రేషన్ కార్డు లేదా ఆధార్‌తో కుటుంబ అర్హతను శోధించండి.',
          simplerGuidance: 'https://beneficiary.nha.gov.in/ ఓపెన్ చేసి, మొబైల్ OTP తో లాగిన్ అయి రేషన్ కార్డ్ లేదా ఆధార్ నంబర్ ద్వారా అర్హతను చూడండి.',
          checkQuestion: 'మీరు పోర్టల్ తెరిచి అర్హతను తనిఖీ చేశారా? లేదా సహాయం కావాలా?'
        },
        {
          stepNumber: 2,
          title: 'కుటుంబ వివరాలు & వర్గాన్ని సరిచూసుకోండి',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'లబ్ధిదారుల జాబితాలో మీ కుటుంబ సభ్యుల పేర్లను సరిచూసుకోండి (70 ఏళ్లు లేదా అంతకంటే ఎక్కువ వయస్సు ఉన్న సీనియర్లకు ఆదాయ పరిమితి లేకుండా కార్డు లభిస్తుంది).',
          simplerGuidance: 'జాబితాలో మీ కుటుంబ సభ్యుల పేర్లు ఉన్నాయో లేదో చూడండి. 70 ఏళ్లు పైబడిన వారికి ప్రత్యేక కార్డు ఉంటుంది.',
          checkQuestion: 'జాబితాలో మీ పేర్లు కనిపిస్తున్నాయా? ఏదైనా సందేహం ఉంటే అడగండి.'
        },
        {
          stepNumber: 3,
          title: 'ఆధార్ e-KYC ధృవీకరణ పూర్తి చేయండి',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'పేరు పక్కన ఉన్న "e-KYC" పై క్లిక్ చేయండి. ఆధార్ మొబైల్ OTP ద్వారా లేదా సమీప CSC కేంద్రంలో బయోమెట్రిక్ ద్వారా ధృవీకరించండి.',
          simplerGuidance: 'e-KYC పై క్లిక్ చేసి ఆధార్ OTP తో వెరిఫికేషన్ పూర్తి చేయండి.',
          checkQuestion: 'మీ e-KYC ధృవీకరణ పూర్తయిందా? లేదా ఏదైనా సమస్య ఉందా?'
        },
        {
          stepNumber: 4,
          title: 'ఆమోదం తర్వాత ఆయుష్మాన్ కార్డు డౌన్‌లోడ్ చేయండి',
          portalUrl: 'https://beneficiary.nha.gov.in/',
          guidance: 'ధృవీకరణ ఆమోదించబడిన తర్వాత, ABHA ID తో కూడిన మీ డిజిటల్ ఆయుష్మాన్ కార్డును నేరుగా పోర్టల్ లేదా డిజిలాకర్ నుండి డౌన్‌లోడ్ చేసుకోండి.',
          simplerGuidance: 'ఆమోదం లభించిన తర్వాత మీ ఆయుష్మాన్ కార్డును పోర్టల్ నుండి లేదా డిజిలాకర్ నుండి డౌన్‌లోడ్ చేసుకోండి.',
          checkQuestion: 'మీ కార్డు ఆమోదించబడిందా మరియు డౌన్‌లోడ్ చేసుకున్నారా?'
        },
        {
          stepNumber: 5,
          title: 'ఆసుపత్రుల్లో ఉచిత నగదు రహిత చికిత్స పొందండి',
          portalUrl: 'https://hospitals.pmjay.gov.in/',
          guidance: 'ఏదైనా ఎంప్యానెల్డ్ ప్రభుత్వ లేదా ప్రైవేట్ ఆసుపత్రిలో (hospitals.pmjay.gov.in లో చూడండి) ఆయుష్మాన్ కార్డు చూపించి ఏడాదికి ₹5 లక్షల వరకు ఉచిత చికిత్స పొందండి.',
          simplerGuidance: 'ఏదైనా నమోదిత ఆసుపత్రిలో ఈ కార్డు చూపించి ఏడాదికి ₹5 లక్షల వరకు ఉచిత చికిత్స పొందవచ్చు.',
          checkQuestion: 'మీ ప్రాంతంలోని నెట్‌వర్క్ ఆసుపత్రుల వివరాలు కావాలా?'
        }
      ]
    }
  }
};

/**
 * Checks if user message explicitly requests step-by-step guidance.
 */
export function isExplicitStepGuidanceRequest(message) {
  if (!message || typeof message !== 'string') return false;
  const lower = message.toLowerCase();
  return (
    lower.includes('step by step') ||
    lower.includes('step-by-step') ||
    lower.includes('one step at a time') ||
    lower.includes('guide me step') ||
    lower.includes('guide me through') ||
    lower.includes('walk me through') ||
    lower.includes('take me through') ||
    lower.includes('steps to apply') ||
    lower.includes('application steps') ||
    lower.includes('स्टेप बाय स्टेप') ||
    lower.includes('कदम दर कदम') ||
    lower.includes('चरण दर चरण') ||
    lower.includes('एक एक कदम') ||
    lower.includes('एक-एक कदम') ||
    lower.includes('స్టెప్ బై స్టెప్') ||
    lower.includes('దశలవారీగా') ||
    lower.includes('దశల వారీగా') ||
    lower.includes('ఒక్కో దశ') ||
    lower.includes('ఒక్కొక్కటిగా')
  );
}

/**
 * Checks if user confirms step completion or requests to proceed to the next step.
 */
export function isStepConfirmation(message) {
  if (!message || typeof message !== 'string') return false;
  const lower = message.toLowerCase().trim();

  const exactPhrases = [
    'i opened it', 'opened it', 'opened', 'done', 'completed', 'i did it', 'did it',
    'finished', 'yes', 'yep', 'yeah', 'next', 'next step', 'proceed', 'ready',
    'ok done', 'okay done', 'what next', "what's next", 'what is next', 'continue',
    'हो गया', 'खोल लिया', 'कर दिया', 'हाँ', 'हां', 'अगला', 'आगे', 'अगला कदम', 'आगे बताइए',
    'तैयार', 'कर लिया', 'हो चुका', 'పూర్తయింది', 'అయిపోయింది', 'చేశాను', 'ఓపెన్ చేశాను', 'తదుపరి',
    'తర్వాత', 'ముందుకు వెళ్లండి', 'తర్వాతి దశ', 'సిద్ధంగా ఉన్నాను', 'సరే'
  ];

  if (exactPhrases.includes(lower)) return true;

  return exactPhrases.some((phrase) => {
    return lower.startsWith(phrase + ' ') || lower.endsWith(' ' + phrase) || lower.includes(' ' + phrase + ' ');
  });
}

/**
 * Checks if user expresses confusion or asks for simpler explanation of the current step.
 */
export function isStepConfusionOrHelp(message) {
  if (!message || typeof message !== 'string') return false;
  const lower = message.toLowerCase().trim();
  return (
    lower.includes('confused') ||
    lower.includes("don't understand") ||
    lower.includes('dont understand') ||
    lower.includes('explain again') ||
    lower.includes('simpler') ||
    lower.includes('simple words') ||
    lower.includes('stuck') ||
    lower.includes('what do you mean') ||
    lower.includes('not clear') ||
    lower.includes('what should i do') ||
    lower.includes('समझ नहीं आया') ||
    lower.includes('समझ नहीं आ रहा') ||
    lower.includes('सरल शब्दों') ||
    lower.includes('आसान शब्दों') ||
    lower.includes('अटक गया') ||
    lower.includes('फिर से बताएं') ||
    lower.includes('क्या करूं') ||
    lower.includes('అర్థం కాలేదు') ||
    lower.includes('సరళంగా') ||
    lower.includes('సులభంగా') ||
    lower.includes('మళ్లీ చెప్పండి') ||
    lower.includes('ఏం చేయాలి')
  );
}

/**
 * Checks if user explicitly requests to stop or exit the guided walkthrough.
 */
export function isStepExitRequest(message) {
  if (!message || typeof message !== 'string') return false;
  const lower = message.toLowerCase().trim();
  const exitWords = [
    'stop', 'exit', 'cancel', 'quit', 'stop guidance', 'stop guiding', 'end guidance',
    'leave', 'रुको', 'रुकिए', 'बंद करो', 'कैंसिल', 'समाप्त',
    'ఆపండి', 'వద్దు', 'రద్దు', 'ఆపేయండి'
  ];
  return exitWords.some((w) => lower === w || lower.startsWith(w + ' ') || lower.endsWith(' ' + w));
}

/**
 * Formats the response for a specific step in the interactive guide.
 */
export function formatStepResponse({ workflow, stepIndex, language = 'en', isInitial = false, isSimpler = false }) {
  const serviceData = STEP_GUIDANCE_DATA[workflow] || STEP_GUIDANCE_DATA.pan_card;
  const langData = serviceData[language] || serviceData.en;
  const step = langData.steps.find((s) => s.stepNumber === stepIndex) || langData.steps[0];
  const total = serviceData.totalSteps;

  const stepLabel = language === 'hi' ? 'चरण' : language === 'te' ? 'దశ' : 'Step';
  const instruction = isSimpler ? step.simplerGuidance : step.guidance;

  if (isInitial) {
    return `${langData.initialPrompt}\n\n${stepLabel} ${step.stepNumber}: ${instruction}\n\n${step.checkQuestion}`;
  }

  const acknowledgement = language === 'hi'
    ? 'बहुत बढ़िया!'
    : language === 'te'
    ? 'చాలా మంచిది!'
    : 'Great!';

  return `${acknowledgement} ${stepLabel} ${step.stepNumber}: ${instruction}\n\n${step.checkQuestion}`;
}

/**
 * Formats completion response when all steps in the walkthrough are completed.
 */
export function formatCompletionResponse({ workflow, language = 'en' }) {
  if (language === 'hi') {
    return '🎉 बहुत बढ़िया! आपने इस सेवा के लिए सभी मार्गदर्शन चरण पूरे कर लिए हैं। पोर्टल से प्राप्त पावती संख्या या ABHA ID को सुरक्षित रखें। याद रखें: आधिकारिक सत्यापन, कार्ड स्वीकृति और भुगतान केवल सरकारी पोर्टल पर ही होते हैं। क्या मैं किसी अन्य चीज़ में आपकी मदद कर सकता हूँ?';
  }
  if (language === 'te') {
    return '🎉 అభినందనలు! మీరు ఈ సేవకు సంబంధించిన అన్ని మార్గదర్శక దశలను విజయవంతంగా పూర్తి చేశారు. పోర్టల్ నుండి అక్నాలెడ్జ్‌మెంట్ నంబర్ లేదా ABHA ID ని భద్రపరుచుకోండి. గుర్తుంచుకోండి: అధికారిక ధృవీకరణ మరియు ఆమోదాలు ప్రభుత్వ పోర్టల్‌లోనే జరుగుతాయి. నేను ఇంకా ఏదైనా సహాయం చేయగలనా?';
  }
  return '🎉 Excellent! You have completed all the guided preparation steps for this service. Ensure you save your official acknowledgement number or ABHA ID from the government portal. Remember: All formal verification, payments, and approvals take place directly on official government portals. Is there anything else I can help you with?';
}

/**
 * Formats exit / cancellation response when user asks to stop step-by-step guidance.
 */
export function formatExitResponse({ language = 'en' }) {
  if (language === 'hi') {
    return 'समझ गया! मैंने स्टेप-बाय-स्टेप मार्गदर्शन समाप्त कर दिया है। जब भी आपको पैन कार्ड या आयुष्मान भारत के बारे में कोई अन्य सवाल पूछना हो, आप बेझिझक पूछ सकते हैं।';
  }
  if (language === 'te') {
    return 'అర్థమైంది! నేను దశలవారీ మార్గదర్శకత్వాన్ని నిలిపివేశాను. పాన్ కార్డ్ లేదా ఆయుష్మాన్ భారత్ గురించి ఏవైనా సాధారణ ప్రశ్నలు ఉంటే ఎప్పుడైనా అడగవచ్చు.';
  }
  return 'Understood! I have stopped the step-by-step guidance. Feel free to ask any other questions about PAN Card or Ayushman Bharat whenever you need.';
}

/**
 * Generates step checkpoint reminder when user asks a mid-step question.
 */
export function formatStepCheckpoint({ workflow, stepIndex, language = 'en' }) {
  const serviceData = STEP_GUIDANCE_DATA[workflow] || STEP_GUIDANCE_DATA.pan_card;
  const nextStepIndex = stepIndex + 1;
  const stepLabel = language === 'hi' ? 'चरण' : language === 'te' ? 'దశ' : 'Step';

  if (language === 'hi') {
    return `\n\n(जब आप तैयार हों, मुझे बताएं कि क्या आपने ${stepLabel} ${stepIndex} पूरा कर लिया है ताकि हम ${stepLabel} ${nextStepIndex} पर आगे बढ़ सकें।)`;
  }
  if (language === 'te') {
    return `\n\n(మీరు సిద్ధంగా ఉన్నప్పుడు, మేము ${stepLabel} ${nextStepIndex} కి వెళ్ళడానికి ${stepLabel} ${stepIndex} పూర్తి చేశారో లేదో నాకు తెలియజేయండి.)`;
  }
  return `\n\n(Whenever you are ready, let me know if you have completed ${stepLabel} ${stepIndex} so we can proceed to ${stepLabel} ${nextStepIndex}.)`;
}
