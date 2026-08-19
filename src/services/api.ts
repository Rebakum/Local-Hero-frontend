import type {
  Professional,
  Trade,
  BeforeAfterPair,
  Testimonial,
  FAQItem,
} from "../types";

import { FAQS } from "../data/mockData";

/* =========================================================
   TYPES
========================================================= */

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: PageMeta;
}

/* =========================================================
   API CONFIG
========================================================= */

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

/* =========================================================
   COMMON HELPERS
========================================================= */

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = (): HeadersInit => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

/* =========================================================
   RESPONSE PARSER
========================================================= */

const parseResponse = async <T>(
  response: Response,
): Promise<ApiResponse<T>> => {
  const result: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const errorData = result as
      | {
          message?: string;
          error?: string;
        }
      | null;

    throw new Error(
      errorData?.message ||
        errorData?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return result as ApiResponse<T>;
};

/* =========================================================
   PAGINATION
========================================================= */

function paginate<T>(
  items: T[],
  page?: number,
  limit?: number,
): {
  items: T[];
  meta: PageMeta;
} {
  if (!page && !limit) {
    return {
      items,
      meta: {
        page: 1,
        limit: items.length || 50,
        total: items.length,
      },
    };
  }

  const safePage = page ?? 1;
  const safeLimit = limit ?? 10;

  const start = (safePage - 1) * safeLimit;

  return {
    items: items.slice(start, start + safeLimit),
    meta: {
      page: safePage,
      limit: safeLimit,
      total: items.length,
    },
  };
}

/* =========================================================
   1. TRADES
========================================================= */

export async function getTrades(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
}): Promise<{
  trades: Trade[];
  meta?: PageMeta;
}> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.set("page", String(params.page));
    }

    if (params?.limit) {
      queryParams.set("limit", String(params.limit));
    }

    if (params?.search?.trim()) {
      queryParams.set(
        "search",
        params.search.trim(),
      );
    }

    if (params?.category?.trim()) {
      queryParams.set(
        "category",
        params.category.trim(),
      );
    }

    if (params?.sortBy) {
      queryParams.set("sortBy", params.sortBy);
    }

    const query = queryParams.toString();

    const response = await fetch(
      `${API_BASE_URL}/trades${
        query ? `?${query}` : ""
      }`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      },
    );

    const result =
      await parseResponse<Trade[]>(response);

    return {
      trades: result.data ?? [],
      meta: result.meta,
    };
  } catch (error) {
    console.error(
      "Error fetching trades:",
      error,
    );

    return {
      trades: [],
      meta: undefined,
    };
  }
}

export async function getTradeById(
  id: string,
): Promise<Trade> {
  const response = await fetch(
    `${API_BASE_URL}/trades/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );

  const result =
    await parseResponse<Trade>(response);

  return result.data;
}

export async function getAllTrades(): Promise<
  Trade[]
> {
  const result = await getTrades({
    page: 1,
    limit: 100,
  });

  return result.trades;
}

/* =========================================================
   2. PROFESSIONALS
   Backed by the real /professionals API. No mock fallback data —
   an empty database returns an empty list.
========================================================= */

export async function getProfessionals(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  featured?: boolean;
  search?: string;
}): Promise<{
  professionals: Professional[];
  meta?: PageMeta;
}> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.trade?.trim()) queryParams.set("trade", params.trade.trim());
  if (params?.featured) queryParams.set("featured", "true");
  if (params?.search?.trim()) queryParams.set("search", params.search.trim());

  const query = queryParams.toString();

  const response = await fetch(
    `${API_BASE_URL}/professionals${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );

  const result = await parseResponse<Professional[]>(response);

  return {
    professionals: result.data ?? [],
    meta: result.meta,
  };
}

export async function getProfessionalById(id: string): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const result = await parseResponse<Professional>(response);

  return result.data;
}

