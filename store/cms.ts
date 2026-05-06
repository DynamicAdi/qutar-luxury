import { create } from "zustand";
import { persist } from "zustand/middleware";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import { PropertyUsageType } from "@/generated/prisma/enums";

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
  | "PLOTS";
export type PropertyStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "IN_PROGRESS";
export type PropertyType = "BUILDING" | "APARTMENT" | "PLOT";
export type TargetType = "PROJECT" | "PROPERTY" | "BOTH";

export interface Property {
  id: string;

  title: string;
  featured: boolean;

  category: PropertyCategory;
  propertyType: PropertyType;
  targetType: TargetType;

  price: number;
  currency: string;

  pngImage?: string | null;
  youtubeLink?: string | null;

  description: string;

  // Location
  address?: AddressEntry | null;
  city: string;
  state: string;
  lat?: number | null;
  lng?: number | null;

  // Core specs
  BedRooms: number;
  Bathrooms: number;
  Area: number; // sqft
  yearBuilt: number;

  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  parking: number;

  // Plot-specific
  plotArea?: number | null;
  zoning?:
    | "Residential"
    | "Commercial"
    | "Mixed-Use"
    | "Industrial"
    | "Agricultural"
    | null;

  roadAccess?:
    | "Paved"
    | "Unpaved"
    | "Highway-adjacent"
    | "None"
    | null;

  utilitiesReady?: boolean | null;
  cornerPlot?: boolean | null;

  usageType: PropertyUsageType;

  // Rent-specific
  rentPeriod?: "Monthly" | "Yearly" | null;
  minLeaseMonths?: number | null;
  depositMonths?: number | null;
  availableFrom?: string | null;

  // Media
  images: string[];
  floorPlanUrl?: string | null;
  videoTourUrl?: string | null;
  virtualTourUrl?: string | null;

  // Extras
  amenities: string[];
  features: string[];

  NearByLocations: {
    name: string;
    type: string;
  }[];

  // Agents
  agent: AgentEntry[];
  agentIds?: string[] | null;

  // Address relation
  addressId?: string | null;

  // Documents
  documents: {
    name: string;
    url: string;
  }[];

  isHidden: boolean;
  status: PropertyStatus;

  hoaFee?: number | null;

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

  propertyId?: string | null;

  budget: LeadBudget;
  status: status;

  message?: string | null;

  createdAt: string;

  property?: Property;
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


export interface Response {
  success: boolean;
  data: Lead;
  errors?: string[];
}

export type TaskStatus = "PENDING" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface LeadTask {
  id: string;
  leadId: string;

  title: string;

  dueDate?: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}