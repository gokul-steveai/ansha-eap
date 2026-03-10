import { MultiSelectOption } from "@/types";

export const LANGUAGES = [
  "Afrikaans", "Akan", "Albanian", "Algerian", "Amharic", "Auslan", "Anuak", "Arabic",
  "Armenian", "Ashanti", "Assyrian", "Azerbaijani", "Badini", "Bajuni", "Bambara",
  "Basque", "Behdini", "Belorussian", "Bengali", "Berber", "Bosnian", "Bulgarian",
  "Burmese", "Cantonese", "Catalan", "Chaldean", "Chaochow", "Chamorro", "Chavacano",
  "Chuukese", "Creole", "Croatian", "Czech", "Dakota", "Danish", "Dari", "Dinka",
  "Dutch", "English", "Eritrean", "Estonian", "Ewe", "Farsi", "Fijian Hindi", "Finnish",
  "Flemish", "French", "French Canadian", "Fukienese", "Fula", "Fulani", "Fuzhou", "Ga",
  "Gaelic", "Georgian", "German", "Gorani", "Greek", "Gujarati", "Haitian Creole", "Hakka",
  "Hakka - China", "Hakka - Taiwan", "Hausa", "Hebrew", "Hindi", "Hmong", "Hungarian",
  "Ibanag", "Ibo", "Icelandic", "Igbo", "Ilocano", "Indonesian", "Italian", "Jakartanese",
  "Japanese", "Javanese", "Karen", "Kashmiri", "Khmer (Cambodian)", "Kinyarwanda", "Kirundi",
  "Korean", "Kosovan", "Kreo", "Krio", "Kurdish", "Kurmanji", "Lakota", "Laotian", "Latvian",
  "Lebanese", "Lingala", "Lithuanian", "Luganda", "Lusoga", "Luxembourgeois", "Maay",
  "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Mandarin", "Mandingo",
  "Mandinka", "Mankon", "Marshallese", "Mien", "Mina", "Mirpuri", "Mixteco", "Moldovan",
  "Mongolian", "Navajo", "Ndebele", "Neapolitan", "Nepali", "Nigerian Pidgin English",
  "Norwegian", "Nuer", "Oromo", "Papiamento", "Pashto", "Patois", "Persian", "Pidgin English",
  "Polish", "Portuguese", "Portuguese Creole", "Pothwari", "Punjabi", "Romanian", "Russian",
  "Samoan", "Serbian", "Shanghainese", "Shona", "Sicilian", "Sinhalese", "Sindhi", "Slovak",
  "Slovenian", "Somali", "Sorani", "Spanish", "Sri Lankan", "Swahili", "Swedish", "Sylhetti",
  "Szechuan", "Tagalog", "Taiwanese", "Tamil", "Telugu", "Thai", "Tibetan", "Tigre", "Tigrinya",
  "Toishanese", "Tongan", "Tshiluba", "Turkish", "Twi", "Ukrainian", "Urdu", "Vietnamese",
  "Visayan", "Welsh", "Wolof", "Yiddish", "Yoruba", "Yupik", "Serbo-Croatian", "Teo-Chew",
  "Hokkien", "Marathi", "Fijian", "Kannada", "Maori", "Yugoslavian", "Khmer", "Oriya",
  "Chinese", "Swiss", "Egyptian", "Sign Language", "American Sign Language",
  "Quebec Sign Language", "Kutchi", "SEE", "Ojibway"
];

export const LANGUAGE_OPTIONS: MultiSelectOption[] = LANGUAGES.map((lang) => ({ label: lang, value: lang }));

export const MODALITY_OPTIONS: MultiSelectOption[] = [
  { value: "act", label: "Acceptance and Commitment Therapy (ACT)" },
  { value: "cbt", label: "Cognitive-Behavioral Therapy (CBT)" },
  { value: "dbt", label: "Dialectical Behavior Therapy" },
  { value: "sft", label: "Solution-Focused Therapy" },
];
export const LOCATIONS_OPTIONS: MultiSelectOption[] = [
  { value: "ballarat", label: "Ballarat" },
  { value: "bacchus_marsh", label: "Bacchus Marsh" },
  { value: "geelong", label: "Geelong" },
  { value: "melton", label: "Melton" },
  { value: "melbourne", label: "Melbourne" },
];


export const PROFESSIONAL_REGISTRATION_OPTIONS: MultiSelectOption[] = [
    { value: "ahpra", label: "AHPRA" },
    { value: "apa", label: "Australian Physiotherapy Association" },
]
export const IDENTIFICATION_OPTIONS: MultiSelectOption[] = [
    { value: "pbs", label: "PBS Prescriber Number" },
]

