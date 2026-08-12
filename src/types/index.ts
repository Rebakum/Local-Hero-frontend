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

export interface TradeService {
  id: string;
  title: string;
  estimatedPrice: string;
  timeEstimate: string;
  popularFor: string;
  description: string;
  included: string[];
  icon: string;
  image: string;
  isEmergency?: boolean;
}

export interface Trade {
  id: string;
  category: string;
  subtitle?: string;
  iconName: string;
  description: string;
  avgHourlyRate: string;
  startingPrice?: string;
  activeProsCount: number;
  popularTasks: string[];
  badge?: string;
  featuredService?: TradeService;
  rating?: number | string;
  reviewsCount?: number;
  features?: string[];
  isActive?: boolean;
  sortOrder?: number;
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