export async function getFeaturedProfessionals(): Promise<Professional[]> {
  const result = await getProfessionals({
    featured: true,
    page: 1,
    limit: 10,
  });

  return result.professionals;
}

/* =========================================================
   3. BEFORE / AFTER
========================================================= */

export async function getBeforeAfterProjects(
  params?: {
    page?: number;
    limit?: number;
    trade?: string;
    search?: string;
  },
): Promise<{
  projects: BeforeAfterPair[];
  meta?: PageMeta;
}> {
  try {
    const queryParams =
      new URLSearchParams();

    if (params?.page) {
      queryParams.set(
        "page",
        String(params.page),
      );
    }

    if (params?.limit) {
      queryParams.set(
        "limit",
        String(params.limit),
      );
    }

    if (params?.search?.trim()) {
      queryParams.set(
        "search",
        params.search.trim(),
      );
    }

    if (params?.trade?.trim()) {
      queryParams.set(
        "trade",
        params.trade.trim(),
      );
    }

    const query = queryParams.toString();

    const response = await fetch(
      `${API_BASE_URL}/before-after${
        query ? `?${query}` : ""
      }`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      },
    );

    const result =
      await parseResponse<
        BeforeAfterPair[]
      >(response);

    return {
      projects: result.data ?? [],
      meta: result.meta,
    };
  } catch (error) {
    console.error(
      "Error fetching before/after projects:",
      error,
    );

    return {
      projects: [],
      meta: undefined,
    };
  }
}

export async function getBeforeAfterProjectById(
  id: string,
): Promise<BeforeAfterPair> {
  const response = await fetch(
    `${API_BASE_URL}/before-after/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );

  const result =
    await parseResponse<BeforeAfterPair>(
      response,
    );

  return result.data;
}

export async function getAllBeforeAfterProjects(): Promise<
  BeforeAfterPair[]
> {
  const result =
    await getBeforeAfterProjects({
      page: 1,
      limit: 50,
    });

  return result.projects;
}

export async function createBeforeAfterProject(
  payload: Partial<BeforeAfterPair>,
): Promise<BeforeAfterPair> {
  const response = await fetch(
    `${API_BASE_URL}/before-after`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const result =
    await parseResponse<BeforeAfterPair>(
      response,
    );

  return result.data;
}

export async function updateBeforeAfterProject(
  id: string,
  payload: Partial<BeforeAfterPair>,
): Promise<BeforeAfterPair> {
  const response = await fetch(
    `${API_BASE_URL}/before-after/${id}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const result =
    await parseResponse<BeforeAfterPair>(
      response,
    );

  return result.data;
}

export async function deleteBeforeAfterProject(
  id: string,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/before-after/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );

  await parseResponse<unknown>(response);

  return true;
}

/* =========================================================
   4. TESTIMONIALS
========================================================= */

export async function getTestimonials(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  search?: string;
}): Promise<{
  testimonials: Testimonial[];
  meta?: PageMeta;
}> {
  try {
    const queryParams =
      new URLSearchParams();

    if (params?.page) {
      queryParams.set(
        "page",
        String(params.page),
      );
    }

    if (params?.limit) {
      queryParams.set(
        "limit",
        String(params.limit),
      );
    }

    if (params?.search?.trim()) {
      queryParams.set(
        "search",
        params.search.trim(),
      );
    }

    if (params?.trade?.trim()) {
      queryParams.set(
        "trade",
        params.trade.trim(),
      );
    }

    const query = queryParams.toString();

    const response = await fetch(
      `${API_BASE_URL}/testimonials${
        query ? `?${query}` : ""
      }`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      },
    );

    const result =
      await parseResponse<Testimonial[]>(
        response,
      );

    return {
      testimonials: result.data ?? [],
      meta: result.meta,
    };
  } catch (error) {
    console.error(
      "Error fetching testimonials:",
      error,
    );

    return {
      testimonials: [],
      meta: undefined,
    };
  }
}

