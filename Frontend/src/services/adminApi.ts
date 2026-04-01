import { get, post, put, del } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Announcement, JobOffer } from '../types';

interface DashboardStats {
  total_services: number;
  total_news: number;
  total_messages: number;
  total_users: number;
  unread_messages: number;
  active_services: number;
  published_news: number;
  active_users: number;
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

export interface Partenaire {
  id: number;
  name_fr: string;
  name_en: string;
  logo_url?: string;
  description_fr?: string;
  description_en?: string;
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  partnership_level?: 'strategic' | 'premium' | 'standard' | 'basic';
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
  image_alt_fr?: string;
  image_alt_en?: string;
  type?: 'entrepot' | 'bureau' | 'atelier' | 'showroom' | 'autre';
  equipements?: string[];
  specifications_techniques?: Record<string, string>;
  display_order?: number;
  is_active?: boolean;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  nom_fr: string;
  nom_en: string;
  description_fr: string;
  description_en: string;
  icon?: string;
  image?: string;
  display_order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface Newsletter {
  id: number;
  email: string;
  created_at: string;
}

export interface VisitRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  date: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  service_type: 'logistique' | 'stockage' | 'transport' | 'personnalise';
  project_description: string;
  requirements?: string[];
  budget_range?: string;
  desired_start_date?: string;
  desired_end_date?: string;
  priority: 'basse' | 'normale' | 'haute' | 'urgente';
  status: 'nouveau' | 'en_cours' | 'envoyé' | 'accepte' | 'refuse';
  estimated_amount?: string;
  notes_admin?: string;
  quote_document_path?: string;
  ip_address?: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class AdminApiService {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await get<ApiResponse<DashboardStats>>(`${API_ENDPOINTS.admin.dashboard}/stats`);
    return res.data;
  }

  async getActualites(params?: { type?: string }): Promise<{ data: Actualite[] }> {
    const query = params?.type ? `?type=${params.type}` : '';
    const res = await get<ApiResponse<Actualite[]>>(`${API_ENDPOINTS.admin.actualites}${query}`);
    return { data: res.data };
  }

  async getActualite(id: number): Promise<Actualite> {
    const res = await get<ApiResponse<Actualite>>(`${API_ENDPOINTS.admin.actualites}/${id}`);
    return res.data;
  }

  async createActualite(data: Partial<Actualite>): Promise<Actualite> {
    const res = await post<ApiResponse<Actualite>>(API_ENDPOINTS.admin.actualites, data);
    return res.data;
  }

  async updateActualite(id: number, data: Partial<Actualite>): Promise<Actualite> {
    const res = await put<ApiResponse<Actualite>>(`${API_ENDPOINTS.admin.actualites}/${id}`, data);
    return res.data;
  }

