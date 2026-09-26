export type UserRole = 'admin' | 'accountant' | 'viewer';

export interface User {
  id: string;
  name: string;
  phone: string;
  pin: string;
  role: UserRole;
}

export interface Member {
  id: string;
  member_id: string; // e.g. PM-001
  name: string;
  phone: string;
  address?: string;
  joining_date: string; // YYYY-MM-DD
  monthly_fee: number;
  status: 'active' | 'inactive';
  photo?: string;
}

export type PaymentMethod = 'cash' | 'bank' | 'mobile_banking' | 'other';

export interface Contribution {
  id: string;
  member_id: string;
  month: number; // 1 to 12
  year: number;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  payment_method: PaymentMethod;
  transaction_id?: string;
  note?: string;
  created_at: string;
  created_by?: string;
}

export interface Income {
  id: string;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  source: string;
  transaction_id?: string;
  note?: string;
  created_at: string;
  created_by?: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  recipient: string;
  voucher_no?: string;
  note?: string;
  receipt_image?: string;
  created_at: string;
  created_by?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  is_default: boolean;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: 'create' | 'update' | 'delete' | 'backup' | 'restore' | 'login';
  description: string;
  timestamp: string;
}

export interface OrganizationSettings {
  org_name: string;
  tagline: string;
  address: string;
  contact_phone: string;
  established_year: string;
  currency_symbol: string;
  default_monthly_fee: number;
  president_name: string;
  secretary_name: string;
  cashier_name: string;
}

export type TabType =
  | 'dashboard'
  | 'members'
  | 'contributions'
  | 'dues'
  | 'income'
  | 'expenses'
  | 'income_expense_report'
  | 'monthly_report'
  | 'member_report'
  | 'all_reports'
  | 'backup'
  | 'settings';
