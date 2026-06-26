import { DocumentTemplate } from '../models/types';

/** Built-in checklist templates. Localized labels keep them usable in any language. */
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl_job',
    icon: 'briefcase-outline',
    title: { en: 'Job application', hi: 'नौकरी आवेदन', mr: 'नोकरी अर्ज' },
    items: [
      { key: 'resume', label: { en: 'Updated resume', hi: 'अपडेटेड रिज़्यूमे', mr: 'अद्ययावत रेझ्युमे' } },
      { key: 'photo', label: { en: 'Passport photo', hi: 'पासपोर्ट फोटो', mr: 'पासपोर्ट फोटो' } },
      { key: 'id', label: { en: 'ID proof (Aadhaar/PAN)', hi: 'पहचान पत्र (आधार/पैन)', mr: 'ओळखपत्र (आधार/पॅन)' } },
      { key: 'marksheet', label: { en: 'Marksheets / certificates', hi: 'मार्कशीट / प्रमाणपत्र', mr: 'गुणपत्रिका / प्रमाणपत्रे' } },
      { key: 'experience', label: { en: 'Experience letter', hi: 'अनुभव पत्र', mr: 'अनुभव पत्र' } },
    ],
  },
  {
    id: 'tpl_rental',
    icon: 'home-outline',
    title: { en: 'Rental agreement', hi: 'किराया अनुबंध', mr: 'भाडे करार' },
    items: [
      { key: 'idtenant', label: { en: 'Tenant ID proof', hi: 'किरायेदार पहचान', mr: 'भाडेकरू ओळखपत्र' } },
      { key: 'idowner', label: { en: 'Owner ID proof', hi: 'मालिक पहचान', mr: 'मालक ओळखपत्र' } },
      { key: 'photos', label: { en: 'Passport photos (both)', hi: 'पासपोर्ट फोटो (दोनों)', mr: 'पासपोर्ट फोटो (दोघांचे)' } },
      { key: 'deposit', label: { en: 'Deposit amount agreed', hi: 'जमा राशि तय', mr: 'अनामत रक्कम ठरली' } },
      { key: 'stamp', label: { en: 'Stamp paper', hi: 'स्टांप पेपर', mr: 'स्टॅम्प पेपर' } },
    ],
  },
  {
    id: 'tpl_kyc',
    icon: 'card-outline',
    title: { en: 'KYC', hi: 'केवाईसी', mr: 'केवायसी' },
    items: [
      { key: 'aadhaar', label: { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' } },
      { key: 'pan', label: { en: 'PAN card', hi: 'पैन कार्ड', mr: 'पॅन कार्ड' } },
      { key: 'photo', label: { en: 'Passport photo', hi: 'पासपोर्ट फोटो', mr: 'पासपोर्ट फोटो' } },
      { key: 'address', label: { en: 'Address proof', hi: 'पता प्रमाण', mr: 'पत्ता पुरावा' } },
      { key: 'mobile', label: { en: 'Mobile linked', hi: 'मोबाइल लिंक', mr: 'मोबाइल जोडलेला' } },
    ],
  },
  {
    id: 'tpl_exam',
    icon: 'school-outline',
    title: { en: 'Exam form', hi: 'परीक्षा फॉर्म', mr: 'परीक्षा फॉर्म' },
    items: [
      { key: 'photo', label: { en: 'Scanned photo', hi: 'स्कैन फोटो', mr: 'स्कॅन फोटो' } },
      { key: 'sign', label: { en: 'Scanned signature', hi: 'स्कैन हस्ताक्षर', mr: 'स्कॅन स्वाक्षरी' } },
      { key: 'idproof', label: { en: 'ID proof', hi: 'पहचान पत्र', mr: 'ओळखपत्र' } },
      { key: 'fee', label: { en: 'Application fee paid', hi: 'फॉर्म शुल्क भरा', mr: 'फॉर्म शुल्क भरले' } },
      { key: 'category', label: { en: 'Category certificate', hi: 'श्रेणी प्रमाणपत्र', mr: 'प्रवर्ग प्रमाणपत्र' } },
    ],
  },
  {
    id: 'tpl_business',
    icon: 'storefront-outline',
    title: {
      en: 'Small business registration',
      hi: 'छोटा व्यापार रजिस्ट्रेशन',
      mr: 'लघु व्यवसाय नोंदणी',
    },
    items: [
      { key: 'pan', label: { en: 'PAN card', hi: 'पैन कार्ड', mr: 'पॅन कार्ड' } },
      { key: 'aadhaar', label: { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' } },
      { key: 'gst', label: { en: 'GST details (if any)', hi: 'जीएसटी विवरण (यदि हो)', mr: 'जीएसटी तपशील (असल्यास)' } },
      { key: 'address', label: { en: 'Shop address proof', hi: 'दुकान पता प्रमाण', mr: 'दुकान पत्ता पुरावा' } },
      { key: 'bank', label: { en: 'Bank account details', hi: 'बैंक खाता विवरण', mr: 'बँक खाते तपशील' } },
    ],
  },
];
