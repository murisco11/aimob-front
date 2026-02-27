export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent";
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "negotiating" | "closed";
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  source: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  type: "residential" | "commercial" | "land";
  status: "available" | "sold" | "pending";
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  type: "residential" | "commercial" | "land";
}

export interface Visit {
  id: string;
  leadId: string;
  propertyId: string;
  scheduledAt: string;
  completedAt?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitInput {
  leadId: string;
  propertyId: string;
  scheduledAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
