import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Member,
  Contribution,
  Income,
  Expense,
  ExpenseCategory,
  User,
  ActivityLog,
  OrganizationSettings,
  TabType,
  UserRole,
} from '../types';
import {
  STORAGE_KEYS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_MEMBERS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_INCOME,
  INITIAL_EXPENSES,
  INITIAL_LOGS,
  loadFromStorage,
  saveToStorage,
} from '../utils/storage';
import { getCurrentMonth, getCurrentYear, BANGLA_MONTHS } from '../utils/bangla';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface DueInfo {
  member: Member;
  unpaidMonths: { month: number; year: number; monthName: string; fee: number }[];
  totalDueAmount: number;
}

interface AppContextType {
  // State
  members: Member[];
  contributions: Contribution[];
  incomeList: Income[];
  expenses: Expense[];
  categories: ExpenseCategory[];
  users: User[];
  logs: ActivityLog[];
  settings: OrganizationSettings;
  currentUser: User;
  currentTab: TabType;
  selectedMemberId: string | null;
  activeModal: string | null;
  editingItem: any;
  toast: ToastNotification | null;

  // Actions & Navigation
  setCurrentTab: (tab: TabType) => void;
  setSelectedMemberId: (id: string | null) => void;
  openModal: (modalName: string, itemToEdit?: any) => void;
  closeModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Auth & Roles
  login: (phoneOrId: string, pin: string) => boolean;
  switchUser: (userId: string) => void;
  canEdit: boolean; // admin or accountant
  isAdmin: boolean;

  // CRUD Members
  addMember: (memberData: Omit<Member, 'id' | 'member_id'> & { customId?: string }) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  // CRUD Contributions
  addContribution: (data: Omit<Contribution, 'id' | 'created_at'>) => { success: boolean; message?: string };
  updateContribution: (id: string, updates: Partial<Contribution>) => void;
  deleteContribution: (id: string) => void;

  // CRUD Income
  addIncome: (data: Omit<Income, 'id' | 'created_at'>) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  deleteIncome: (id: string) => void;

