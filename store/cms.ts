import { create } from "zustand";
import { persist } from "zustand/middleware";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";

export enum CUSTOMER_STATUS {
  PURCHASED = "PURCHASED",
  INTERESTED = "INTERESTED",
  BOOKED = "BOOKED",
  INPROGRESS = "INPROGRESS",
  LOST = "LOST",
  PAID_HALF = "PAID_HALF",
}

export type PropertyCategory =
  | "BUY"
  | "SELL"
  | "RENT"
  | "PLOTS"
  | "RESIDENTIAL";
export type PropertyStatus = "AVAILABLE" | "SOLD" | "RESERVED";
export type PropertyType = "BUILDING" | "APARTMENT" | "PLOT";

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  propertyType: PropertyType;
  price: number;
  currency: string;
  pngImage?: string;
  youtubeLink?: string;
  address?: AddressEntry;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  description: string;
  BedRooms: number;
  Bathrooms: number;
  Area: number; // sqft
  yearBuilt: number;
  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  parking: number;
  // Plot-specific (optional)
  plotArea?: number; // sqm
  zoning?:
    | "Residential"
    | "Commercial"
    | "Mixed-Use"
    | "Industrial"
    | "Agricultural";
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
  NearByLocations: { name: string; type: string }[];
  agent: AgentEntry[];
  agentIds?: string[]; // multi-agent assignment
  addressId?: string;
  documents: { name: string; url: string }[];
  isHidden: boolean;
  status: PropertyStatus;
  hoaFee?: number;
  createdAt: string;
}

export type LeadBudget =
  | "Under 1M"
  | "1M – 5M"
  | "5M – 10M"
  | "10M+"
  | "Rental";
export type status = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  budget: LeadBudget;
  status: status;
  message: string;
  createdAt: string;
  property: { title: string; id: string, price: string };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  createdAt: string;
  propertyIds: string[];
  properties: Property[];
  joinedAt: any;
  dealAmount?: number;
  paymentMethod?: string;
  closingDate?: string;
  note?: string;
  status: CUSTOMER_STATUS;
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
  _count?: { properties: number };
  createdAt: string;
  properties: Property[];
}

export interface AgentEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  bio?: string;
  _count?: { properties: number };
  properties: Property[];
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


export const formatPrice = (n: number, c = "QAR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);
