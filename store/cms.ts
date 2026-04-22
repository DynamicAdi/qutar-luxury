import { create } from "zustand";
import { persist } from "zustand/middleware";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";

export type PropertyCategory = "Buy" | "Sell" | "Rent" | "Plots" | "Residential";
export type PropertyStatus = "Available" | "Sold" | "Reserved";

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // sqft
  yearBuilt: number;
  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  parking: number;
  // Plot-specific (optional)
  plotArea?: number; // sqm
  zoning?: "Residential" | "Commercial" | "Mixed-Use" | "Industrial" | "Agricultural";
  roadAccess?: "Paved" | "Unpaved" | "Highway-adjacent" | "None";
  utilitiesReady?: boolean;
  cornerPlot?: boolean;
  // Rent-specific (optional)
  rentPeriod?: "Monthly" | "Yearly";
  minLeaseMonths?: number;
  depositMonths?: number;
  availableFrom?: string;
  images: string[];
  floorPlanUrl?: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  amenities: string[];
  features: string[];
  nearby: { name: string; type: string; distanceKm: number }[];
  agent: { name: string; phone: string; email: string; avatar?: string };
  agentId?: string; // legacy single-agent (kept for back-compat)
  agentIds?: string[]; // multi-agent assignment
  addressId?: string;
  documents: { name: string; url: string }[];
  hidden: boolean;
  status: PropertyStatus;
  hoaFee?: number;
  createdAt: string;
}

export type LeadBudget = "Under 1M" | "1M – 5M" | "5M – 10M" | "10M+" | "Rental";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  budget: LeadBudget;
  status: "New" | "Contacted" | "Qualified" | "Lost" | "Converted";
  message: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  joinedAt: string;
  propertyIds: string[];
}

export interface AddressEntry {
  id: string;
  label: string; // short name e.g. "Pearl Marina, Doha"
  street: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  gmaps: string;
  zipCode?: number;
  _count?: {properties: number}
  createdAt: string;
  properties: Property[]
}

export interface AgentEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  bio?: string;
  _count?: {properties: number}
  properties: Property[]
  addedAt: string;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  aboutTitle: string;
  aboutBody: string;
  featuredPropertyIds: string[];
  contactEmail: string;
  contactPhone: string;
}

interface CMSState {
  properties: Property[];
  leads: Lead[];
  customers: Customer[];
  addresses: AddressEntry[];
  agents: AgentEntry[];
  home: HomeContent;
  upsertProperty: (p: Property) => void;
  deleteProperty: (id: string) => void;
  toggleHidden: (id: string) => void;
  addLead: (l: Lead) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  linkProperty: (customerId: string, propertyId: string) => void;
  unlinkProperty: (customerId: string, propertyId: string) => void;
  addAddress: (a: AddressEntry) => void;
  updateAddress: (id: string, patch: Partial<AddressEntry>) => void;
  deleteAddress: (id: string) => void;
  addAgent: (a: AgentEntry) => void;
  updateAgent: (id: string, patch: Partial<AgentEntry>) => void;
  deleteAgent: (id: string) => void;
  updateHome: (patch: Partial<HomeContent>) => void;
}