  // CRUD Expenses
  addExpense: (data: Omit<Expense, 'id' | 'created_at'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Categories & Settings
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (newSettings: OrganizationSettings) => void;

  // Backup & Restore
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => { success: boolean; message: string };
  resetDataToDefault: () => void;

  // Computed Financial Metrics
  totalMembersCount: number;
  activeMembersCount: number;
  allTimeContributions: number;
  thisMonthContributions: number;
  allTimeOtherIncome: number;
  totalIncome: number; // contributions + other income
  allTimeExpenses: number;
  thisMonthExpenses: number;
  currentBalance: number; // totalIncome - allTimeExpenses
  duesList: DueInfo[];
  totalDuesAmount: number;
  membersWithDuesCount: number;
  membersMap: Map<string, Member>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load State from storage
  const [members, setMembers] = useState<Member[]>(() =>
    loadFromStorage(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS)
  );
  const [contributions, setContributions] = useState<Contribution[]>(() =>
    loadFromStorage(STORAGE_KEYS.CONTRIBUTIONS, INITIAL_CONTRIBUTIONS)
  );
  const [incomeList, setIncomeList] = useState<Income[]>(() =>
    loadFromStorage(STORAGE_KEYS.INCOME, INITIAL_INCOME)
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadFromStorage(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES)
  );
  const [categories, setCategories] = useState<ExpenseCategory[]>(() =>
    loadFromStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [logs, setLogs] = useState<ActivityLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.LOGS, INITIAL_LOGS)
  );
  const [settings, setSettings] = useState<OrganizationSettings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0])
  );

  // UI state
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync to Storage
  useEffect(() => saveToStorage(STORAGE_KEYS.MEMBERS, members), [members]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CONTRIBUTIONS, contributions), [contributions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.INCOME, incomeList), [incomeList]);
  useEffect(() => saveToStorage(STORAGE_KEYS.EXPENSES, expenses), [expenses]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CATEGORIES, categories), [categories]);
  useEffect(() => saveToStorage(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => saveToStorage(STORAGE_KEYS.LOGS, logs), [logs]);
  useEffect(() => saveToStorage(STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser), [currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const addLog = (action: ActivityLog['action'], description: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      action,
      description,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  const openModal = (modalName: string, itemToEdit: any = null) => {
    setEditingItem(itemToEdit);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
  };

  const membersMap = useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'accountant';
  const isAdmin = currentUser.role === 'admin';

  // Auth
  const login = (phoneOrId: string, pin: string): boolean => {
    const user = users.find(
      (u) => (u.phone === phoneOrId || u.id === phoneOrId || u.name === phoneOrId) && u.pin === pin
    );
    if (user) {
      setCurrentUser(user);
      addLog('login', `${user.name} (${user.role}) সিস্টেমে প্রবেশ করেছেন`);
      showToast(`স্বাগতম, ${user.name}`);
      return true;
    }
    return false;
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addLog('login', `ব্যবহারকারী পরিবর্তন: ${user.name}`);
      showToast(`ব্যবহারকারী সক্রিয়: ${user.name}`);
    }
  };

  // CRUD Members
  const addMember = (
    memberData: Omit<Member, 'id' | 'member_id'> & { customId?: string }
  ): Member => {
    const nextNum = members.length + 1;
    const generatedId = `PM-${String(nextNum).padStart(3, '0')}`;
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      member_id: memberData.customId?.trim() || generatedId,
      name: memberData.name,
      phone: memberData.phone,
      address: memberData.address,
      joining_date: memberData.joining_date,
      monthly_fee: Number(memberData.monthly_fee) || settings.default_monthly_fee,
      status: memberData.status || 'active',
      photo: memberData.photo,
    };

    setMembers((prev) => [newMember, ...prev]);
    addLog('create', `নতুন সদস্য যোগ করা হয়েছে: ${newMember.name} (${newMember.member_id})`);
    showToast(`নতুন সদস্য "${newMember.name}" সফলভাবে যুক্ত হয়েছে`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    const m = membersMap.get(id);
    addLog('update', `সদস্য তথ্য আপডেট করা হয়েছে: ${m ? m.name : id}`);
    showToast('সদস্য তথ্য সফলভাবে সংরক্ষণ করা হয়েছে');
  };

  const deleteMember = (id: string) => {
    const m = membersMap.get(id);
    setMembers((prev) => prev.filter((item) => item.id !== id));
    // Also remove contributions of this member
    setContributions((prev) => prev.filter((c) => c.member_id !== id));
    addLog('delete', `সদস্য মুছে ফেলা হয়েছে: ${m ? m.name : id}`);
    showToast('সদস্য মুছে ফেলা হয়েছে', 'info');
  };

  // CRUD Contributions
  const addContribution = (
    data: Omit<Contribution, 'id' | 'created_at'>
  ): { success: boolean; message?: string } => {
    // Validation: prevent duplicate for same member in same month & year
    const exists = contributions.some(
      (c) =>
        c.member_id === data.member_id &&
        Number(c.month) === Number(data.month) &&
        Number(c.year) === Number(data.year)
    );

    const member = membersMap.get(data.member_id);
    const monthName = BANGLA_MONTHS[data.month] || data.month;

    if (exists) {
      return {
        success: false,
        message: `এই সদস্যের ${monthName} ${data.year}-এর চাঁদা ইতিপূর্বেই জমা করা আছে। প্রয়োজন হলে সেটি সম্পাদনা (Edit) করুন।`,
      };
    }

    const newContribution: Contribution = {
      id: `cnt-${Date.now()}`,
      member_id: data.member_id,
      month: Number(data.month),
      year: Number(data.year),
      amount: Number(data.amount),
      payment_date: data.payment_date,
      payment_method: data.payment_method,
      transaction_id: data.transaction_id,
      note: data.note,
      created_at: new Date().toISOString(),
      created_by: currentUser.name,
    };

    setContributions((prev) => [newContribution, ...prev]);
    addLog(
      'create',
      `${member?.name || 'সদস্য'}-এর ${monthName} ${data.year}-এর চাঁদা জমা নেওয়া হয়েছে: ৳${data.amount}`
    );
    showToast(`৳${data.amount} চাঁদা জমা সফলভাবে সম্পন্ন হয়েছে`);
    return { success: true };
  };

  const updateContribution = (id: string, updates: Partial<Contribution>) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addLog('update', `চাঁদা জমার তথ্য সংশোধন করা হয়েছে (রসিদ #${id})`);
    showToast('চাঁদার তথ্য সফলভাবে আপডেট করা হয়েছে');
  };

  const deleteContribution = (id: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== id));
    addLog('delete', `চাঁদা রেকর্ড বাতিল/মুছে ফেলা হয়েছে (রসিদ #${id})`);
    showToast('চাঁদা রেকর্ড মুছে ফেলা হয়েছে', 'info');
  };

  // CRUD Income
  const addIncome = (data: Omit<Income, 'id' | 'created_at'>) => {
    const newInc: Income = {
      id: `inc-${Date.now()}`,
      category: data.category,
      amount: Number(data.amount),
      date: data.date,
      source: data.source,
      transaction_id: data.transaction_id,
      note: data.note,
      created_at: new Date().toISOString(),
      created_by: currentUser.name,
    };
    setIncomeList((prev) => [newInc, ...prev]);
    addLog('create', `নতুন আয় যুক্ত হয়েছে: ${data.category} (৳${data.amount}, উৎস: ${data.source})`);
    showToast(`৳${data.amount} আয় সফলভাবে যুক্ত হয়েছে`);
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    setIncomeList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
    addLog('update', `আয়ের তথ্য আপডেট করা হয়েছে`);
    showToast('আয়ের তথ্য সফলভাবে আপডেট করা হয়েছে');
  };

  const deleteIncome = (id: string) => {
    setIncomeList((prev) => prev.filter((i) => i.id !== id));
    addLog('delete', `আয় রেকর্ড মুছে ফেলা হয়েছে`);
    showToast('আয় রেকর্ড মুছে ফেলা হয়েছে', 'info');
  };

  // CRUD Expenses
  const addExpense = (data: Omit<Expense, 'id' | 'created_at'>) => {
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category: data.category,
      description: data.description,
      amount: Number(data.amount),
      date: data.date,
      recipient: data.recipient,
      voucher_no: data.voucher_no,
      note: data.note,
      receipt_image: data.receipt_image,
      created_at: new Date().toISOString(),
      created_by: currentUser.name,
    };
    setExpenses((prev) => [newExp, ...prev]);
    addLog('create', `নতুন খরচ অন্তর্ভুক্ত: ${data.category} - ${data.description} (৳${data.amount})`);
    showToast(`৳${data.amount} খরচ সফলভাবে যুক্ত হয়েছে`);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    addLog('update', `খরচের তথ্য আপডেট করা হয়েছে`);
    showToast('খরচের তথ্য সফলভাবে আপডেট হয়েছে');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addLog('delete', `খরচ রেকর্ড মুছে ফেলা হয়েছে`);
    showToast('খরচ রেকর্ড মুছে ফেলা হয়েছে', 'info');
  };

  // Categories
  const addCategory = (name: string) => {
    if (!name.trim()) return;
    const newCat: ExpenseCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      is_default: false,
    };
    setCategories((prev) => [...prev, newCat]);
    addLog('create', `নতুন খরচের খাত তৈরি করা হয়েছে: ${name}`);
    showToast(`নতুন খাত "${name}" তৈরি হয়েছে`);
  };

  const deleteCategory = (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (target?.is_default) {
      showToast('ডিফল্ট খরচের খাত মোছা যাবে না', 'error');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('খাতটি মুছে ফেলা হয়েছে', 'info');
  };

  const updateSettings = (newSettings: OrganizationSettings) => {
    setSettings(newSettings);
    addLog('update', 'সংগঠনের সেটিংস হালনাগাদ করা হয়েছে');
    showToast('সংগঠনের সেটিংস সংরক্ষণ করা হয়েছে');
  };

  // Backup & Restore
  const exportBackupJSON = () => {
    const backupData = {
      version: 1,
      appName: 'পাঠামারা ইয়ানত সংরক্ষণ',
      exportedAt: new Date().toISOString(),
      settings,
      members,
      contributions,
      incomeList,
      expenses,
      categories,
      users,
      logs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `pathamara_iyanat_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addLog('backup', 'সিস্টেমের সম্পূর্ণ ডাটা ব্যাকআপ ডাউনলোড করা হয়েছে');
    showToast('ডাটা ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে');
  };

  const importBackupJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.members || !Array.isArray(parsed.members)) {
        return { success: false, message: 'অকার্যকর ব্যাকআপ ফাইল: সদস্য তালিকা খুঁজে পাওয়া যায়নি' };
      }
      if (parsed.settings) setSettings(parsed.settings);
      if (Array.isArray(parsed.members)) setMembers(parsed.members);
      if (Array.isArray(parsed.contributions)) setContributions(parsed.contributions);
      if (Array.isArray(parsed.incomeList)) setIncomeList(parsed.incomeList);
      if (Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (Array.isArray(parsed.users)) setUsers(parsed.users);

      addLog('restore', 'ব্যাকআপ ফাইল থেকে সফলভাবে ডাটা পুনরুদ্ধার করা হয়েছে');
      showToast('ব্যাকআপ থেকে ডাটা সফলভাবে পুনরুদ্ধার হয়েছে');
      return { success: true, message: 'ডাটা সফলভাবে রিস্টোর হয়েছে' };
    } catch (e: any) {
      return { success: false, message: 'ব্যাকআপ ফাইল পড়তে ত্রুটি হয়েছে: ' + e.message };
    }
  };

  const resetDataToDefault = () => {
    setMembers(INITIAL_MEMBERS);
    setContributions(INITIAL_CONTRIBUTIONS);
    setIncomeList(INITIAL_INCOME);
    setExpenses(INITIAL_EXPENSES);
    setCategories(INITIAL_CATEGORIES);
    setUsers(INITIAL_USERS);
    setLogs(INITIAL_LOGS);
    setSettings(INITIAL_SETTINGS);
    addLog('restore', 'সিস্টেম ডাটা প্রাথমিক ডেমো অবস্থায় রিসেট করা হয়েছে');
    showToast('সকল ডাটা সফলভাবে প্রাথমিক অবস্থায় রিসেট করা হয়েছে');
  };

  // Financial Computations
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.status === 'active').length;

  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();

  const allTimeContributions = useMemo(() => {
    return contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  }, [contributions]);

  const thisMonthContributions = useMemo(() => {
    return contributions
      .filter((c) => Number(c.month) === currentMonth && Number(c.year) === currentYear)
      .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  }, [contributions, currentMonth, currentYear]);

  const allTimeOtherIncome = useMemo(() => {
    return incomeList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  }, [incomeList]);

  // সর্বমোট আয় = চাঁদা + অন্যান্য আয়
  const totalIncome = allTimeContributions + allTimeOtherIncome;

  const allTimeExpenses = useMemo(() => {
    return expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const thisMonthExpenses = useMemo(() => {
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return expenses
      .filter((e) => e.date.startsWith(currentMonthStr))
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  }, [expenses, currentYear, currentMonth]);

  // বর্তমান ব্যালেন্স = মোট আয় - মোট খরচ
  const currentBalance = totalIncome - allTimeExpenses;

  // Dues Calculation:
  // For active members, check months from joining date (or Jan 2026) up to current month (or through month 3/4 of 2026)
  const duesList = useMemo(() => {
    const list: DueInfo[] = [];

    // Consider the months in 2026 up to currentMonth (e.g. 1, 2, 3)
    const targetMonths: { month: number; year: number }[] = [];
    const evaluationYear = 2026;
    const maxMonth = Math.min(Math.max(currentMonth, 3), 12);
    for (let m = 1; m <= maxMonth; m++) {
      targetMonths.push({ month: m, year: evaluationYear });
    }

    members.forEach((member) => {
      if (member.status !== 'active') return;

      const unpaid: { month: number; year: number; monthName: string; fee: number }[] = [];

      targetMonths.forEach((target) => {
        // Only evaluate if member joined before or in this month
        const [joinYear, joinMonth] = member.joining_date.split('-').map(Number);
        if (joinYear > target.year || (joinYear === target.year && joinMonth > target.month)) {
          return;
        }

        const isPaid = contributions.some(
          (c) =>
            c.member_id === member.id &&
            Number(c.month) === target.month &&
            Number(c.year) === target.year
        );

        if (!isPaid) {
          unpaid.push({
            month: target.month,
            year: target.year,
            monthName: BANGLA_MONTHS[target.month],
            fee: member.monthly_fee,
          });
        }
      });

      if (unpaid.length > 0) {
        list.push({
          member,
          unpaidMonths: unpaid,
          totalDueAmount: unpaid.reduce((acc, item) => acc + item.fee, 0),
        });
      }
    });

    return list.sort((a, b) => b.totalDueAmount - a.totalDueAmount);
  }, [members, contributions, currentMonth]);

  const totalDuesAmount = useMemo(() => {
    return duesList.reduce((acc, item) => acc + item.totalDueAmount, 0);
  }, [duesList]);

  const membersWithDuesCount = duesList.length;

  return (
    <AppContext.Provider
      value={{
        members,
        contributions,
        incomeList,
        expenses,
        categories,
        users,
        logs,
        settings,
        currentUser,
        currentTab,
        selectedMemberId,
        activeModal,
        editingItem,
        toast,

        setCurrentTab,
        setSelectedMemberId,
        openModal,
        closeModal,
        showToast,

        login,
        switchUser,
        canEdit,
        isAdmin,

        addMember,
        updateMember,
        deleteMember,

        addContribution,
        updateContribution,
        deleteContribution,

        addIncome,
        updateIncome,
        deleteIncome,

        addExpense,
        updateExpense,
        deleteExpense,

        addCategory,
        deleteCategory,
        updateSettings,

        exportBackupJSON,
        importBackupJSON,
        resetDataToDefault,

        totalMembersCount,
        activeMembersCount,
        allTimeContributions,
        thisMonthContributions,
        allTimeOtherIncome,
        totalIncome,
        allTimeExpenses,
        thisMonthExpenses,
        currentBalance,
        duesList,
        totalDuesAmount,
        membersWithDuesCount,
        membersMap,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
