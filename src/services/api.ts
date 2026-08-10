import type { Professional, Trade, BeforeAfterPair, Testimonial, FAQItem } from '../types';
import {
  FEATURED_PROS,
  FAQS,
} from '../data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PageMeta;
}

// Helper Function for Mock Data Pagination
function paginate<T>(items: T[], page?: number, limit?: number): { items: T[]; meta: PageMeta } {
  if (!page && !limit) {
    return { items, meta: { page: 1, limit: items.length || 50, total: items.length } };
  }
  const safePage = page ?? 1;
  const safeLimit = limit ?? 10;
  const start = (safePage - 1) * safeLimit;
  return {
    items: items.slice(start, start + safeLimit),
    meta: { page: safePage, limit: safeLimit, total: items.length },
  };
}

// Backend Express API Base URL (Safe Trailing Slash Handling)
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

// Helper to get Auth Headers for Admin/Super Admin endpoints
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ==========================================
// 1. TRADES API (Connected to Express API)
// ==========================================

export async function getTrades(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<{ trades: Trade[]; meta?: PageMeta }> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);

    const res = await fetch(`${API_BASE_URL}/trades?${queryParams.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch trades");

    const result: ApiResponse<Trade[]> = await res.json();

    return {
      trades: result.data || [],
      meta: result.meta,
    };
  } catch (error) {
    console.error("Error fetching trades:", error);
    return { trades: [], meta: undefined };
  }
}

export async function getTradeById(id: string): Promise<Trade> {
  const res = await fetch(`${API_BASE_URL}/trades/${id}`);

  if (!res.ok) throw new Error(`Trade ${id} not found`);

  const result: ApiResponse<Trade> = await res.json();
  return result.data;
}

export async function getAllTrades(): Promise<Trade[]> {
  const result = await getTrades({ limit: 100 });
  return result.trades;
}


// ==========================================
// 2. PROFESSIONALS API (Mock Data Fallback)
// ==========================================

export async function getProfessionals(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  featured?: boolean;
  search?: string;
}): Promise<{ professionals: Professional[]; meta?: PageMeta }> {
  await delay(100);
  let filtered = FEATURED_PROS;

  if (params?.trade) {
    const tradeQuery = params.trade.toLowerCase();
    filtered = filtered.filter((pro) => pro.trade.toLowerCase() === tradeQuery);
  }

  if (params?.featured) {
    filtered = filtered.filter(() => true);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((pro) =>
      [pro.name, pro.trade, pro.companyName, pro.location, pro.postcodeArea, ...(pro.specialties || [])]
        .some((value) => (value || '').toLowerCase().includes(q)),
    );
  }

  const { items, meta } = paginate(filtered, params?.page, params?.limit);
  return { professionals: items, meta };
}

export async function getProfessionalById(id: string): Promise<Professional> {
  await delay(100);
  const pro = FEATURED_PROS.find((p) => p.id === id);
  if (!pro) throw new Error(`Professional ${id} not found`);
  return pro;
}

export async function getFeaturedProfessionals(): Promise<Professional[]> {
  const result = await getProfessionals({ featured: true, limit: 10 });
  return result.professionals;
}


// ==========================================
// 3. BEFORE / AFTER PROJECTS API (Connected to Express API)
// ==========================================

export async function getBeforeAfterProjects(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  search?: string;
}): Promise<{ projects: BeforeAfterPair[]; meta?: PageMeta }> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }
    if (params?.trade && params.trade.trim() !== "") {
      queryParams.append("trade", params.trade.trim());
    }

    const res = await fetch(`${API_BASE_URL}/before-after?${queryParams.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch before/after projects");

    const result: ApiResponse<BeforeAfterPair[]> = await res.json();

    return {
      projects: result.data || [],
      meta: result.meta,
    };
  } catch (error) {
    console.error("Error fetching before/after projects:", error);
    return { projects: [], meta: undefined };
  }
}