const seedProperties: Property[] = [
  {
    id: "p1",
    title: "Pearl Marina Signature Villa",
    category: "Residential",
    price: 18500000,
    currency: "QAR",
    address: "Porto Arabia, The Pearl",
    city: "Doha",
    state: "Qatar",
    lat: 25.36,
    lng: 51.55,
    description:
      "An architectural masterpiece on The Pearl with private infinity pool, 12-meter ceilings, imported Italian marble and panoramic marina views. Designed by Atelier Lumière, this signature residence redefines luxury living in Qatar.",
    bedrooms: 6,
    bathrooms: 8,
    area: 9800,
    yearBuilt: 2023,
    furnishing: "Furnished",
    parking: 4,
    images: [p1.src, p2.src, p3.src],
    floorPlanUrl: "",
    videoTourUrl: "",
    virtualTourUrl: "",
    amenities: ["Private Pool", "Smart Home", "Home Cinema", "Wine Cellar", "Gym", "Sauna", "Maid Quarters", "Driver Quarters"],
    features: ["Sea View", "Marina Access", "Private Elevator", "Smart Lighting", "Italian Marble", "Solar Roof"],
    nearby: [
      { name: "Lagoona Mall", type: "Mall", distanceKm: 1.2 },
      { name: "Qatar Academy", type: "School", distanceKm: 3.4 },
      { name: "Hamad Hospital", type: "Hospital", distanceKm: 5.8 },
    ],
    agent: { name: "Layla Al-Mansoori", phone: "+974 5500 1122", email: "layla@qlp.qa" },
    documents: [{ name: "Title Deed.pdf", url: "#" }, { name: "Floor Plan.pdf", url: "#" }],
    hidden: false,
    status: "Available",
    hoaFee: 4200,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "West Bay Sky Penthouse",
    category: "Buy",
    price: 9200000,
    currency: "QAR",
    address: "West Bay Tower 42",
    city: "Doha",
    state: "Qatar",
    description: "Full-floor penthouse with 360° city skyline. Private rooftop terrace and infinity jacuzzi.",
    bedrooms: 4, bathrooms: 5, area: 5400, yearBuilt: 2022, furnishing: "Furnished", parking: 3,
    images: [p2.src, p1.src], amenities: ["Concierge", "Rooftop Pool", "Gym", "Spa"],
    features: ["Skyline View", "Private Lift", "Smart Home"],
    nearby: [{ name: "City Center Doha", type: "Mall", distanceKm: 0.8 }],
    agent: { name: "Omar Faisal", phone: "+974 5500 3344", email: "omar@qlp.qa" },
    documents: [], hidden: false, status: "Available", createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    title: "Lusail Beachfront Estate",
    category: "Sell",
    price: 27500000, currency: "QAR",
    address: "Marina District, Lusail", city: "Lusail", state: "Qatar",
    description: "Private beachfront with 80m of pristine coastline.",
    bedrooms: 7, bathrooms: 9, area: 14200, yearBuilt: 2024, furnishing: "Semi-Furnished", parking: 6,
    images: [p3.src, p1.src], amenities: ["Private Beach", "Boat Dock", "Helipad", "Pool", "Gym"],
    features: ["Beachfront", "Helipad", "Boat Access"],
    nearby: [{ name: "Lusail Marina", type: "Landmark", distanceKm: 0.4 }],
    agent: { name: "Layla Al-Mansoori", phone: "+974 5500 1122", email: "layla@qlp.qa" },
    documents: [], hidden: false, status: "Available", createdAt: new Date().toISOString(),
  },
  {
    id: "p4",
    title: "Al Khor Premium Plot",
    category: "Plots", price: 4800000, currency: "QAR",
    address: "Al Khor North Sector", city: "Al Khor", state: "Qatar",
    description: "Premium 2,500 sqm development plot zoned residential.",
    bedrooms: 0, bathrooms: 0, area: 26900, yearBuilt: 0, furnishing: "Unfurnished", parking: 0,
    images: [p4.src], amenities: [], features: ["Corner Plot", "Road Access", "Utilities Ready"],
    nearby: [], agent: { name: "Omar Faisal", phone: "+974 5500 3344", email: "omar@qlp.qa" },
    documents: [], hidden: false, status: "Sold", createdAt: new Date().toISOString(),
  },
  {
    id: "p5",
    title: "Msheireb Townhouse Collection",
    category: "Rent", price: 42000, currency: "QAR",
    address: "Msheireb Downtown", city: "Doha", state: "Qatar",
    description: "Heritage-inspired luxury townhouse in the heart of Doha.",
    bedrooms: 4, bathrooms: 4, area: 4200, yearBuilt: 2021, furnishing: "Furnished", parking: 2,
    images: [p5.src, p2.src], amenities: ["Pool", "Gym", "Concierge", "Kids Area"],
    features: ["Heritage Design", "Smart Home", "Private Garden"],
    nearby: [{ name: "Souq Waqif", type: "Landmark", distanceKm: 0.6 }],
    agent: { name: "Sara Al-Thani", phone: "+974 5500 5566", email: "sara@qlp.qa" },
    documents: [], hidden: false, status: "Available", createdAt: new Date().toISOString(),
  },
];