export async function getTestimonialById(
  id: string,
): Promise<Testimonial> {
  const response = await fetch(
    `${API_BASE_URL}/testimonials/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );

  const result =
    await parseResponse<Testimonial>(
      response,
    );

  return result.data;
}

export async function getAllTestimonials(): Promise<
  Testimonial[]
> {
  const result = await getTestimonials({
    page: 1,
    limit: 50,
  });

  return result.testimonials;
}

export async function createTestimonialApi(
  payload: Partial<Testimonial>,
): Promise<Testimonial> {
  const response = await fetch(
    `${API_BASE_URL}/testimonials`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const result =
    await parseResponse<Testimonial>(
      response,
    );

  return result.data;
}

export async function updateTestimonialApi(
  id: string,
  payload: Partial<Testimonial>,
): Promise<Testimonial> {
  const response = await fetch(
    `${API_BASE_URL}/testimonials/${id}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const result =
    await parseResponse<Testimonial>(
      response,
    );

  return result.data;
}

export async function deleteTestimonialApi(
  id: string,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/testimonials/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );

  await parseResponse<unknown>(response);

  return true;
}

/* =========================================================
   5. FAQ
   Currently using mock data
========================================================= */

export async function getFAQs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<{
  faqs: FAQItem[];
  meta?: PageMeta;
}> {
  await delay(100);

  let filtered = [...FAQS];

  if (params?.category?.trim()) {
    const categoryQuery =
      params.category.trim().toLowerCase();

    filtered = filtered.filter(
      (faq) =>
        faq.category.toLowerCase() ===
        categoryQuery,
    );
  }

  if (params?.search?.trim()) {
    const query =
      params.search.trim().toLowerCase();

    filtered = filtered.filter((faq) =>
      [
        faq.question,
        faq.answer,
        faq.category,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }

  const { items, meta } = paginate(
    filtered,
    params?.page,
    params?.limit,
  );

  return {
    faqs: items,
    meta,
  };
}

export async function getFAQById(
  id: string,
): Promise<FAQItem> {
  await delay(100);

  const faq = FAQS.find(
    (item) => item.id === id,
  );

  if (!faq) {
    throw new Error(
      `FAQ ${id} not found`,
    );
  }

  return faq;
}

export async function getAllFAQs(): Promise<
  FAQItem[]
> {
  const result = await getFAQs({
    page: 1,
    limit: 50,
  });

  return result.faqs;
}

/* =========================================================
   GENERIC API CLIENT
   Used by payment.service.ts and other services
========================================================= */

const api = {
  get: async <T>(
    url: string,
  ): Promise<{ data: ApiResponse<T> }> => {
    const response = await fetch(
      `${API_BASE_URL}${url}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      },
    );

    const result =
      await parseResponse<T>(response);

    return {
      data: result,
    };
  },

  post: async <T>(
    url: string,
    body?: unknown,
  ): Promise<{ data: ApiResponse<T> }> => {
    const response = await fetch(
      `${API_BASE_URL}${url}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined,
      },
    );

    const result =
      await parseResponse<T>(response);

    return {
      data: result,
    };
  },

  patch: async <T>(
    url: string,
    body?: unknown,
  ): Promise<{ data: ApiResponse<T> }> => {
    const response = await fetch(
      `${API_BASE_URL}${url}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined,
      },
    );

    const result =
      await parseResponse<T>(response);

    return {
      data: result,
    };
  },

  put: async <T>(
    url: string,
    body?: unknown,
  ): Promise<{ data: ApiResponse<T> }> => {
    const response = await fetch(
      `${API_BASE_URL}${url}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined,
      },
    );

    const result =
      await parseResponse<T>(response);

    return {
      data: result,
    };
  },

  delete: async <T>(
    url: string,
  ): Promise<{ data: ApiResponse<T> }> => {
    const response = await fetch(
      `${API_BASE_URL}${url}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      },
    );

    const result =
      await parseResponse<T>(response);

    return {
      data: result,
    };
  },
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default api;