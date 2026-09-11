import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, grossAmount, customerName, customerEmail, customerPhone, itemName } = body;

    if (!orderId || !grossAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("XENDIT_SECRET_KEY is not set in environment variables");
    }

    // Menggunakan Fetch API langsung ke Xendit untuk menghindari isu versi SDK
    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        external_id: orderId,
        amount: Math.round(grossAmount),
        payer_email: customerEmail || "no-email@example.com",
        description: `Booking: ${itemName}`,
        customer: {
          given_names: customerName,
          email: customerEmail || "no-email@example.com",
          mobile_number: customerPhone,
        },
        // Anda bisa menentukan halaman sukses kemana user dikembalikan setelah bayar
        // success_redirect_url: "https://domainanda.com/success",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Xendit API Error:", data);
      throw new Error(data.message || "Failed to create invoice");
    }

    return NextResponse.json({
      invoice_url: data.invoice_url,
    });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: "Failed to create payment transaction", details: error.message },
      { status: 500 }
    );
  }
}
