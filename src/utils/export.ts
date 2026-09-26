import {
  Member,
  Contribution,
  Income,
  Expense,
  OrganizationSettings,
} from '../types';
import { BANGLA_MONTHS, PAYMENT_METHODS } from './bangla';

export function downloadCSV(filename: string, rows: (string | number)[][]): void {
  // Add UTF-8 BOM so Microsoft Excel correctly renders Bengali script
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    rows
      .map((row) =>
        row
          .map((item) => {
            const str = item === null || item === undefined ? '' : String(item);
            // Escape double quotes
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportMembersToCSV(members: Member[]): void {
  const headers = ['সদস্য নম্বর', 'নাম', 'মোবাইল নম্বর', 'ঠিকানা', 'মাসিক চাঁদা (টাকা)', 'যোগদানের তারিখ', 'স্ট্যাটাস'];
  const rows = members.map((m) => [
    m.member_id,
    m.name,
    m.phone,
    m.address || '',
    m.monthly_fee,
    m.joining_date,
    m.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়',
  ]);

  downloadCSV(`সদস্য_তালিকা_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}

export function exportContributionsToCSV(
  contributions: Contribution[],
  membersMap: Map<string, Member>
): void {
  const headers = [
    'রসিদ/আইডি',
    'সদস্য নম্বর',
    'সদস্যের নাম',
    'মাস',
    'বছর',
    'জমার পরিমাণ (টাকা)',
    'পেমেন্ট পদ্ধতি',
    'জমার তারিখ',
    'ট্রানজেকশন আইডি',
    'মন্তব্য',
  ];

  const rows = contributions.map((c) => {
    const member = membersMap.get(c.member_id);
    return [
      c.id,
      member?.member_id || '',
      member?.name || '',
      BANGLA_MONTHS[c.month] || c.month,
      c.year,
      c.amount,
      PAYMENT_METHODS[c.payment_method] || c.payment_method,
      c.payment_date,
      c.transaction_id || '',
      c.note || '',
    ];
  });

  downloadCSV(`চাঁদা_জমা_তালিকা_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}

export function exportIncomeToCSV(incomeList: Income[]): void {
  const headers = ['তারিখ', 'আয়ের খাত', 'উৎস/দাতার নাম', 'টাকার পরিমাণ (টাকা)', 'রসিদ/ভাউচার নম্বর', 'মন্তব্য'];
  const rows = incomeList.map((inc) => [
    inc.date,
    inc.category,
    inc.source,
    inc.amount,
    inc.transaction_id || '',
    inc.note || '',
  ]);

  downloadCSV(`অন্যান্য_আয়_তালিকা_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}

export function exportExpensesToCSV(expenses: Expense[]): void {
  const headers = [
    'তারিখ',
    'খরচের খাত',
    'বিবরণ',
    'প্রাপক (যাকে প্রদান)',
    'টাকার পরিমাণ (টাকা)',
    'ভাউচার নম্বর',
    'মন্তব্য',
  ];
  const rows = expenses.map((exp) => [
    exp.date,
    exp.category,
    exp.description,
    exp.recipient,
    exp.amount,
    exp.voucher_no || '',
    exp.note || '',
  ]);

  downloadCSV(`খরচ_তালিকা_${new Date().toISOString().split('T')[0]}`, [headers, ...rows]);
}

export function exportFullFinancialStatementCSV(
  settings: OrganizationSettings,
  fromDate: string,
  toDate: string,
  openingBalance: number,
  contributionsTotal: number,
  otherIncomeTotal: number,
  totalIncome: number,
  expensesTotal: number,
  currentBalance: number,
  categoryExpenses: { category: string; amount: number }[]
): void {
  const rows: (string | number)[][] = [
    [settings.org_name],
    [settings.tagline],
    [`আয়-ব্যয় হিসাব রিপোর্ট (সময়কাল: ${fromDate} হতে ${toDate})`],
    [''],
    ['সারসংক্ষেপ বিবরণ', 'টাকা'],
    ['প্রারম্ভিক ব্যালেন্স (পূর্বের জের)', openingBalance],
    ['মোট সদস্য চাঁদা আদায়', contributionsTotal],
    ['অন্যান্য মোট অনুদান ও আয়', otherIncomeTotal],
    ['সর্বমোট অর্জিত আয়', totalIncome],
    ['সর্বমোট মোট খরচ', expensesTotal],
    ['সর্বশেষ মোট স্থিতি (বর্তমান ব্যালেন্স)', currentBalance],
    [''],
    ['খরচের খাতসমূহ অনুযায়ী বিভাজন', 'পরিমাণ (টাকা)'],
  ];

  categoryExpenses.forEach((cat) => {
    rows.push([cat.category, cat.amount]);
  });

  downloadCSV(`সম্পূর্ণ_আয়_ব্যয়_হিসাব_${fromDate}_to_${toDate}`, rows);
}
