import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import InvoicePDF from '@/components/invoice/InvoicePDF';
import { InvoiceData } from '@/types/invoice';
import React from 'react';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Only available in development mode', { status: 403 });
  }

  const dummyData: InvoiceData = {
    invoice_number: 'INV-INF-20260830',
    invoice_date: '24 Agustus 2026',
    payment_deadline: '25 Agustus 2026',
    payment_status: 'DP',
    nama: 'Budi Santoso',
    email: 'budi@gmail.com',
    tanggal: '30 Agustus 2026',
    jam: '18:00',
    lokasi: 'Seminyak, Bali',
    paket: 'Paket Standard 5 Jam',
    duration: '5 Jam',
    print_capacity: 'Up to 600 Print',
    harga: 2000000,
    subtotal: 2000000,
    discount: 0,
    total: 2000000,
  };

  try {
    // Read logo image
    const logoPath = path.join(process.cwd(), 'public', 'logo', 'Asset-2.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      dummyData.logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }

    const stream = await renderToStream(React.createElement(InvoicePDF, { data: dummyData }) as any);
    
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating preview PDF:', error);
    return new NextResponse('Failed to generate preview PDF', { status: 500 });
  }
}
