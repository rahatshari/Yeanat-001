import {
  Member,
  Contribution,
  Income,
  Expense,
  ExpenseCategory,
  User,
  ActivityLog,
  OrganizationSettings,
} from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'pathamara_members_v1',
  CONTRIBUTIONS: 'pathamara_contributions_v1',
  INCOME: 'pathamara_income_v1',
  EXPENSES: 'pathamara_expenses_v1',
  CATEGORIES: 'pathamara_categories_v1',
  USERS: 'pathamara_users_v1',
  LOGS: 'pathamara_logs_v1',
  SETTINGS: 'pathamara_settings_v1',
  CURRENT_USER: 'pathamara_current_user_v1',
};

export const INITIAL_SETTINGS: OrganizationSettings = {
  org_name: 'পাঠামারা ইয়ানত সংরক্ষণ',
  tagline: 'একটি অরাজনৈতিক, সমাজসেবামূলক ও মানবিক কল্যাণ তহবিল',
  address: 'গ্রাম: পাঠামারা, ডাকঘর: পাঠামারা, থানা: সদর',
  contact_phone: '০১৭১২-৩৪৫৬৭৮',
  established_year: '২০২৪',
  currency_symbol: '৳',
  default_monthly_fee: 500,
  president_name: 'মাওলানা মোঃ রফিকুল ইসলাম',
  secretary_name: 'মোঃ জহিরুল ইসলাম',
  cashier_name: 'মোঃ মাহমুদুল হাসান',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'মাওলানা মোঃ রফিকুল ইসলাম',
    phone: '01711000001',
    pin: '1234',
    role: 'admin',
  },
  {
    id: 'usr-2',
    name: 'মোঃ মাহমুদুল হাসান',
    phone: '01811000002',
    pin: '2345',
    role: 'accountant',
  },
  {
    id: 'usr-3',
    name: 'মোঃ জহিরুল ইসলাম',
    phone: '01911000003',
    pin: '3456',
    role: 'viewer',
  },
];

