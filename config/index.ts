export const SITE_NAME = "QLP";

export const NAV_ITEMS = [
  { label: "Properties", href: "/properties" },
  { label: "Join Us", href: "/join" },
  { label: "About Us", href: "/about-us" },
  
  {
    label: "Resources",
    dropdown: [
      { label: "Helpful Partnerships", href: "/helpful-partnerships" },
      { label: "Commercial", href: "/commercial" },
      { label: "Operating Procedure", href: "/operating-procedure" },
      { label: "Rent vs Buy Calculator", href: "/calculator" },
    ],
  },
  { label: "Insights", href: "/join" },
];


export const qatarStates = [
  "Doha",
  "Al Rayyan",
  "Al Wakrah",
  "Al Khor and Al Thakhira",
  "Umm Salal",
  "Madinat ash Shamal",
  "Al Daayen",
  "Al Shahaniya"
];

export const qatarCitiesByState: Record<string, string[]> = {
  Doha: [
    "Doha",
    "West Bay",
    "The Pearl",
    "Lusail",
    "Msheireb",
    "Al Sadd",
    "Al Waab",
    "Madinat Khalifa",
    "Najma",
    "Al Mansoura",
    "Bin Mahmoud",
    "Old Airport",
    "Abu Hamour",
    "Al Dafna",
    "Umm Ghuwailina",
    "Al Muntazah",
    "New Salata"
  ],

  "Al Rayyan": [
    "Al Rayyan",
    "Muaither",
    "Ain Khaled",
    "Abu Nakhla",
    "Rawdat Rashid",
    "Al Wajbah",
    "Mebaireek",
    "Luaib",
    "Al Aziziya",
    "Al Sailiya",
    "Education City"
  ],

  "Al Wakrah": [
    "Al Wakrah",
    "Al Wukair",
    "Mesaieed",
    "Al Mashaf",
    "Umm Al Houl",
    "Birkat Al Awamer",
    "Ezdan",
    "Al Karaana"
  ],

  "Al Khor and Al Thakhira": [
    "Al Khor",
    "Al Thakhira",
    "Ras Laffan",
    "Simaisma"
  ],

  "Umm Salal": [
    "Umm Salal Muhammad",
    "Umm Salal Ali",
    "Izghawa",
    "Al Kharaitiyat"
  ],

  "Madinat ash Shamal": [
    "Madinat ash Shamal",
    "Ar Ru'ays",
    "Abu Dhalouf",
    "Al Ghariya",
    "Fuwayrit",
    "Ain Sinan"
  ],

  "Al Daayen": [
    "Lusail",
    "Al Kheesa",
    "Umm Qarn",
    "Wadi Al Banat",
    "Jeryan Nejaima",
    "Leabaib",
    "Al Egla"
  ],

  "Al Shahaniya": [
    "Al Shahaniya",
    "Dukhan",
    "Al Jemailiya",
    "Mukaynis",
    "Umm Bab"
  ]
};

export const qatarCities = [
  "Doha",
  "West Bay",
  "The Pearl",
  "Lusail",
  "Msheireb",
  "Al Sadd",
  "Al Waab",
  "Madinat Khalifa",
  "Najma",
  "Al Mansoura",
  "Bin Mahmoud",
  "Old Airport",
  "Abu Hamour",
  "Al Dafna",
  "Umm Ghuwailina",
  "Al Muntazah",
  "New Salata",

  "Al Rayyan",
  "Muaither",
  "Ain Khaled",
  "Abu Nakhla",
  "Rawdat Rashid",
  "Al Wajbah",
  "Mebaireek",
  "Luaib",
  "Al Aziziya",
  "Al Sailiya",
  "Education City",

  "Al Wakrah",
  "Al Wukair",
  "Mesaieed",
  "Al Mashaf",
  "Umm Al Houl",
  "Birkat Al Awamer",
  "Ezdan",
  "Al Karaana",

  "Al Khor",
  "Al Thakhira",
  "Ras Laffan",
  "Simaisma",

  "Umm Salal Muhammad",
  "Umm Salal Ali",
  "Izghawa",
  "Al Kharaitiyat",

  "Madinat ash Shamal",
  "Ar Ru'ays",
  "Abu Dhalouf",
  "Al Ghariya",
  "Fuwayrit",
  "Ain Sinan",

  "Al Kheesa",
  "Umm Qarn",
  "Wadi Al Banat",
  "Jeryan Nejaima",
  "Leabaib",
  "Al Egla",

  "Al Shahaniya",
  "Dukhan",
  "Al Jemailiya",
  "Mukaynis",
  "Umm Bab"
];