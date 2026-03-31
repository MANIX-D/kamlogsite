export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Announcement {
  id: number;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  image?: string;
  is_active: boolean;
  priority: number;
  published_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobOffer {
  id: number;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  requirements_fr: string;
  requirements_en: string;
  location: string;
  contract_type: string;
  experience_level: string;
  salary_range?: string;
  is_active: boolean;
  application_deadline?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}
