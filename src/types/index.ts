export type TradeCategory =
  | 'Plumber'
  | 'Electrician'
  | 'Cleaner'
  | 'Painter'
  | 'Gardener'
  | 'Carpenter'
  | 'Locksmith'
  | 'Roofer';

export interface CategoryInfo {
  id: string;
  name: TradeCategory;
  iconName: string;
  description: string;
  avgHourlyRate: string;
  activeProsCount: number;
  popularTasks: string[];
  badge?: string;
}

export interface Professional {
  id?: string;
  _id?: string
  name: string;
  trade: TradeCategory;
  companyName: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  hourlyRate: number;
  location: string;
  postcodeArea: string;
  responseMinutes: number;
  verifiedStatus: {
    dbsChecked: boolean;
    gasSafe?: boolean;
    niceic?: boolean;
    insured: boolean;
    insuranceAmount: string;
  };
  bio: string;
  specialties: string[];
  availability: 'Available Today' | 'Available Tomorrow' | 'Booked 2 Days';
  portfolioImages: string[];
  badgeText?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  isVerified?: boolean;
  isEmergency?: boolean;
  workingHours?: Record<string, unknown>;
  certifications?: string[];
  insuranceInfo?: string;
  serviceAreas?: string[];
  yearsOfExperience?: number;
  reviews?: ITestimonial[];
}

export interface ServiceItem {
  id: string;
  title: string;
  trade: TradeCategory;
  estimatedPrice: string;
  timeEstimate: string;
  popularFor: string;
  description: string;
  included: string[];
  icon: string;
  image: string;
  isEmergency?: boolean;
}

export interface BeforeAfterPair {
  id: string;
  title: string;
  trade: TradeCategory;
  location: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  cost: string;
  completionDays: string;
}

export interface ITestimonial {
  id: string;
  author: string;
  role: string;
  city: string;
  trade: string;
  rating: number;
  date: string;
  comment: string;
  verifiedJob: string;
  avatar: string | null;
  source: string;
  sortOrder?: number;
  isApproved?: boolean;
  isFeatured?: boolean;
  moderationNote?: string | null;
  userId?: string | null;
  professionalId?: string | null;
  professional?: {
    id: string;
    name: string;
    companyName: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export type Testimonial = ITestimonial;

export interface ICreateTestimonialPayload {
  author: string;
  role: string;
  city: string;
  trade: string;
  rating: number;
  date: string;
  comment: string;
  verifiedJob: string;
  avatar?: string | null;
  source: string;
}

export interface BookingFormData {
  trade: TradeCategory | '';
  serviceId?: string;
  professionalId?: string;
  professionalName?: string;
  postcode: string;
  date: string;
  timeSlot: string;
  urgency: 'Standard' | 'Urgent (Same Day)' | 'Emergency 24/7 (45 Mins)';
  description: string;
  address: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface FAQItem {
  id: string;
  category: 'General' | 'Booking' | 'Pricing' | 'Pros & Vetting' | 'Emergency';
  question: string;
  answer: string;
}

export interface FeaturedService {
  id: string;
  tradeId: string;
  title: string;
  estimatedPrice?: string | null;
  timeEstimate?: string | null;
  popularFor: string[];
  description: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Trade {
  id: string;
  category: string;
  subtitle?: string | null;
  iconUrl?: string | null;
  description: string;
  avgHourlyRate: string;
  startingPrice?: string | null;
  activeProsCount: number;
  popularTasks: string[];
  badge?: string | null;
  featuredServices?: FeaturedService[];
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profession {
  id: string;
  tradeId: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  trade?: {
    id: string;
    category: string;
  };
}
