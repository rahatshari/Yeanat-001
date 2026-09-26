const banglaDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const englishDigits: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export const BANGLA_MONTHS: Record<number, string> = {
  1: 'জানুয়ারি',
  2: 'ফেব্রুয়ারি',
  3: 'মার্চ',
  4: 'এপ্রিল',
  5: 'মে',
  6: 'জুন',
  7: 'জুলাই',
  8: 'আগস্ট',
  9: 'সেপ্টেম্বর',
  10: 'অক্টোবর',
  11: 'নভেম্বর',
  12: 'ডিসেম্বর',
};

export const PAYMENT_METHODS = {
  cash: 'নগদ',
  bank: 'ব্যাংক',
  mobile_banking: 'মোবাইল ব্যাংকিং',
  other: 'অন্যান্য',
} as const;

export const ROLE_NAMES = {
  admin: 'এডমিন (সর্বোচ্চ ক্ষমতা)',
  accountant: 'হিসাবরক্ষক (তথ্য যোগ/সম্পাদনা)',
  viewer: 'দর্শক (শুধু দেখার অনুমতি)',
} as const;

export function toBanglaNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return '০';
  const str = value.toString();
  return str.replace(/[0-9]/g, (match) => banglaDigits[match] || match);
}

export function toBanglaCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '৳ ০';
  const num = Math.round(Number(value));
  const formatted = num.toLocaleString('en-IN');
  return `৳ ${toBanglaNumber(formatted)}`;
}

export function formatBanglaDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      const monthNum = parseInt(month, 10);
      const monthName = BANGLA_MONTHS[monthNum] || month;
      return `${toBanglaNumber(parseInt(day, 10))} ${monthName}, ${toBanglaNumber(year)}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const m = d.getMonth() + 1;
    return `${toBanglaNumber(d.getDate())} ${BANGLA_MONTHS[m]}, ${toBanglaNumber(d.getFullYear())}`;
  } catch {
    return dateStr;
  }
}

export function formatBanglaDateTime(isoStr: string | undefined): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const m = d.getMonth() + 1;
    const datePart = `${toBanglaNumber(d.getDate())} ${BANGLA_MONTHS[m]}, ${toBanglaNumber(d.getFullYear())}`;
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'বিকাল/রাত' : 'সকাল';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${datePart} (${ampm} ${toBanglaNumber(hours)}:${toBanglaNumber(minutes)})`;
  } catch {
    return isoStr;
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}
