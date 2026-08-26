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
      ["tanggal", "event_date", "tanggal_kegiatan"],
      "",
    );

    if (!bookingDateRaw || bookingDateRaw === "-") {
      return NextResponse.json(
        { success: false, message: "Invalid booking date" },
        { status: 400 },
      );
    }

    const invoiceNumber = getInvoiceNumber(bookingDateRaw);

    if (!invoiceNumber) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date format" },
        { status: 400 },
      );
    }

    // 4. Hitung nominal (harga bisa dikirim sebagai "Rp 1.500.000")
    const harga = extractNumber(body, [
      "harga",
      "unit_price",
      "harga_satuan",
      "total_price",
    ]);
    const subtotal = extractNumber(
      body,
      ["subtotal", "harga", "total_price"],
      harga,
    );
    const discount = extractNumber(body, ["discount", "diskon"]);
    const total = extractNumber(
      body,
      ["total", "grand_total", "total_pembayaran"],
      Math.max(subtotal - discount, 0),
    );

    // 5. Map the rest of the data
    const invoiceData: InvoiceData = {
      invoice_number: invoiceNumber,
      invoice_date: extractField(body, ["invoice_date", "tanggal_invoice"]),
      payment_deadline: extractField(body, [
        "payment_deadline",
        "batas_pembayaran",
      ]),
      payment_status: extractField(body, [
        "payment_status",
        "status_pembayaran",
      ]),

      nama: extractField(body, ["nama", "customer_name", "nama_customer"]),
      email: extractField(body, ["email", "customer_email"]),
      tanggal: bookingDateRaw,
      jam: extractField(body, ["jam", "start_time", "mulai_jam"]),
      lokasi: extractField(body, ["lokasi", "location", "lokasi_kegiatan"]),

      paket: extractField(
        body,
        ["paket", "package_name", "paket_photobooth"],
        "Paket Basic 4 Jam",
      ),
      duration: extractField(body, ["duration", "durasi"]),
      print_capacity: extractField(body, ["print_capacity", "kapasitas_print"]),

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
