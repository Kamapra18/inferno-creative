import { parse, isValid, format } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseIndonesianDateToYYYYMMDD(dateString: string | undefined): string | null {
  if (!dateString) return null;
  const str = dateString.trim();

  // If already YYYYMMDD
  if (/^\d{8}$/.test(str)) {
    return str;
  }

  const formats = [
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'dd-MM-yyyy',
    'd MMMM yyyy', // e.g., 30 Agustus 2026
    'dd MMMM yyyy',
    'd MMM yyyy',
    'dd MMM yyyy',
  ];

  for (const fmt of formats) {
    const parsed = parse(str, fmt, new Date(), { locale: id });
    if (isValid(parsed)) {
      return format(parsed, 'yyyyMMdd');
    }
  }

  // Fallback: simple extraction if standard formats fail
  // e.g. handle 30 Agustus 2026 manually
  const parts = str.split(/[\s\-/]+/);
  if (parts.length === 3) {
    let day = parts[0];
    let month = parts[1];
    let year = parts[2];

    // If year is first (YYYY-MM-DD)
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    }

    // Convert string month to number
    const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    const monthIndex = monthNames.findIndex((m) => month.toLowerCase().startsWith(m.substring(0, 3)));
    if (monthIndex !== -1) {
      month = String(monthIndex + 1);
    }

    day = day.padStart(2, '0');
    month = month.padStart(2, '0');

    if (year.length === 4 && month.length === 2 && day.length === 2) {
      const manualDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(manualDate.getTime())) {
         return `${year}${month}${day}`;
      }
    }
  }

  return null;
}

export function getInvoiceNumber(bookingDateStr: string | undefined): string | null {
  const yyyymmdd = parseIndonesianDateToYYYYMMDD(bookingDateStr);
  if (!yyyymmdd) return null;
  return `INV-INF-${yyyymmdd}`;
}

export function extractField(body: any, keys: string[], defaultValue: string = '-'): string {
  for (const key of keys) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      return String(body[key]);
    }
  }
  return defaultValue;
}

export function extractNumber(body: any, keys: string[], defaultValue: number = 0): number {
  for (const key of keys) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      const val = Number(body[key]);
      if (!isNaN(val)) return val;
    }
  }
  return defaultValue;
}
