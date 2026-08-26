export interface InvoiceData {
  invoice_number?: string;
  invoice_date?: string;
  payment_deadline?: string;
  payment_status?: string;

  nama?: string;
  email?: string;
  tanggal?: string;
  jam?: string;
  lokasi?: string;

  paket?: string;
  duration?: string;
  print_capacity?: string;

  harga?: number;
  subtotal?: number;
  discount?: number;
  total?: number;

  logoBase64?: string;
}
