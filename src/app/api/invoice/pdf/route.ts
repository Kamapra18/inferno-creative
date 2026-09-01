import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoice/InvoicePDF";
import { InvoiceData } from "@/types/invoice";
import {
  extractField,
  extractNumber,
  getInvoiceNumber,
} from "@/lib/invoice/utils";
import React from "react";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // 1. Validasi API Key
    const apiKey = req.headers.get("x-api-key");
    const validApiKey =
      process.env.INVOICE_API_KEY || "InfernoInvoice2026Secret";

    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Parse Body
    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid invoice data" },
        { status: 400 },
      );
    }

    // 3. Extract and normalize date for Invoice Number
    const bookingDateRaw = extractField(
      body,
      ["tanggal", "event_date", "tanggal_kegiatan", "TanggalEvent", "tanggalEvent", "tanggalevent"],
      "",
    );

    if (!bookingDateRaw || bookingDateRaw === "-") {
      return NextResponse.json(
        { success: false, message: "Invalid booking date" },
        { status: 400 },
      );
    }

    let invoiceNumber = extractField(
      body,
      ["invoice_number", "no_inv", "nomor_invoice", "invoiceNumber", "nomorInvoice"],
      ""
    );

    if (!invoiceNumber || invoiceNumber === "-") {
      invoiceNumber = getInvoiceNumber(bookingDateRaw) || "";
    }

    if (!invoiceNumber) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date format" },
        { status: 400 },
      );
    }

    // 4. Hitung nominal (prioritaskan baseHarga yang merupakan harga asli paket sebelum DP)
    const harga = extractNumber(body, [
      "baseHarga",
      "base_harga",
      "harga",
      "unit_price",
      "harga_satuan",
      "total_price",
    ]);
    const subtotal = extractNumber(
      body,
      ["subtotal"],
      harga,
    );
    const discount = extractNumber(body, ["discount", "diskon"]);

    const paymentStatus = extractField(
      body,
      ["payment_status", "status_pembayaran", "statusPembayaran", "status pembayaran"],
      "UNPAID"
    );

    let calculatedTotal = Math.max(subtotal - discount, 0);
    if (paymentStatus.toUpperCase() === "DP") {
      calculatedTotal = calculatedTotal / 2;
    }

    const total = extractNumber(
      body,
      ["total", "grand_total", "total_pembayaran"],
      calculatedTotal,
    );

    const paketValue = extractField(
      body,
      ["paket", "package_name", "paket_photobooth", "KategoriJasa", "kategoriJasa", "kategori_jasa"],
      "-"
    );

    let defaultDuration = "-";
    let defaultPrintCapacity = "-";

    const p = paketValue.toLowerCase();
    if (p.includes("prewedding foto & video")) {
      defaultDuration = "5 Jam";
    } else if (p.includes("prewedding foto") || p.includes("prewedding video")) {
      defaultDuration = "3 Jam";
    } else if (p.includes("dokumentasi wedding") || p.includes("dokumentasi event")) {
      defaultDuration = "6 Jam";
    } else if (p.includes("photobooth basic digital") || p.includes("photobooth basic print")) {
      defaultDuration = "2 Jam";
      if (p.includes("print")) defaultPrintCapacity = "300 Print";
    } else if (p.includes("photobooth eksklusif digital") || p.includes("photobooth eksklusif print")) {
      defaultDuration = "5 Jam";
      if (p.includes("print")) defaultPrintCapacity = "500 Print";
    }

    // 5. Map the rest of the data
    const invoiceData: InvoiceData = {
      invoice_number: invoiceNumber,
      invoice_date: extractField(
        body,
        ["invoice_date", "tanggal_invoice"],
        new Date().toISOString().split("T")[0]
      ),
      payment_deadline: extractField(
        body,
        ["payment_deadline", "batas_pembayaran"],
        bookingDateRaw
      ),
      payment_status: paymentStatus,

      nama: extractField(body, ["nama", "customer_name", "nama_customer", "Nama Client", "namaClient", "nama_client"]),
      email: extractField(body, ["email", "customer_email", "Email"]),
      tanggal: bookingDateRaw,
      jam: extractField(body, ["jam", "start_time", "mulai_jam", "JamEvent", "jamEvent"]),
      lokasi: extractField(body, ["lokasi", "location", "lokasi_kegiatan", "Lokasi"]),

      paket: paketValue,
      duration: extractField(body, ["duration", "durasi"], defaultDuration),
      print_capacity: extractField(body, ["print_capacity", "kapasitas_print"], defaultPrintCapacity),

      harga,
      subtotal,
      discount,
      total,
    };

    // Read logo image
    const logoPath = path.join(process.cwd(), "public", "logo", "Asset-2.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      invoiceData.logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    // 6. Generate PDF Stream
    const stream = await renderToStream(
      React.createElement(InvoicePDF, { data: invoiceData }) as any,
    );

    // Convert Node stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    // 6. Return PDF Response
    const filename = `invoice-${invoiceNumber}.pdf`;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice PDF" },
      { status: 500 },
    );
  }
}

// Menolak method lain
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 },
  );
}
export async function PUT() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 },
  );
}
export async function DELETE() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 },
  );
}
