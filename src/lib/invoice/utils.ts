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
  // Hanya menghasilkan 4 digit angka acak (contoh: INV-INF-4921)
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `INV-INF-${uniqueSuffix}`;
}

export function extractField(body: any, keys: string[], defaultValue: string = '-'): string {
  if (typeof body !== 'object' || body === null) return defaultValue;
  
  const lowerKeys = keys.map(k => k.toLowerCase());
  const bodyKeys = Object.keys(body);
  
  // Find a matching key in body (case-insensitive)
  for (const lowerKey of lowerKeys) {
    const actualKey = bodyKeys.find(k => k.toLowerCase() === lowerKey);
    if (actualKey && body[actualKey] !== undefined && body[actualKey] !== null && body[actualKey] !== '') {
      return String(body[actualKey]);
    }
  }
  
  return defaultValue;
}

/**
 * Parse angka dari nilai yang bisa berupa number atau string berformat
 * mata uang, mis. "Rp 1.500.000", "1.500.000,50", "1,500,000", "Rp1500000".
 * Return null kalau tidak ada angka yang bisa diambil.
 */
export function parseCurrencyValue(raw: unknown): number | null {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw !== 'string') return null;

  // Buang semua kecuali digit, pemisah, dan tanda minus
  let str = raw.replace(/[^0-9.,-]/g, '').trim();
  if (!str) return null;

  const negative = str.startsWith('-');
  str = str.replace(/-/g, '');
  if (!str) return null;

  const lastDot = str.lastIndexOf('.');
  const lastComma = str.lastIndexOf(',');

  if (lastDot !== -1 && lastComma !== -1) {
    // Dua-duanya ada: yang paling belakang adalah pemisah desimal
    const decimalSep = lastDot > lastComma ? '.' : ',';
    const thousandSep = decimalSep === '.' ? ',' : '.';
    str = str.split(thousandSep).join('');
    str = str.replace(decimalSep, '.');
  } else if (lastDot !== -1 || lastComma !== -1) {
    const sep = lastDot !== -1 ? '.' : ',';
    const parts = str.split(sep);
    const decimals = parts[parts.length - 1];
    // Lebih dari satu pemisah, atau tepat 3 digit di belakang
    // (mis. "1.500" / "1,500") -> pemisah ribuan, bukan desimal.
    if (parts.length > 2 || decimals.length === 3) {
      str = parts.join('');
    } else {
      str = parts.slice(0, -1).join('') + '.' + decimals;
    }
  }

  if (!/^\d*\.?\d+$/.test(str)) return null;

  const val = Number(str);
  if (!Number.isFinite(val)) return null;
  return negative ? -val : val;
}

export function extractNumber(body: any, keys: string[], defaultValue: number = 0): number {
  if (typeof body !== 'object' || body === null) return defaultValue;
  
  const lowerKeys = keys.map(k => k.toLowerCase());
  const bodyKeys = Object.keys(body);

  for (const lowerKey of lowerKeys) {
    const actualKey = bodyKeys.find(k => k.toLowerCase() === lowerKey);
    if (actualKey && body[actualKey] !== undefined && body[actualKey] !== null && body[actualKey] !== '') {
      const val = parseCurrencyValue(body[actualKey]);
      if (val !== null) return val;
    }
  }
  return defaultValue;
}
