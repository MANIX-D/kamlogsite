import { get, post } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

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
  type: 'article' | 'announcement' | 'job';
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
  location?: string;
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
  website?: string;
  display_order: number;
  is_active: boolean;
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

class ApiService {
  async getServices(): Promise<Service[]> {
    return get<Service[]>(API_ENDPOINTS.services);
  }

  async getActualites(params?: {
    type?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Actualite>> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

    const query = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.actualites}${query ? `?${query}` : ''}`;

    return get<PaginatedResponse<Actualite>>(endpoint);
  }

  async getActualite(id: number): Promise<Actualite> {
    return get<Actualite>(`${API_ENDPOINTS.actualites}/${id}`);
  }

  async getNews(params?: {
    type?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<NewsItem>> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

    const query = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.actualites}${query ? `?${query}` : ''}`;

    return get<PaginatedResponse<NewsItem>>(endpoint);
  }

  async getPartners(): Promise<Partner[]> {
    return get<Partner[]>(API_ENDPOINTS.partners);
  }

  async getInfrastructures(): Promise<Infrastructure[]> {
    return get<Infrastructure[]>(API_ENDPOINTS.infrastructures);
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
    return post<ApiResponse<any>>(`${API_ENDPOINTS.actualites}/${jobId}/apply`, formData);
  }

  async submitQuoteRequest(data: any): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>(API_ENDPOINTS.quoteRequest, data);
  }
}

export const apiService = new ApiService();
