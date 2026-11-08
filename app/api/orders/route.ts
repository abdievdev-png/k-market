import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = body?.customer;
    const items = body?.items;
    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city || !customer?.country) {
      return NextResponse.json({ error: "Ism, telefon va manzilni to‘liq kiriting." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: "Savat bo‘sh yoki mahsulotlar soni noto‘g‘ri." }, { status: 400 });
    }
    for (const item of items) {
      if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
        return NextResponse.json({ error: "Mahsulot miqdori noto‘g‘ri." }, { status: 400 });
      }
    }

    const orderId = crypto.randomUUID();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      // Demo mode: acknowledge that form validation worked, but do not pretend this is a saved order.
      return NextResponse.json({
        error: "Buyurtma bazaga saqlanmadi: Supabase sozlanmagan. .env.local fayliga Supabase URL va server-side service key kiriting."
      }, { status: 503 });
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { error } = await supabase.from("orders").insert({
      id: orderId,
      customer_name: String(customer.name).slice(0, 120),
      phone: String(customer.phone).slice(0, 40),
      email: customer.email ? String(customer.email).slice(0, 200) : null,
      address: String(customer.address).slice(0, 500),
      city: String(customer.city).slice(0, 120),
      country: String(customer.country).slice(0, 80),
      market: body.market === "KR" ? "KR" : "UZ",
      currency: body.currency === "KRW" ? "KRW" : "UZS",
      delivery: body.delivery === "pickup" ? "pickup" : "standard",
      items: items,
      status: "pending_payment"
    });
    if (error) {
      console.error("Order insert failed", error.message);
      return NextResponse.json({ error: "Buyurtma saqlanmadi. Ma’lumotlar bazasi sozlamalarini tekshiring." }, { status: 500 });
    }
    // Payment intentionally not marked paid here. Payment status must be verified server-to-server
    // using the selected provider's official API/webhook before fulfilling an order.
    return NextResponse.json({ orderId, status: "pending_payment", paymentEnabled: false }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "So‘rovni o‘qib bo‘lmadi." }, { status: 400 });
  }
}