export const INITIAL_CATEGORIES: ExpenseCategory[] = [
  { id: 'cat-1', name: 'উন্নয়ন', is_default: true },
  { id: 'cat-2', name: 'শিক্ষা', is_default: true },
  { id: 'cat-3', name: 'চিকিৎসা', is_default: true },
  { id: 'cat-4', name: 'সামাজিক কার্যক্রম', is_default: true },
  { id: 'cat-5', name: 'ধর্মীয় কার্যক্রম', is_default: true },
  { id: 'cat-6', name: 'অনুষ্ঠান', is_default: true },
  { id: 'cat-7', name: 'অফিস খরচ', is_default: true },
  { id: 'cat-8', name: 'জরুরি খরচ', is_default: true },
  { id: 'cat-9', name: 'অন্যান্য', is_default: true },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-001',
    member_id: 'PM-001',
    name: 'মোঃ আব্দুল করিম',
    phone: '01712111222',
    address: 'পাঠামারা পূর্বপাড়া',
    joining_date: '2025-01-01',
    monthly_fee: 500,
    status: 'active',
  },
  {
    id: 'mem-002',
    member_id: 'PM-002',
    name: 'মোঃ রফিকুল ইসলাম',
    phone: '01819222333',
    address: 'পাঠামারা মধ্যপাড়া',
    joining_date: '2025-01-01',
    monthly_fee: 500,
    status: 'active',
  },
  {
    id: 'mem-003',
    member_id: 'PM-003',
    name: 'মোঃ শফিকুল আলম',
    phone: '01911333444',
    address: 'পাঠামারা উত্তরপাড়া',
    joining_date: '2025-01-01',
    monthly_fee: 1000,
    status: 'active',
  },
  {
    id: 'mem-004',
    member_id: 'PM-004',
    name: 'ইঞ্জিনিয়ার মোঃ তানভীর হাসান',
    phone: '01715444555',
    address: 'পাঠামারা দক্ষিণপাড়া',
    joining_date: '2025-01-15',
    monthly_fee: 1000,
    status: 'active',
  },
  {
    id: 'mem-005',
    member_id: 'PM-005',
    name: 'হাজী মোঃ নুরুল ইসলাম',
    phone: '01817555666',
    address: 'পাঠামারা মসজিদ রোড',
    joining_date: '2025-02-01',
    monthly_fee: 500,
    status: 'active',
  },
  {
    id: 'mem-006',
    member_id: 'PM-006',
    name: 'মোঃ দেলোয়ার হোসেন',
    phone: '01918666777',
    address: 'পাঠামারা বাজার সংলগ্ন',
    joining_date: '2025-02-10',
    monthly_fee: 500,
    status: 'active',
  },
  {
    id: 'mem-007',
    member_id: 'PM-007',
    name: 'মোঃ আসাদুজ্জামান',
    phone: '01719777888',
    address: 'পাঠামারা স্কুলপাড়া',
    joining_date: '2025-03-01',
    monthly_fee: 500,
    status: 'active',
  },
  {
    id: 'mem-008',
    member_id: 'PM-008',
    name: 'মোঃ খোরশেদ আলম',
    phone: '01820888999',
    address: 'পাঠামারা পূর্বপাড়া',
    joining_date: '2025-03-01',
    monthly_fee: 500,
    status: 'active',
  },
  {
    id: 'mem-009',
    member_id: 'PM-009',
    name: 'ডাঃ মোঃ কামরুল ইসলাম',
    phone: '01921999000',
    address: 'পাঠামারা হাসপাতাল মোড়',
    joining_date: '2025-03-15',
    monthly_fee: 1500,
    status: 'active',
  },
  {
    id: 'mem-010',
    member_id: 'PM-010',
    name: 'মোঃ মিজানুর রহমান',
    phone: '01722123456',
    address: 'পাঠামারা পশ্চিমপাড়া',
    joining_date: '2025-04-01',
    monthly_fee: 500,
    status: 'inactive',
  },
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  // January 2026
  {
    id: 'cnt-001',
    member_id: 'mem-001',
    month: 1,
    year: 2026,
    amount: 500,
    payment_date: '2026-01-05',
    payment_method: 'cash',
    transaction_id: 'REC-260101',
    note: 'মাসিক নির্ধারিত চাঁদা',
    created_at: '2026-01-05T10:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-002',
    member_id: 'mem-002',
    month: 1,
    year: 2026,
    amount: 500,
    payment_date: '2026-01-06',
    payment_method: 'mobile_banking',
    transaction_id: 'BK-890214',
    note: 'বিকাশে প্রাপ্ত',
    created_at: '2026-01-06T11:30:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-003',
    member_id: 'mem-003',
    month: 1,
    year: 2026,
    amount: 1000,
    payment_date: '2026-01-08',
    payment_method: 'bank',
    transaction_id: 'IBBL-9921',
    note: 'ব্যাংক জমা',
    created_at: '2026-01-08T12:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-004',
    member_id: 'mem-004',
    month: 1,
    year: 2026,
    amount: 1000,
    payment_date: '2026-01-10',
    payment_method: 'mobile_banking',
    transaction_id: 'NGD-5512',
    note: 'নগদ ওয়ালেট',
    created_at: '2026-01-10T14:15:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-005',
    member_id: 'mem-005',
    month: 1,
    year: 2026,
    amount: 500,
    payment_date: '2026-01-12',
    payment_method: 'cash',
    transaction_id: 'REC-260105',
    note: '',
    created_at: '2026-01-12T09:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-006',
    member_id: 'mem-006',
    month: 1,
    year: 2026,
    amount: 500,
    payment_date: '2026-01-15',
    payment_method: 'cash',
    transaction_id: 'REC-260106',
    note: '',
    created_at: '2026-01-15T16:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-007',
    member_id: 'mem-007',
    month: 1,
    year: 2026,
    amount: 500,
    payment_date: '2026-01-18',
    payment_method: 'cash',
    transaction_id: 'REC-260107',
    note: '',
    created_at: '2026-01-18T10:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'cnt-008',
    member_id: 'mem-009',
    month: 1,
    year: 2026,
    amount: 1500,
    payment_date: '2026-01-20',
    payment_method: 'bank',
    transaction_id: 'CITI-3301',
    note: '',
    created_at: '2026-01-20T11:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },

  // February 2026
  {
    id: 'cnt-009',
    member_id: 'mem-001',
    month: 2,
    year: 2026,
    amount: 500,
    payment_date: '2026-02-07',
    payment_method: 'cash',
    transaction_id: 'REC-260201',
    note: '',
    created_at: '2026-02-07T10:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'cnt-010',
    member_id: 'mem-002',
    month: 2,
    year: 2026,
    amount: 500,
    payment_date: '2026-02-09',
    payment_method: 'mobile_banking',
    transaction_id: 'BK-991204',
    note: '',
    created_at: '2026-02-09T15:20:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'cnt-011',
    member_id: 'mem-003',
    month: 2,
    year: 2026,
    amount: 1000,
    payment_date: '2026-02-12',
    payment_method: 'bank',
    transaction_id: 'IBBL-9988',
    note: '',
    created_at: '2026-02-12T11:45:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'cnt-012',
    member_id: 'mem-004',
    month: 2,
    year: 2026,
    amount: 1000,
    payment_date: '2026-02-14',
    payment_method: 'mobile_banking',
    transaction_id: 'NGD-6621',
    note: '',
    created_at: '2026-02-14T17:10:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'cnt-013',
    member_id: 'mem-009',
    month: 2,
    year: 2026,
    amount: 1500,
    payment_date: '2026-02-18',
    payment_method: 'bank',
    transaction_id: 'CITI-3344',
    note: '',
    created_at: '2026-02-18T10:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },

  // March 2026
  {
    id: 'cnt-014',
    member_id: 'mem-001',
    month: 3,
    year: 2026,
    amount: 500,
    payment_date: '2026-03-05',
    payment_method: 'cash',
    transaction_id: 'REC-260301',
    note: '',
    created_at: '2026-03-05T10:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'cnt-015',
    member_id: 'mem-004',
    month: 3,
    year: 2026,
    amount: 1000,
    payment_date: '2026-03-11',
    payment_method: 'mobile_banking',
    transaction_id: 'BK-100234',
    note: '',
    created_at: '2026-03-11T12:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
];

export const INITIAL_INCOME: Income[] = [
  {
    id: 'inc-001',
    category: 'অনুদান',
    amount: 25000,
    date: '2026-01-15',
    source: 'সৌদি প্রবাসী কল্যাণ ফোরাম, পাঠামারা',
    transaction_id: 'TXN-KSA-990',
    note: 'সংগঠনের সার্বিক উন্নয়নে প্রবাসী ভাইদের শুভেচ্ছা অনুদান',
    created_at: '2026-01-15T10:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'inc-002',
    category: 'দান',
    amount: 12000,
    date: '2026-02-10',
    source: 'হাজী মোঃ নুরুল ইসলাম',
    transaction_id: 'DON-0210',
    note: 'পবিত্র শবে বরাতে সাধারণ মানুষের সুবিধার্থে অনুদান',
    created_at: '2026-02-10T14:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'inc-003',
    category: 'অন্যান্য আয়',
    amount: 6500,
    date: '2026-03-02',
    source: 'বার্ষিক সাধারণ সভা রসিদ সংগ্রহ',
    transaction_id: 'AGM-2026',
    note: 'সদস্যদের বিশেষ তহবিল সহায়তা',
    created_at: '2026-03-02T16:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    category: 'উন্নয়ন',
    description: 'মসজিদ সংলগ্ন রাস্তা সংস্কার ও ইটের সলিং কাজ',
    amount: 8500,
    date: '2026-01-22',
    recipient: 'আব্দুল হক রাজমিস্ত্রি',
    voucher_no: 'VCH-001',
    note: 'সদর রাস্তা সংস্কার প্রকল্প',
    created_at: '2026-01-22T15:00:00.000Z',
    created_by: 'মাওলানা মোঃ রফিকুল ইসলাম',
  },
  {
    id: 'exp-002',
    category: 'অফিস খরচ',
    description: 'সংগঠনের নতুন রশিদ বই, ভাউচার ও খাতা মুদ্রণ',
    amount: 2200,
    date: '2026-01-25',
    recipient: 'মদিনা প্রিন্টিং প্রেস',
    voucher_no: 'VCH-002',
    note: 'রশিদ বই ৫টি ও লেজার খাতা',
    created_at: '2026-01-25T11:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'exp-003',
    category: 'চিকিৎসা',
    description: 'অসহায় রোগীর চোখের অপারেশনের জন্য এককালীন সাহায্য',
    amount: 5000,
    date: '2026-02-12',
    recipient: 'রোগীর পিতা: মোঃ সামসুল হক',
    voucher_no: 'VCH-003',
    note: 'কমিটির সর্বসম্মত সিদ্ধান্তে প্রদত্ত',
    created_at: '2026-02-12T16:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'exp-004',
    category: 'ধর্মীয় কার্যক্রম',
    description: 'বার্ষিক ওয়াজ ও দোয়া মাহফিল সহায়তা ও মাইক ভাড়া',
    amount: 6000,
    date: '2026-02-28',
    recipient: 'আল-মদিনা সাউন্ড সিস্টেম',
    voucher_no: 'VCH-004',
    note: '',
    created_at: '2026-02-28T18:00:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
  {
    id: 'exp-005',
    category: 'শিক্ষা',
    description: 'দরিদ্র ও মেধাবী শিক্ষার্থীদের স্কুল সামগ্রী ও খাতা বিতরণ',
    amount: 4500,
    date: '2026-03-08',
    recipient: 'পাঠামারা লাইব্রেরী ও স্টেশনারি',
    voucher_no: 'VCH-005',
    note: '২০ জন শিক্ষার্থীর মাঝে বিতরণ',
    created_at: '2026-03-08T14:30:00.000Z',
    created_by: 'মোঃ মাহমুদুল হাসান',
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-001',
    user_id: 'usr-1',
    user_name: 'মাওলানা মোঃ রফিকুল ইসলাম',
    action: 'login',
    description: 'সিস্টেমে অ্যাডমিন হিসেবে লগইন করেছেন',
    timestamp: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'log-002',
    user_id: 'usr-1',
    user_name: 'মাওলানা মোঃ রফিকুল ইসলাম',
    action: 'create',
    description: 'নতুন সদস্য যোগ করা হয়েছে: মোঃ আব্দুল করিম (PM-001)',
    timestamp: '2026-03-01T08:15:00.000Z',
  },
  {
    id: 'log-003',
    user_id: 'usr-2',
    user_name: 'মোঃ মাহমুদুল হাসান',
    action: 'create',
    description: 'মার্চ মাসের চাঁদা জমা নেওয়া হয়েছে: মোঃ আব্দুল করিম (৳ ৫০০)',
    timestamp: '2026-03-05T10:00:00.000Z',
  },
];

// Memory fallback in case localStorage is disabled or throws SecurityError in mobile browsers
const memoryStorage = new Map<string, string>();

// Helper to safely load from LocalStorage with fallback
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      if (item !== null && item !== undefined) {
        return JSON.parse(item) as T;
      }
    }
  } catch (e) {
    console.warn(`localStorage not accessible for ${key}, falling back to memory:`, e);
  }

  const inMemory = memoryStorage.get(key);
  if (inMemory) {
    try {
      return JSON.parse(inMemory) as T;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

// Helper to save to LocalStorage
export function saveToStorage<T>(key: string, value: T): void {
  const jsonStr = JSON.stringify(value);
  memoryStorage.set(key, jsonStr);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, jsonStr);
    }
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage (using memory instead):`, e);
  }
}

export { STORAGE_KEYS };