  async deleteActualite(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.actualites}/${id}`);
  }

  async getMessages(): Promise<Message[]> {
    const res = await get<ApiResponse<Message[]>>(API_ENDPOINTS.admin.messages);
    return res.data;
  }

  async getMessage(id: number): Promise<Message> {
    const res = await get<ApiResponse<Message>>(`${API_ENDPOINTS.admin.messages}/${id}`);
    return res.data;
  }

  async markMessageAsRead(id: number): Promise<Message> {
    const res = await post<ApiResponse<Message>>(`${API_ENDPOINTS.admin.messages}/${id}/mark-read`, {});
    return res.data;
  }

  async deleteMessage(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.messages}/${id}`);
  }

  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    const res = await get<ApiResponse<Newsletter[]>>(`${API_ENDPOINTS.admin.newsletter}/subscribers`);
    return res.data;
  }

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return this.getNewsletterSubscriptions();
  }

  async deleteNewsletterSubscription(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.newsletter}/subscribers/${id}`);
  }

  async deleteNewsletterSubscriber(id: number): Promise<void> {
    return this.deleteNewsletterSubscription(id);
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const res = await get<ApiResponse<Announcement[]>>(API_ENDPOINTS.admin.announcements);
    return res.data;
  }

  async getAnnouncement(id: number): Promise<Announcement> {
    const res = await get<ApiResponse<Announcement>>(`${API_ENDPOINTS.admin.announcements}/${id}`);
    return res.data;
  }

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const res = await post<ApiResponse<Announcement>>(API_ENDPOINTS.admin.announcements, data);
    return res.data;
  }

  async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<Announcement> {
    const res = await put<ApiResponse<Announcement>>(`${API_ENDPOINTS.admin.announcements}/${id}`, data);
    return res.data;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.announcements}/${id}`);
  }

  async getJobOffers(): Promise<JobOffer[]> {
    const res = await get<ApiResponse<JobOffer[]>>(API_ENDPOINTS.admin.jobOffers);
    return res.data;
  }

  async getJobOffer(id: number): Promise<JobOffer> {
    const res = await get<ApiResponse<JobOffer>>(`${API_ENDPOINTS.admin.jobOffers}/${id}`);
    return res.data;
  }

  async createJobOffer(data: Partial<JobOffer>): Promise<JobOffer> {
    const res = await post<ApiResponse<JobOffer>>(API_ENDPOINTS.admin.jobOffers, data);
    return res.data;
  }

  async updateJobOffer(id: number, data: Partial<JobOffer>): Promise<JobOffer> {
    const res = await put<ApiResponse<JobOffer>>(`${API_ENDPOINTS.admin.jobOffers}/${id}`, data);
    return res.data;
  }

  async deleteJobOffer(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.jobOffers}/${id}`);
  }

  async getVisitRequests(): Promise<VisitRequest[]> {
    const res = await get<ApiResponse<VisitRequest[]>>(API_ENDPOINTS.admin.visitRequests);
    return res.data;
  }

  async getVisitRequest(id: number): Promise<VisitRequest> {
    const res = await get<ApiResponse<VisitRequest>>(`${API_ENDPOINTS.admin.visitRequests}/${id}`);
    return res.data;
  }

  async updateVisitRequestStatus(id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<VisitRequest> {
    const res = await put<ApiResponse<VisitRequest>>(`${API_ENDPOINTS.admin.visitRequests}/${id}`, { status });
    return res.data;
  }

  async deleteVisitRequest(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.visitRequests}/${id}`);
  }

  async getQuotes(): Promise<Quote[]> {
    const res = await get<ApiResponse<Quote[]>>(API_ENDPOINTS.admin.quotes);
    return res.data;
  }

  async getQuote(id: number): Promise<Quote> {
    const res = await get<ApiResponse<Quote>>(`${API_ENDPOINTS.admin.quotes}/${id}`);
    return res.data;
  }

  async updateQuoteStatus(id: number, status: 'nouveau' | 'en_cours' | 'envoyé' | 'accepte' | 'refuse'): Promise<Quote> {
    const res = await put<ApiResponse<Quote>>(`${API_ENDPOINTS.admin.quotes}/${id}`, { status });
    return res.data;
  }

  async deleteQuote(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.quotes}/${id}`);
  }

  // Partenaires
  async getPartenaires(): Promise<Partenaire[]> {
    const res = await get<ApiResponse<Partenaire[]>>(API_ENDPOINTS.admin.partners);
    return res.data;
  }

  async getPartenaire(id: number): Promise<Partenaire> {
    const res = await get<ApiResponse<Partenaire>>(`${API_ENDPOINTS.admin.partners}/${id}`);
    return res.data;
  }

  async createPartenaire(data: Partial<Partenaire> | FormData): Promise<Partenaire> {
    const res = await post<ApiResponse<Partenaire>>(API_ENDPOINTS.admin.partners, data);
    return res.data;
  }

  async updatePartenaire(id: number, data: Partial<Partenaire> | FormData): Promise<Partenaire> {
    const res = await post<ApiResponse<Partenaire>>(`${API_ENDPOINTS.admin.partners}/${id}`, data);
    return res.data;
  }

  async deletePartenaire(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.partners}/${id}`);
  }

  // Infrastructures
  async getInfrastructures(): Promise<Infrastructure[]> {
    const res = await get<ApiResponse<Infrastructure[]>>(API_ENDPOINTS.admin.infrastructures);
    return res.data;
  }

  async getInfrastructure(id: number): Promise<Infrastructure> {
    const res = await get<ApiResponse<Infrastructure>>(`${API_ENDPOINTS.admin.infrastructures}/${id}`);
    return res.data;
  }

  async createInfrastructure(data: Partial<Infrastructure> | FormData): Promise<Infrastructure> {
    const res = await post<ApiResponse<Infrastructure>>(API_ENDPOINTS.admin.infrastructures, data);
    return res.data;
  }

  async updateInfrastructure(id: number, data: Partial<Infrastructure> | FormData): Promise<Infrastructure> {
    const res = await post<ApiResponse<Infrastructure>>(`${API_ENDPOINTS.admin.infrastructures}/${id}`, data);
    return res.data;
  }

  async deleteInfrastructure(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.infrastructures}/${id}`);
  }

  // Services
  async getServices(): Promise<Service[]> {
    const res = await get<ApiResponse<Service[]>>(API_ENDPOINTS.admin.services);
    return res.data;
  }

  async getService(id: number): Promise<Service> {
    const res = await get<ApiResponse<Service>>(`${API_ENDPOINTS.admin.services}/${id}`);
    return res.data;
  }

  async createService(data: Partial<Service>): Promise<Service> {
    const res = await post<ApiResponse<Service>>(API_ENDPOINTS.admin.services, data);
    return res.data;
  }

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    const res = await put<ApiResponse<Service>>(`${API_ENDPOINTS.admin.services}/${id}`, data);
    return res.data;
  }

  async deleteService(id: number): Promise<void> {
    return del<void>(`${API_ENDPOINTS.admin.services}/${id}`);
  }
}

export const adminApiService = new AdminApiService();
