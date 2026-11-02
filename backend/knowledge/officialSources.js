/**
 * Sahayak Official Government Knowledge Sources Registry
 * 
 * Strict Grounding & Integrity Rules:
 * 1. Only official Government of India (.gov.in) or statutory authorised service providers (Protean, UTIITSL).
 * 2. Real manually verified dates (never fabricated or mocked as today's date).
 * 3. Specific factual claims mapped to the verifying source.
 */

export const OFFICIAL_SOURCES = [
  // --- PAN CARD OFFICIAL SOURCES ---
  {
    id: 'protean_pan',
    service: 'pan_card',
    title: 'Protean eGov Technologies - Online PAN Application Portal',
    organisation: 'Protean eGov Technologies Limited (Authorised by Income Tax Department, GoI)',
    portalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    authorityType: 'Authorised Statutory Service Provider',
    domain: 'nsdl.com / proteantech.in',
    lastVerifiedDate: '2026-10-15',
    summary: 'Official online application portal for Form 49A (Indian citizens) and Form 49AA (Foreign citizens), supporting paperless Aadhaar e-KYC and digital payment.',
    verifiedClaims: [
      {
        claim: 'Form 49A is the statutory application form for Indian citizens applying for a new PAN card.',
        sourceSection: 'Form Selection Guidelines'
      },
      {
        claim: 'Standard fee for physical PAN card dispatch within India is ₹107 (₹93 fee + 18% GST).',
        sourceSection: 'PAN Application Fees & Payment Terms'
      },
      {
        claim: 'Digital e-PAN delivery fee to email address is ₹72 (including GST).',
        sourceSection: 'e-PAN Only Pricing'
      },
      {
        claim: 'Paperless e-KYC is executed using Aadhaar OTP authentication on the mobile number linked with UIDAI.',
        sourceSection: 'Paperless Submission Methods'
      },
      {
        claim: 'Physical PAN card delivery takes 10 to 15 business days following successful biometric/OTP verification.',
        sourceSection: 'Dispatch & Delivery Timeline'
      }
    ]
  },
  {
    id: 'incometax_efiling',
    service: 'pan_card',
    title: 'Income Tax Department - e-Filing Portal',
    organisation: 'Income Tax Department, Ministry of Finance, Government of India',
    portalUrl: 'https://www.incometax.gov.in/iec/foportal/',
    authorityType: 'Central Government Department (.gov.in)',
    domain: 'incometax.gov.in',
    lastVerifiedDate: '2026-10-15',
    summary: 'Central statutory portal for Instant e-PAN issuance via Aadhaar, PAN-Aadhaar linking verification, and Income Tax returns.',
    verifiedClaims: [
      {
        claim: 'Instant e-PAN via Aadhaar is issued free of charge in PDF format for first-time applicants holding an Aadhaar with linked mobile.',
        sourceSection: 'Instant e-PAN Guidelines'
      },
      {
        claim: 'Aadhaar serves as standalone Proof of Identity (PoI), Proof of Address (PoA), and Date of Birth (DoB) for PAN issuance.',
        sourceSection: 'Valid Proof Documents List'
      },
      {
        claim: 'Linking PAN with Aadhaar is mandatory for all Indian tax filers under Section 139AA of Income Tax Act.',
        sourceSection: 'Link Aadhaar Statutory Notice'
      }
    ]
  },
  {
    id: 'utiitsl_pan',
    service: 'pan_card',
    title: 'UTI Infrastructure Technology And Services Limited (UTIITSL)',
    organisation: 'UTIITSL (A Government of India Company, Ministry of Finance)',
    portalUrl: 'https://www.pan.utiitsl.com/',
    authorityType: 'Government of India Enterprise',
    domain: 'utiitsl.com',
    lastVerifiedDate: '2026-10-15',
    summary: 'Official government-owned enterprise operating nationwide PAN processing, physical document verification, and regional service counters.',
    verifiedClaims: [
      {
        claim: 'Physical document submission mode allows applicants without Aadhaar-linked mobile numbers to post physical forms and proofs.',
        sourceSection: 'Physical Form Submission Flow'
      },
      {
        claim: 'UTIITSL operates authorised PAN centres across all Indian states and Union Territories for in-person document verification.',
        sourceSection: 'PAN Service Centre Directory'
      }
    ]
  },

  // --- AYUSHMAN BHARAT (PM-JAY) OFFICIAL SOURCES ---
  {
    id: 'nha_pmjay_main',
    service: 'ayushman_bharat',
    title: 'National Health Authority - Ayushman Bharat PM-JAY Scheme Portal',
    organisation: 'National Health Authority (NHA), Ministry of Health and Family Welfare, Government of India',
    portalUrl: 'https://nha.gov.in/PM-JAY',
    authorityType: 'Apex National Health Agency (.gov.in)',
    domain: 'nha.gov.in',
    lastVerifiedDate: '2026-10-20',
    summary: 'Official governing portal outlining entitlements, hospital empanelment criteria, benefit packages, and scheme rules.',
    verifiedClaims: [
      {
        claim: 'Provides ₹5,00,000 (5 Lakh Rupees) cashless health cover per eligible family per year for secondary and tertiary hospitalization.',
        sourceSection: 'Key Benefits & Entitlement'
      },
      {
        claim: 'All senior citizens aged 70 years and above are eligible for up to ₹5 Lakh annual top-up health cover regardless of family income.',
        sourceSection: 'Ayushman Vaya Vandana Expansion Guidelines (October 2024 Gazette)'
      },
      {
        claim: 'Scheme has no cap on family size or age limit for beneficiary households.',
        sourceSection: 'Beneficiary Criteria'
      },
      {
        claim: 'Treatment, diagnostics, medicines, and 15 days of post-hospitalization care are completely cashless at empanelled hospitals.',
        sourceSection: 'Benefit Package Inclusions'
      }
    ]
  },
  {
    id: 'nha_beneficiary_portal',
    service: 'ayushman_bharat',
    title: 'PM-JAY Beneficiary Portal (Check Eligibility & Download Ayushman Card)',
    organisation: 'National Health Authority (NHA), Government of India',
    portalUrl: 'https://beneficiary.nha.gov.in/',
    authorityType: 'Official Government Beneficiary Portal (.gov.in)',
    domain: 'beneficiary.nha.gov.in',
    lastVerifiedDate: '2026-10-20',
    summary: 'Citizen-facing portal to verify household eligibility using Ration Card, Aadhaar, or PM-JAY family ID and download digital Ayushman PVC cards.',
    verifiedClaims: [
      {
        claim: 'Beneficiaries can verify their entitlement online using Aadhaar OTP or at any nearest Common Service Centre (CSC) via biometric e-KYC.',
        sourceSection: 'Online e-KYC & Verification'
      },
      {
        claim: 'Once Aadhaar e-KYC is approved, the Ayushman Card with unique ABHA number can be downloaded instantly for free.',
        sourceSection: 'Card Download Process'
      }
    ]
  },
  {
    id: 'nha_hospital_search',
    service: 'ayushman_bharat',
    title: 'PM-JAY Empanelled Hospital Locator Portal',
    organisation: 'National Health Authority (NHA), Government of India',
    portalUrl: 'https://hospitals.pmjay.gov.in/',
    authorityType: 'Official Government Hospital Registry (.gov.in)',
    domain: 'hospitals.pmjay.gov.in',
    lastVerifiedDate: '2026-10-20',
    summary: 'Official searchable registry of all empanelled public and private hospitals across India providing cashless PM-JAY treatment.',
    verifiedClaims: [
      {
        claim: 'Patients can receive cashless treatment across any state in India (national portability) at any empanelled public or private hospital.',
        sourceSection: 'National Portability Rules'
      },
      {
        claim: 'Every empanelled hospital has a dedicated Pradhan Mantri Arogya Mitra (PMAM) desk to facilitate admission and claims.',
        sourceSection: 'Hospital Helpdesk & Assistance'
      }
    ]
  },

  // --- ELECTION COMMISSION OF INDIA (BOUNDARY SOURCE) ---
  {
    id: 'eci_voters',
    service: 'voter_id',
    title: 'Election Commission of India - Voters Service Portal',
    organisation: 'Election Commission of India (ECI)',
    portalUrl: 'https://voters.eci.gov.in/',
    authorityType: 'Constitutional Authority (.gov.in)',
    domain: 'voters.eci.gov.in',
    lastVerifiedDate: '2026-10-10',
    summary: 'Constitutional portal for voter registration (Form 6), EPIC card download, and electoral roll search.',
    verifiedClaims: [
      {
        claim: 'Sahayak does not process Voter ID applications; citizens must apply directly via Form 6 on the official ECI portal.',
        sourceSection: 'Statutory Voter Portal Reference'
      }
    ]
  }
];

/**
 * Retrieves official sources corresponding to a specific workflow or query topic.
 */
export function getSourcesForWorkflow(workflow) {
  if (!workflow || workflow === 'general') return [];
  return OFFICIAL_SOURCES.filter((s) => s.service === workflow);
}

/**
 * Retrieves a specific official source by ID.
 */
export function getSourceById(sourceId) {
  return OFFICIAL_SOURCES.find((s) => s.id === sourceId) || null;
}

/**
 * Returns formatted source citations for API responses.
 */
export function formatSourcesForResponse(workflow) {
  const sources = getSourcesForWorkflow(workflow);
  return sources.map((s) => ({
    id: s.id,
    title: s.title,
    organisation: s.organisation,
    url: s.portalUrl,
    domain: s.domain,
    authorityType: s.authorityType,
    lastVerifiedDate: s.lastVerifiedDate,
    summary: s.summary,
    claims: s.verifiedClaims.map((c) => c.claim)
  }));
}
