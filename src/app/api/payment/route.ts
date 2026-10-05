import { NextResponse } from "next/server";
import { createDokuCheckoutSession, sanitizeDokuField } from "@/lib/doku";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      grossAmount,
      customerName,
      customerEmail,
      customerPhone,
      itemName,
      tipePembayaran = "Lunas",
      callbackUrl,
    } = body;

    if (!orderId || !grossAmount) {
      return NextResponse.json(
        { error: "Parameter orderId dan grossAmount wajib diisi." },
        { status: 400 }
      );
    }

    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "www.inferno-production.com";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;

    // Pastikan callbackUrl adalah URL path bersih tanpa karakter '?' atau '&'
    const cleanCallbackUrl =
      callbackUrl && !callbackUrl.includes("?")
        ? callbackUrl
        : `${origin}/booking/success/${orderId}`;

    const cleanPhone = (customerPhone || "").replace(/[^0-9]/g, "");
    const cleanEmail =
      customerEmail && customerEmail.includes("@")
        ? customerEmail.replace(/[^a-zA-Z0-9.@_-]/g, "")
        : "customer@inferno-production.com";

    const cleanItemName = sanitizeDokuField(itemName || "Layanan Inferno").replace(/&/g, "dan");

    const session = await createDokuCheckoutSession({
      invoiceNumber: orderId,
      amount: Math.round(Number(grossAmount)),
      currency: "IDR",
      callbackUrl: cleanCallbackUrl,
      autoRedirect: true,
      lineItems: [
        {
          name: `${cleanItemName} (${tipePembayaran})`,
          price: Math.round(Number(grossAmount)),
          quantity: 1,
        },
      ],
      customer: {
        name: sanitizeDokuField(customerName || "Pelanggan Inferno"),
        email: cleanEmail,
        phone: cleanPhone || "081234567890",
      },
      paymentDueDateMinutes: 60,
    });

    return NextResponse.json({
      success: true,
      payment_url: session.paymentUrl,
      invoice_number: session.invoiceNumber,
    });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Gagal membuat transaksi DOKU Checkout",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
