export type Role = 'TENANT' | 'STAFF' | 'ADMIN';

export type Status =
  | 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS'
  | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type Category =
  | 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'APPLIANCE'
  | 'STRUCTURAL' | 'PEST_CONTROL' | 'OTHER';

export type LocationInUnit =
  | 'KITCHEN' | 'BATHROOM' | 'BEDROOM' | 'LIVING_ROOM'
  | 'HALLWAY' | 'EXTERIOR' | 'OTHER';

export type PreferredTime =
  | 'ANY_TIME' | 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  apartmentNumber?: string;
  leaseStart?: string;
  leaseEnd?: string;
  skillType?: string;
  available?: boolean;
}

export interface MaintenanceRequest {
  requestId: number;
  tenantId: number;
  assignedStaffId: number | null;
  category: Category;
  locationInUnit: LocationInUnit;
  description: string;
  priority: Priority;
  status: Status;
  photoUrl: string | null;
  preferredDate: string | null;
  preferredTime: PreferredTime;
  allowEntry: boolean;
  dateSubmitted: string;
  completionDate: string | null;
  parentRequestId: number | null;
}

export interface RequestNote {
  noteId: number;
  requestId: number;
  authorId: number;
  noteText: string;
  createdAt: string;
}

export interface Notification {
  notificationId: number;
  userId: number;
  requestId: number | null;
  message: string;
  timestamp: string;
  readStatus: boolean;
}

export interface AnalyticsResponse {
  totalOpen: number;
  urgentCount: number;
  avgResolutionDays: number;
  completedThisMonth: number;
  technicianAvgWorkload: number;
}

export interface TechnicianWorkload {
  technician: User;
  activeRequestCount: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateRequestPayload {
  tenantId: number;
  category: Category;
  locationInUnit: LocationInUnit;
  description: string;
  priority: Priority;
  preferredTime: PreferredTime;
  preferredDate: string | null;
  allowEntry: boolean;
}

export interface AddNotePayload {
  authorId: number;
  noteText: string;
}