export async function getBeforeAfterProjectById(id: string): Promise<BeforeAfterPair> {
  const res = await fetch(`${API_BASE_URL}/before-after/${id}`);

  if (!res.ok) throw new Error(`Before/After project ${id} not found`);

  const result: ApiResponse<BeforeAfterPair> = await res.json();
  return result.data;
}

export async function getAllBeforeAfterProjects(): Promise<BeforeAfterPair[]> {
  const result = await getBeforeAfterProjects({ limit: 50 });
  return result.projects;
}

// Admin Operations (POST, PATCH, DELETE)
export async function createBeforeAfterProject(payload: Partial<BeforeAfterPair>): Promise<BeforeAfterPair> {
  const res = await fetch(`${API_BASE_URL}/before-after`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create project");
  }

  const result: ApiResponse<BeforeAfterPair> = await res.json();
  return result.data;
}

export async function updateBeforeAfterProject(id: string, payload: Partial<BeforeAfterPair>): Promise<BeforeAfterPair> {
  const res = await fetch(`${API_BASE_URL}/before-after/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update project");
  }

  const result: ApiResponse<BeforeAfterPair> = await res.json();
  return result.data;
}

export async function deleteBeforeAfterProject(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/before-after/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete project");
  }

  return true;
}


// ==========================================
// 4. TESTIMONIALS API (Connected to Express API)
// ==========================================

export async function getTestimonials(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  search?: string;
}): Promise<{ testimonials: Testimonial[]; meta?: PageMeta }> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }
    if (params?.trade && params.trade.trim() !== "") {
      queryParams.append("trade", params.trade.trim());
    }

    const res = await fetch(`${API_BASE_URL}/testimonials?${queryParams.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch testimonials");

    const result: ApiResponse<Testimonial[]> = await res.json();

    return {
      testimonials: result.data || [],
      meta: result.meta,
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { testimonials: [], meta: undefined };
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial> {
  const res = await fetch(`${API_BASE_URL}/testimonials/${id}`);

  if (!res.ok) throw new Error(`Testimonial ${id} not found`);

  const result: ApiResponse<Testimonial> = await res.json();
  return result.data;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const result = await getTestimonials({ limit: 50 });
  return result.testimonials;
}

// Admin Operations (POST, PATCH, DELETE)
export async function createTestimonialApi(payload: Partial<Testimonial>): Promise<Testimonial> {
  const res = await fetch(`${API_BASE_URL}/testimonials`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create testimonial");
  }

  const result: ApiResponse<Testimonial> = await res.json();
  return result.data;
}

export async function updateTestimonialApi(id: string, payload: Partial<Testimonial>): Promise<Testimonial> {
  const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update testimonial");
  }

  const result: ApiResponse<Testimonial> = await res.json();
  return result.data;
}

export async function deleteTestimonialApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete testimonial");
  }

  return true;
}


// ==========================================
// 5. FAQS API (Mock Data)
// ==========================================

export async function getFAQs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<{ faqs: FAQItem[]; meta?: PageMeta }> {
  await delay(100);
  let filtered = FAQS;

  if (params?.category) {
    const categoryQuery = params.category.toLowerCase();
    filtered = filtered.filter((faq) => faq.category.toLowerCase() === categoryQuery);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((faq) =>
      [faq.question, faq.answer, faq.category].some((value) => (value || '').toLowerCase().includes(q)),
    );
  }

  const { items, meta } = paginate(filtered, params?.page, params?.limit);
  return { faqs: items, meta };
}

export async function getFAQById(id: string): Promise<FAQItem> {
  await delay(100);
  const faq = FAQS.find((f) => f.id === id);
  if (!faq) throw new Error(`FAQ ${id} not found`);
  return faq;
}

export async function getAllFAQs(): Promise<FAQItem[]> {
  const result = await getFAQs({ limit: 50 });
  return result.faqs;
}