const seedLeads: Lead[] = [
  { id: "l1", name: "Mohammed Al-Kuwari", email: "mk@example.com", phone: "+974 6611 0011", propertyId: "p1", budget: "10M+", status: "Qualified", message: "Interested in scheduling a viewing this weekend.", createdAt: new Date().toISOString() },
  { id: "l2", name: "Sophia Laurent", email: "sophia@example.com", phone: "+974 6611 0022", propertyId: "p2", budget: "5M – 10M", status: "New", message: "Looking for penthouse with marina view.", createdAt: new Date().toISOString() },
  { id: "l3", name: "Yusuf Rahman", email: "yusuf@example.com", phone: "+974 6611 0033", propertyId: "p5", budget: "Rental", status: "Contacted", message: "Need rental for 12 months, family of 5.", createdAt: new Date().toISOString() },
  { id: "l4", name: "Aisha Al-Sulaiti", email: "aisha@example.com", phone: "+974 6611 0044", budget: "10M+", status: "New", message: "Want a private beach villa.", createdAt: new Date().toISOString() },
];

const seedCustomers: Customer[] = [
  { id: "c1", name: "Khalid Al-Mannai", email: "khalid@example.com", phone: "+974 7700 1111", nationality: "Qatari", joinedAt: new Date().toISOString(), propertyIds: ["p4"] },
];

const seedHome: HomeContent = {
  heroTitle: "Where Qatar's Finest Addresses Find Their Owners",
  heroSubtitle: "Curated luxury residences, penthouses and estates by Qutar Luxury Properties.",
  heroCtaText: "Explore Collection",
  aboutTitle: "The Standard of Luxury in Qatar",
  aboutBody: "For over a decade, QLP has connected discerning clients with the most exceptional properties across Doha, Lusail and The Pearl.",
  featuredPropertyIds: ["p1", "p3", "p2"],
  contactEmail: "concierge@qlp.qa",
  contactPhone: "+974 4000 0000",
};

// Auto-extract addresses & agents from seed properties
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const extractedAddresses: AddressEntry[] = [];
const extractedAgents: AgentEntry[] = [];



export const useCMS = create<CMSState>()(
  persist(
    (set) => ({
      properties: seedProperties,
      leads: seedLeads,
      customers: seedCustomers,
      addresses: extractedAddresses,
      agents: extractedAgents,
      home: seedHome,
      upsertProperty: (p) =>
        set((s) => {
          const exists = s.properties.find((x) => x.id === p.id);
          return { properties: exists ? s.properties.map((x) => (x.id === p.id ? p : x)) : [p, ...s.properties] };
        }),
      deleteProperty: (id) => set((s) => ({ properties: s.properties.filter((p) => p.id !== id) })),
      toggleHidden: (id) =>
        set((s) => ({ properties: s.properties.map((p) => (p.id === id ? { ...p, hidden: !p.hidden } : p)) })),
      addLead: (l) => set((s) => ({ leads: [l, ...s.leads] })),
      updateLead: (id, patch) => set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      addCustomer: (c) => set((s) => ({ customers: [c, ...s.customers] })),
      deleteCustomer: (id) => set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),
      linkProperty: (customerId, propertyId) =>
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === customerId ? { ...c, propertyIds: Array.from(new Set([...c.propertyIds, propertyId])) } : c
          ),
          properties: s.properties.map((p) => (p.id === propertyId ? { ...p, status: "Sold" as PropertyStatus } : p)),
        })),
      unlinkProperty: (customerId, propertyId) =>
        set((s) => {
          const customers = s.customers.map((c) =>
            c.id === customerId ? { ...c, propertyIds: c.propertyIds.filter((id) => id !== propertyId) } : c
          );
          const stillOwned = customers.some((c) => c.propertyIds.includes(propertyId));
          return {
            customers,
            properties: s.properties.map((p) =>
              p.id === propertyId && !stillOwned ? { ...p, status: "Available" as PropertyStatus } : p
            ),
          };
        }),
      addAddress: (a) => set((s) => ({ addresses: [a, ...s.addresses] })),
      updateAddress: (id, patch) =>
        set((s) => ({ addresses: s.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      deleteAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      addAgent: (a) => set((s) => ({ agents: [a, ...s.agents] })),
      updateAgent: (id, patch) =>
        set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      deleteAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
      updateHome: (patch) => set((s) => ({ home: { ...s.home, ...patch } })),
    }),
    { name: "qlp-cms-v3" }
  )
);

export const formatPrice = (n: number, c = "QAR") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

