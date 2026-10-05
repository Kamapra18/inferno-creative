export type BookingTerdaftar = {
  tanggalEvent: string;
  kategoriJasa: string;
};

export const KATEGORI_BOOKING = [
  { value: "Prewedding Foto", harga: "Rp 1.500.000" },
  { value: "Prewedding Video", harga: "Rp 1.500.000" },
  { value: "Prewedding Foto & Video", harga: "Rp 3.000.000" },
  { value: "Dokumentasi Wedding", harga: "Rp 1.500.000" },
  { value: "Dokumentasi Event", harga: "Rp 1.500.000" },
  { value: "Photobooth Softcopy 2 Jam", harga: "Rp 800.000" },
  { value: "Photobooth Softcopy 3 Jam", harga: "Rp 1.100.000" },
  { value: "Photobooth Softcopy 4 Jam", harga: "Rp 1.400.000" },
  { value: "Photobooth Softcopy 5 Jam", harga: "Rp 1.800.000" },
  { value: "Photobooth Limited Print 2 Jam", harga: "Rp 1.200.000" },
  { value: "Photobooth Limited Print 3 Jam", harga: "Rp 1.500.000" },
  { value: "Photobooth Limited Print 4 Jam", harga: "Rp 1.800.000" },
  { value: "Photobooth Limited Print 5 Jam", harga: "Rp 2.200.000" },
  { value: "Photobooth Unlimited Print 2 Jam", harga: "Rp 1.500.000" },
  { value: "Photobooth Unlimited Print 3 Jam", harga: "Rp 1.800.000" },
  { value: "Photobooth Unlimited Print 4 Jam", harga: "Rp 2.200.000" },
  { value: "Photobooth Unlimited Print 5 Jam", harga: "Rp 2.500.000" },
  { value: "Undangan Online Premium", harga: "Rp 300.000" },
  { value: "Undangan Online Eksklusif", harga: "Rp 500.000" },
  { value: "Foto Graduation", harga: "Rp 500.000" },
  { value: "Paket All In One", harga: "Rp 4.000.000" },
];

export function grupKategori(kategori: string) {
  const k = kategori.toLowerCase();
  if (k.includes("foto") || k.includes("video") || k.includes("dokumentasi")) return "fotovideo";
  if (k.includes("photobooth")) return "photobooth";
  if (k.includes("undangan")) return "undangan";
  return "all";
}

export function resolveKategori(service: string | null): { kategori: string; harga: string; paketAsli?: string } {
  const defaultKat = { kategori: KATEGORI_BOOKING[0].value, harga: KATEGORI_BOOKING[0].harga };
  if (!service) return defaultKat;
  
  const s = service.toLowerCase();
  
  // Try exact match first to prevent greedy substring matching
  let match = KATEGORI_BOOKING.find((k) => k.value.toLowerCase() === s);
  
  // Manual mapping for cases where package title differs significantly from options
  if (!match) {
    if (s.includes("photobooth softcopy")) {
      match = KATEGORI_BOOKING.find(k => k.value === "Photobooth Softcopy 2 Jam");
    }
  }

  // Fallback to fuzzy match
  if (!match) {
    match = KATEGORI_BOOKING.find((k) => k.value.toLowerCase().includes(s) || s.includes(k.value.toLowerCase()));
  }
  
  if (match) {
    return { kategori: match.value, harga: match.harga, paketAsli: service };
  }
  
  return { ...defaultKat, paketAsli: service };
}

export function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDateString(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  const s = String(dateStr).trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(s)) {
    const parts = s.split(/[\/\-]/);
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2];
    return `${y}-${m}-${d}`;
  }
  return s;
}

export function isTanggalPenuh(bookings: BookingTerdaftar[], tanggal: string, grupAktif: string) {
  if (grupAktif === "undangan") return false; // undangan ga ada batasnya

  const normalizedTanggal = normalizeDateString(tanggal);

  // Hitung jumlah pemakaian booking di tanggal tersebut
  let countFotoVideo = 0;
  let countPhotobooth = 0;
  let countAllInOne = 0;

  for (const b of bookings) {
    if (normalizeDateString(b.tanggalEvent) === normalizedTanggal) {
      const grup = grupKategori(b.kategoriJasa);
      if (grup === "fotovideo") {
        countFotoVideo++;
      } else if (grup === "photobooth") {
        countPhotobooth++;
      } else if (grup === "all") {
        countAllInOne++;
      }
    }
  }

  // Aturan kuota:
  // - Foto & Video: 2 slot per hari
  // - Photobooth: 1 slot per hari
  // - Paket All In One: mencakup 1 slot Photobooth dan 1 slot Foto/Video
  const totalPhotoboothUsed = countPhotobooth + countAllInOne;
  const totalFotoVideoUsed = countFotoVideo + countAllInOne;

  if (grupAktif === "photobooth") {
    return totalPhotoboothUsed >= 1;
  }

  if (grupAktif === "fotovideo") {
    return totalFotoVideoUsed >= 2;
  }

  if (grupAktif === "all") {
    return countAllInOne >= 1 || totalPhotoboothUsed >= 1 || totalFotoVideoUsed >= 2;
  }

  return false;
}
