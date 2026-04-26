import building1 from "@/assets/building-1.png";
import building2 from "@/assets/building-2.png";
import building3 from "@/assets/building-3.png";
import building4 from "@/assets/building-4.png";
import building5 from "@/assets/building-5.png";
import building6 from "@/assets/building-6.png";
import apartment1 from "@/assets/apartment-1.png";
import apartment2 from "@/assets/apartment-2.png";
import plot1 from "@/assets/plot-1.png";
import interior1 from "@/assets/interior-1.jpg";
import interior2 from "@/assets/interior-2.jpg";
import interior3 from "@/assets/interior-3.jpg";
import { StaticImageData } from "next/image";

export type PropertyCategory =
  | "BUY" | "RENT" | "SELL" | "PLOTS" | "RESIDENTIAL" | "COMMERCIAL";

export type PropertyType = "BUILDING" | "APARTMENT" | "PLOT";

export type PropertyStatus = "AVAILABLE" | "SOLD" | "RESERVED";

export interface Address {
  id: string;
  label: string;
  city: string;
  street: string;
  state: string;
  zipCode: number;
  gmaps?: string;
  nearbyPlaces: { name: string; distance: string; type: string }[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  buildingImage: string; // 3D PNG used in the hover effect
  propertyType: PropertyType;
  images: string[];
  youtubeLink?: string;
  amenities: string[];
  features: string[];
  category: PropertyCategory;
  status: PropertyStatus;
  price: number; // QAR
  Area: number; // sqft
  BedRooms?: number;
  Bathrooms?: number;
  parking?: number;
  furnishing?: string;
  HoaFees?: number;
  yearBuilt?: number;
  address: Address;
}

const interiors = [interior1.src, interior2.src, interior3.src];

export const properties: Property[] = [
  {
    id: "p-001",
    title: "Pearl Marina Villa",
    propertyType: "BUILDING",
    description:
      "An architectural statement on the Pearl-Qatar waterfront. Triple-height living, infinity pool, and private mooring set the tone for a residence built around light, water and craft.",
    buildingImage: building1.src,
    images: interiors,
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    amenities: ["Infinity Pool", "Private Beach", "Smart Home", "Gym", "Sauna", "24/7 Security"],
    features: ["Sea View", "Private Lift", "Italian Marble", "Solar Panels", "EV Charger"],
    category: "BUY",
    status: "AVAILABLE",
    price: 12500000,
    Area: 8500,
    BedRooms: 6,
    Bathrooms: 7,
    parking: 4,
    furnishing: "Fully Furnished",
    HoaFees: 4200,
    yearBuilt: 2023,
    address: {
      id: "a-001",
      label: "Pearl-Qatar",
      city: "Doha",
      street: "Porto Arabia Drive",
      state: "Doha",
      zipCode: 1234,
      nearbyPlaces: [
        { name: "Lagoona Mall", distance: "1.2 km", type: "Shopping" },
        { name: "Qatar International School", distance: "2.4 km", type: "Education" },
        { name: "Hamad Hospital", distance: "5.1 km", type: "Healthcare" },
      ],
    },
  },
  {
    id: "p-002",
    title: "Lusail Skyline Apartment",
    propertyType: "APARTMENT",
    description:
      "A high-floor 3-bed apartment in Lusail's iconic Skyline Tower. Sky-lobbies, panoramic terraces and a private cinema serve a residence that lives in the clouds.",
    buildingImage: apartment2.src,
    images: interiors,
    amenities: ["Sky Pool", "Cinema", "Concierge", "Spa", "Co-working", "Helipad"],
    features: ["Skyline View", "Triple Glazing", "Private Elevator", "Smart Climate"],
    category: "RENT",
    status: "AVAILABLE",
    price: 28000,
    Area: 2100,
    BedRooms: 3,
    Bathrooms: 4,
    parking: 2,
    furnishing: "Furnished",
    HoaFees: 1800,
    yearBuilt: 2024,
    address: {
      id: "a-002",
      label: "Marina District",
      city: "Lusail",
      street: "Al Sa'ad Plaza",
      state: "Lusail",
      zipCode: 4567,
      nearbyPlaces: [
        { name: "Place Vendôme", distance: "0.8 km", type: "Shopping" },
        { name: "Lusail Stadium", distance: "3.5 km", type: "Sports" },
      ],
    },
  },
  {
    id: "p-003",
    title: "West Bay Commercial",
    propertyType: "BUILDING",
    description:
      "Grade-A office tower at the heart of Doha's business district. Configurable floor plates from 400 to 4,000 sqm.",
    buildingImage: building3.src,
    images: interiors,
    amenities: ["24/7 Access", "Conference Center", "Cafeteria", "Underground Parking"],
    features: ["Floor-to-ceiling Glass", "Raised Floor", "BMS", "LEED Gold"],
    category: "COMMERCIAL",
    status: "AVAILABLE",
    price: 45000000,
    Area: 24000,
    parking: 80,
    furnishing: "Shell & Core",
    yearBuilt: 2022,
    address: {
      id: "a-003",
      label: "West Bay",
      city: "Doha",
      street: "Al Corniche Street",
      state: "Doha",
      zipCode: 7890,
      nearbyPlaces: [
        { name: "City Center Mall", distance: "0.5 km", type: "Shopping" },
        { name: "Sheraton Park", distance: "1.0 km", type: "Park" },
      ],
    },
  },
  {
    id: "p-004",
    title: "Katara Beach Apartment",
    propertyType: "APARTMENT",
    description:
      "A spacious 4-bed apartment in a low-rise beachfront building minutes from Katara Cultural Village. Generous balconies, soft white interiors, and unbroken sea horizons.",
    buildingImage: apartment1.src,
    images: interiors,
    amenities: ["Private Beach", "Pool", "Kids Club", "Yoga Deck"],
    features: ["Beach Access", "Walk-in Closet", "Open Kitchen"],
    category: "RESIDENTIAL",
    status: "AVAILABLE",
    price: 4800000,
    Area: 2800,
    BedRooms: 4,
    Bathrooms: 4,
    parking: 2,
    furnishing: "Semi-Furnished",
    yearBuilt: 2023,
    address: {
      id: "a-004",
      label: "Katara",
      city: "Doha",
      street: "Katara Beach Road",
      state: "Doha",
      zipCode: 3344,
      nearbyPlaces: [
        { name: "Katara Cultural Village", distance: "0.3 km", type: "Culture" },
        { name: "Katara Towers", distance: "1.2 km", type: "Landmark" },
      ],
    },
  },
  {
    id: "p-005",
    title: "Al Daayen Land Plot",
    propertyType: "PLOT",
    description:
      "Prime 1,800 sqm freehold plot in the path of Lusail's expansion. Approved for residential G+2 development.",
    buildingImage: plot1.src,
    images: interiors,
    amenities: [],
    features: ["Freehold", "Corner Plot", "G+2 Permit", "Ready Utilities"],
    category: "PLOTS",
    status: "AVAILABLE",
    price: 2200000,
    Area: 19374,
    yearBuilt: undefined,
    address: {
      id: "a-005",
      label: "Al Daayen",
      city: "Al Daayen",
      street: "Sector 19",
      state: "Al Daayen",
      zipCode: 5566,
      nearbyPlaces: [
        { name: "Lusail Expressway", distance: "1.0 km", type: "Road" },
      ],
    },
  },
  {
    id: "p-006",
    title: "The Emerald Penthouse",
    propertyType: "APARTMENT",
    description:
      "Crowning a private tower in West Bay, the Emerald Penthouse is a single-floor residence wrapped in gold and emerald — a 360° view of Doha.",
    buildingImage: building6.src,
    images: interiors,
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    amenities: ["Private Pool", "Wine Cellar", "Home Theater", "Staff Quarters", "Gym"],
    features: ["360° View", "Smart Glass", "Imported Stone", "Triple Insulation"],
    category: "SELL",
    status: "RESERVED",
    price: 35000000,
    Area: 12000,
    BedRooms: 5,
    Bathrooms: 7,
    parking: 6,
    furnishing: "Designer Furnished",
    HoaFees: 8500,
    yearBuilt: 2024,
    address: {
      id: "a-006",
      label: "West Bay",
      city: "Doha",
      street: "Diplomatic Street",
      state: "Doha",
      zipCode: 7890,
      nearbyPlaces: [
        { name: "Museum of Islamic Art", distance: "3.2 km", type: "Culture" },
        { name: "Souq Waqif", distance: "4.0 km", type: "Heritage" },
      ],
    },
  },
];

export const formatQAR = (n: number) =>
  new Intl.NumberFormat("en-QA", { style: "currency", currency: "QAR", maximumFractionDigits: 0 }).format(n);
