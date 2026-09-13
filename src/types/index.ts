export type UserRole = 'customer' | 'worker' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'suspended';

export interface WeeklyScheduleDay {
  available: boolean;
  timeSlot: string; // e.g. "6 PM - 9 PM" or "Not Available"
}

export interface WorkerAvailability {
  isAvailable: boolean;
  preference: 'full_day' | 'morning' | 'afternoon' | 'evening' | 'custom';
  weeklySchedule: {
    monday: WeeklyScheduleDay;
    tuesday: WeeklyScheduleDay;
    wednesday: WeeklyScheduleDay;
    thursday: WeeklyScheduleDay;
    friday: WeeklyScheduleDay;
    saturday: WeeklyScheduleDay;
    sunday: WeeklyScheduleDay;
  };
}

export interface WorkerCertificate {
  id: string;
  title: string;
  issuer: string;
  issuedYear: string;
  verified: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  roles: UserRole[];
  role?: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;

  // Worker-specific attributes
  cooperativeId?: string;
  cooperativeName?: string;
  profession?: string;
  skills?: string[];
  experienceYears?: number;
  certificates?: WorkerCertificate[];
  verificationStatus?: VerificationStatus;
  availability?: WorkerAvailability;
  rating?: number;
  totalJobs?: number;
  currentWorkload?: 'low' | 'moderate' | 'high';
  earnings?: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  welfareBalance?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  baseRate: number;
  rateUnit: string;
  popular: boolean;
  activeCoopsCount: number;
  availableWorkersCount: number;
}

export type BookingStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'STARTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REJECTED';

export interface FirestoreBooking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhotoURL?: string | null;
  serviceType: string;
  description: string;
  address: string;
  phoneNumber?: string;
  bookingType: 'Emergency' | 'Scheduled' | 'emergency' | 'scheduled';
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  status: BookingStatus;
  workerId: string | null;
  workerName?: string | null;
  acceptedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt?: string;
  otp?: string;
}

export interface Booking {
  id: string;
  bookingReference?: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhotoURL?: string | null;
  customerPhone: string;
  customerAddress: string;
  serviceId: string;
  serviceName: string;
  serviceType?: string;
  workerId?: string | null;
  workerName?: string | null;
  workerPhone?: string;
  workerPhoto?: string;
  workerRating?: number;
  cooperativeName?: string;
  type: 'emergency' | 'scheduled' | 'Emergency' | 'Scheduled';
  bookingType?: 'Emergency' | 'Scheduled' | 'emergency' | 'scheduled';
  description: string;
  address?: string;
  phoneNumber?: string;
  date: string;
  timeSlot: string;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  status: BookingStatus;
  estimatedAmount: number;
  actualAmount?: number;
  createdAt: string;
  updatedAt?: string;
  otp?: string;
  fairMatchReason?: string;
  disputeReason?: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface Cooperative {
  id: string;
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  foundedYear: number;
  totalMembers: number;
  activeWorkers: number;
  servicesOffered: string[];
  welfareFundTotal: number;
  rating: number;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  serviceName: string;
  reason: string;
  date: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  resolutionNote?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert' | 'booking';
  role: UserRole | 'all';
}