export const EXPERTISE_OPTIONS = [
  { value: "Acupuncture", label: "Acupuncture" },
  { value: "Amputation rehabilitation", label: "Amputation rehabilitation" },
  { value: "Aquatic", label: "Aquatic" },
  { value: "Burns", label: "Burns" },
  { value: "Cancer support", label: "Cancer support" },
  { value: "Cardiorespiratory physiotherapy", label: "Cardiorespiratory physiotherapy" },
  { value: "Cerebral palsy", label: "Cerebral palsy" },
  { value: "Continence & Women's Health", label: "Continence & Women's Health" },
  { value: "Disabilities", label: "Disabilities" },
  { value: "Dry needling", label: "Dry needling" },
  { value: "Eating disorders", label: "Eating disorders" },
  { value: "Ergonomics", label: "Ergonomics" },
  { value: "Feldenkrais", label: "Feldenkrais" },
  { value: "General physiotherapy", label: "General physiotherapy" },
  { value: "General Treatment", label: "General Treatment" },
  { value: "Geriatrics", label: "Geriatrics" },
  { value: "Gerontology", label: "Gerontology" },
  { value: "Hand Therapy", label: "Hand Therapy" },
  { value: "Lymphodema", label: "Lymphodema" },
  { value: "Massage", label: "Massage" },
  { value: "Men's health", label: "Men's health" },
  { value: "Muscle pain", label: "Muscle pain" },
  { value: "Musculoskeletal physiotherapy", label: "Musculoskeletal physiotherapy" },
  { value: "Neurological disorders", label: "Neurological disorders" },
  { value: "Occupational Health", label: "Occupational Health" },
  { value: "Orthopaedics", label: "Orthopaedics" },
  { value: "Paediatrics", label: "Paediatrics" },
  { value: "Pain Management", label: "Pain Management" },
  { value: "Personal training", label: "Personal training" },
  { value: "Pilates", label: "Pilates" },
  { value: "Pre- & Post-Natal Physiotherapy", label: "Pre- & Post-Natal Physiotherapy" },
  { value: "Prehabilitation", label: "Prehabilitation" },
  { value: "Rehabilitation", label: "Rehabilitation" },
  { value: "Sports physiotherapy", label: "Sports physiotherapy" },
  { value: "Stroke", label: "Stroke" },
  { value: "Temporo-mandibular Joint (TMJ) problems", label: "Temporo-mandibular Joint (TMJ) problems" },
  { value: "Vertigo and Vestibular Disorders", label: "Vertigo and Vestibular Disorders" }
];


export const PATIENT_FOCUS_OPTIONS = [
  { value: "Children", label: "Children" },
  { value: "Teenagers", label: "Teenagers" },
  { value: "Adults", label: "Adults" },
  { value: "Families", label: "Families" },
  { value: "Older adults", label: "Older adults" },
  { value: "Women", label: "Women" },
  { value: "Infants", label: "Infants" },
  { value: "Men", label: "Men" },
  { value: "People with disabilities", label: "People with disabilities" },
  { value: "Culturally and linguistically diverse communities", label: "Culturally and linguistically diverse communities" },
  { value: "Couples", label: "Couples" },
  { value: "Aboriginal & Torres Strait Islander", label: "Aboriginal & Torres Strait Islander" },
  { value: "Non-Binary People", label: "Non-Binary People" },
  { value: "LGBTIQ", label: "LGBTIQ" },
];

export const OTHER_SERVICES_OPTIONS = [
  { value: "Email consultations", label: "Email consultations" },
  { value: "Emergency after hours contact", label: "Emergency after hours contact" },
  { value: "Group Sessions", label: "Group Sessions" },
  { value: "Home Visits", label: "Home Visits" },
  { value: "Inpatient care", label: "Inpatient care" },
  { value: "Mobile service", label: "Mobile service" },
  { value: "Nursing home visits", label: "Nursing home visits" },
  { value: "Online consultations", label: "Online consultations" },
  { value: "School Visits", label: "School Visits" },
  { value: "Wheelchair access", label: "Wheelchair access" },
];


export const DAILY_CHECKINS_QUESTIONS = [
  {
    id: "dcq1",
    question: "How would you rate your energy today?",
    labels: {
      min: "Flat",
      max: "Energised",
    },
    min: 1,
    max: 5,
    rangeClassName: "bg-app-red-200",
    thumbClassName: "bg-app-red-200",
  },
  {
    id: "dcq2",
    question: "How stressed are you feeling right now?",
    labels: {
      min: "Not at all",
      max: "Extemely",
    },
    min: 1,
    max: 5,
    rangeClassName: "bg-app-blue-400",
    thumbClassName: "bg-app-blue-400",
  },
  {
    id: "dcq3",
    question: "How are you feeling today overall?",
    labels: {
      min: "Very low",
      max: "Great",
    },
    min: 1,
    max: 5,
    rangeClassName: "bg-app-yellow-400",
    thumbClassName: "bg-app-yellow-400",
  },
];


export const MOOD_STATEMENT_BANK = {
  above: [
    "Glad to know your mood is looking great today!",
    "You're shining bright today—keep it up!",
    "Your positivity is contagious!",
    "You’re on a roll—love to see it!",
    "Your mood is lifting the day already!",
    "Great energy today—keep spreading it!",
    "Love the vibe you’re bringing today!",
    "You're in a fantastic headspace—amazing!",
    "Your good mood is setting the tone!",
    "Feeling great looks good on you!",
  ],
  below: [
    "Your mood seems a bit low today — maybe something in our resources & shortcourses can help lift it.",
    "Not feeling your best? The resources & shortcourses has resources that might support you.",
    "It looks like today’s been tough — why not check out the resources & shortcourses for a boost?",
    "If your mood is off, exploring the resources & shortcourses could give you fresh energy.",
    "Having a rough day? The resources & shortcourses might have something to help you through.",
    "Your energy feels a little down — the resources & shortcourses could offer some inspiration.",
    "If today feels heavy, the resources & shortcourses is a great place to find light and ideas.",
    "Not the easiest day? See if the resources & shortcourses can give you some perspective.",
    "Your mood might improve with a quick visit to the resources & shortcourses.",
    "When you’re not feeling great, our resources & shortcourses could be just what you need.",
  ],
};
