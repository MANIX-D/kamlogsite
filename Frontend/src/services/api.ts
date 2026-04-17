import { get, post } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// ── Helpers ──────────────────────────────────────────────

const getLang = (): 'fr' | 'en' => {
  const lang = localStorage.getItem('i18nextLng') || 'fr';
  return lang.startsWith('en') ? 'en' : 'fr';
};

const localized = (item: any, field: string): string => {
  const lang = getLang();
  return item[`${field}_${lang}`] || item[`${field}_fr`] || '';
};

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();

const makeExcerpt = (html: string, maxLen = 160): string => {
  const text = stripHtml(html);
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};

// ── Actual API response structure from the backend ──────

interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ── Public Interfaces ────────────────────────────────────

export interface Service {
  id: number;
  nom_fr: string;
  nom_en: string;
  description_fr: string;
  description_en: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Actualite {
  id: number;
  titre_fr: string;
  titre_en: string;
  contenu_fr: string;
  contenu_en: string;
  type: 'article' | 'annonce' | 'offre';
  image?: string;
  date_publication: string;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  type: 'article' | 'announcement' | 'job';
  image_url?: string;
  published_at: string;
  date_publication?: string;
  location?: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface JobOffer {
  id: number;
  title: string;
  content: string;
  requirements?: string;
  benefits?: string;
  location: string;
  contract_type: string;
  experience_level: string;
  salary_range?: string;
  department?: string;
  application_deadline?: string;
  is_active: boolean;
  is_urgent: boolean;
  applications_count?: number;
  image_url?: string;
  published_at: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: number;
  name_fr: string;
  name_en: string;
  logo_url?: string;
  description_fr?: string;
  description_en?: string;
  category?: string;
  sector_fr?: string;
  sector_en?: string;
  website?: string;
  display_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Infrastructure {
  id: number;
  nom_fr: string;
  nom_en: string;
  description_fr: string;
  description_en: string;
  surface?: string;
  capacite?: string;
  image?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  nom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  sujet: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
}

export interface VisitRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  date: string;
  heure: string;
  type_visite: 'guidee' | 'autonome' | 'virtuelle' | 'rencontre';
  message?: string;
  infrastructure_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ── Data mappers ─────────────────────────────────────────

function mapNewsItem(raw: any): NewsItem {
  // Map backend types (annonce, offre) to frontend types (announcement, job)
  let mappedType: 'article' | 'announcement' | 'job' = 'article';
  if (raw.type === 'annonce') mappedType = 'announcement';
  else if (raw.type === 'offre') mappedType = 'job';
  else if (raw.type === 'article') mappedType = 'article';

  return {
    id: raw.id,
    title: raw.titre_fr ? localized(raw, 'titre') : localized(raw, 'title'),
    excerpt: makeExcerpt(raw.contenu_fr ? localized(raw, 'contenu') : localized(raw, 'content')),
    content: raw.contenu_fr ? localized(raw, 'contenu') : localized(raw, 'content'),
    type: mappedType,
    image_url: raw.image_url || raw.image || undefined,
    published_at: raw.date_publication || raw.created_at,
    date_publication: raw.date_publication,
    location: raw.location,
    slug: raw.slug_fr ? localized(raw, 'slug') : undefined,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function mapJobOffer(raw: any): JobOffer {
  // Job offers come from News table, so use titre/contenu fields
  return {
    id: raw.id,
    title: raw.titre_fr ? localized(raw, 'titre') : localized(raw, 'title'),
    content: raw.contenu_fr ? localized(raw, 'contenu') : localized(raw, 'description'),
    requirements: localized(raw, 'requirements') || undefined,
    benefits: localized(raw, 'benefits') || undefined,
    location: raw.location || '',
    contract_type: raw.contract_type || '',
    experience_level: raw.experience_level || '',
    salary_range: raw.salary_range,
    department: raw.department,
    application_deadline: raw.application_deadline,
    is_active: raw.is_active !== undefined ? raw.is_active : raw.is_published,
    is_urgent: raw.is_urgent !== undefined ? raw.is_urgent : raw.is_featured,
    applications_count: raw.job_applications_count || raw.applications_count,
    image_url: raw.image_url || raw.image || undefined,
    published_at: raw.date_publication || raw.created_at,
    skills: [],
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

// ── API Service ──────────────────────────────────────────

class ApiService {
  async getServices(): Promise<Service[]> {
    const res = await get<ApiSuccessResponse<Service[]>>(API_ENDPOINTS.services);
    return res.data;
  }

  async getActualites(params?: {
    type?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Actualite>> {
    const endpoint = this.buildUrl(API_ENDPOINTS.actualites, params);
    const res = await get<ApiSuccessResponse<Actualite[]>>(endpoint);
    return {
      data: res.data || [],
      current_page: res.pagination?.current_page || 1,
      last_page: res.pagination?.last_page || 1,
      per_page: res.pagination?.per_page || 12,
      total: res.pagination?.total || (res.data || []).length,
    };
  }

  async getActualite(id: number): Promise<Actualite> {
    const res = await get<ApiSuccessResponse<Actualite>>(`${API_ENDPOINTS.actualites}/${id}`);
    return res.data;
  }

  async getNews(params?: {
    type?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<NewsItem>> {
    const type = params?.type;
    const page = params?.page || 1;
    const perPage = params?.per_page || 9;

    // Map frontend types (announcement, job) to backend types (annonce, offre)
    let backendType = type;
    if (type === 'announcement') backendType = 'annonce';
    if (type === 'job') backendType = 'offre';

    // Fetch from unified /news endpoint with type filter
    const endpoint = this.buildUrl(API_ENDPOINTS.actualites, { 
      type: backendType === 'all' ? undefined : backendType, 
      page, 
      per_page: perPage 
    });
    const res = await get<ApiSuccessResponse<any[]>>(endpoint);
    return this.wrapPaginated(res, mapNewsItem);
  }

  async getNewsItem(id: number): Promise<NewsItem> {
    const res = await get<ApiSuccessResponse<any>>(`${API_ENDPOINTS.actualites}/${id}`);
    return mapNewsItem(res.data);
  }

  async getJobOffer(id: number): Promise<ApiResponse<JobOffer>> {
    const res = await get<ApiSuccessResponse<any>>(`/jobs/${id}`);
    return { success: res.success, data: mapJobOffer(res.data), message: res.message };
  }

  async getPartners(): Promise<Partner[]> {
    const res = await get<any>(`${API_ENDPOINTS.partners}?per_page=100`);
    // Handle paginated response
    return Array.isArray(res.data) ? res.data : res.data?.data || [];
  }

  async getInfrastructures(): Promise<Infrastructure[]> {
    const res = await get<any>(`${API_ENDPOINTS.infrastructures}?per_page=100`);
    return Array.isArray(res.data) ? res.data : res.data?.data || [];
  }

  async submitContactForm(data: ContactMessage): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>(API_ENDPOINTS.contact, data);
  }

  async subscribeNewsletter(data: NewsletterSubscription): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>(API_ENDPOINTS.newsletter, data);
  }

  async submitVisitRequest(data: VisitRequest): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>(API_ENDPOINTS.visitRequest, data);
  }

  async submitJobApplication(
    jobId: number,
    formData: FormData
  ): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>(`/jobs/${jobId}/apply`, formData);
  }

  async submitQuoteRequest(data: any): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>(API_ENDPOINTS.quoteRequest, data);
  }

  private wrapPaginated<T>(
    res: ApiSuccessResponse<any[]>,
    mapper: (raw: any) => T
  ): PaginatedResponse<T> {
    return {
      data: (res.data || []).map(mapper),
      current_page: res.pagination?.current_page || 1,
      last_page: res.pagination?.last_page || 1,
      per_page: res.pagination?.per_page || 12,
      total: res.pagination?.total || (res.data || []).length,
    };
  }

  private buildUrl(base: string, params?: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, val.toString());
        }
      });
    }
    const query = searchParams.toString();
    return query ? `${base}?${query}` : base;
  }
}

export const apiService = new ApiService();
