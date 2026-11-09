
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products, formatMoney } from "../products";

function CheckoutForm() {
  const params = useSearchParams();
  const market = params.get("market") === "KR" ? "KR" : "UZ";

  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(
    market === "KR" ? "South Korea" : "Uzbekistan"
  );
  const [delivery, setDelivery] = useState("standard");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  // Savatdagi mahsulotlarni brauzerdan yuklaymiz.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("seoul-cart") || "{}");
      setCart(saved);
    } catch {
      setCart({});
    }
  }, []);

  // Savatdagi mahsulotlar ro‘yxati.
  const items = useMemo(
    () =>
      products
        .filter((p) => (cart[p.id] || 0) > 0)
        .map((p) => ({ product: p, quantity: cart[p.id] })),
    [cart]
  );

  // Har bir valyutani alohida hisoblaymiz.
  const totals = items.reduce(
    (result, item) => {
      const currency = item.product.currency;
      result[currency] =
        (result[currency] || 0) +
        item.product.price * item.quantity;
      return result;
    },
    {} as Record<string, number>
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Mahsulot sonini o‘zgartirish.
  function changeQuantity(id: number, amount: number) {
    const next = { ...cart };
    const newQuantity = (next[id] || 0) + amount;

    if (newQuantity <= 0) {
      delete next[id];
    } else {
      next[id] = newQuantity;
    }

    setCart(next);
    localStorage.setItem("seoul-cart", JSON.stringify(next));
  }

  // Buyurtmani serverga yuborish.
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (items.length === 0) {
      setMessage("Savatda mahsulot yo‘q.");
      return;
    }

    setBusy(true);
    setMessage("");
    setSuccess(false);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, email, address, city, country },
          market,
          currency: market === "KR" ? "KRW" : "UZS",
          delivery,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Buyurtmani yuborib bo‘lmadi.");
      }

      setMessage("Buyurtmangiz qabul qilindi!");
      setSuccess(true);
      localStorage.removeItem("seoul-cart");
      setCart({});
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Xatolik yuz berdi."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="checkoutPage">
      <header className="checkoutHeader">
        <Link href="/" className="checkoutLogo">
          K<span>·</span>MARKET <i>✿</i>
        </Link>
        <Link href="/" className="backLink">
          ← Xaridni davom ettirish
        </Link>
      </header>

      <div className="checkoutContainer">
        <div className="checkoutIntro">
          <div>
            <span className="eyebrow">K·MARKET / CHECKOUT</span>
            <h1>Buyurtmani rasmiylashtirish</h1>
            <p>Yana bir qadam — mahsulotlaringiz sizniki!</p>
          </div>
          <div className="secureLabel">♡ Xavfsiz buyurtma</div>
        </div>

        {success ? (
          <section className="successCard">
            <div className="successIcon">✓</div>
            <h2>Rahmat! Buyurtmangiz qabul qilindi.</h2>
            <p>{message}</p>
            <p className="successInfo">
              Buyurtma raqami: <b>{String(message).split(": ").pop()}</b>
            </p>
            <p className="smallNote">
              Hozircha onlayn to‘lov ulanmagan. Do‘kon egasi buyurtmani
              tasdiqlashi kerak.
            </p>
            <Link href="/" className="mainButton">
              Bosh sahifaga qaytish
            </Link>
          </section>
        ) : (
          <>
            {message && <div className="errorMessage">{message}</div>}

            <div className="checkoutGrid">
              <form className="checkoutForm" onSubmit={submit}>
                <section className="formCard">
                  <div className="sectionHeading">
                    <span className="stepNumber">01</span>
                    <div>
                      <h2>Shaxsiy ma’lumotlar</h2>
                      <p>Buyurtma kim uchun?</p>
                    </div>
                  </div>

                  <div className="fieldsGrid">
                    <label>
                      Ism-familiya *
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ismingizni kiriting"
                        autoComplete="name"
                      />
                    </label>

                    <label>
                      Telefon raqami *
                      <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+82 yoki +998"
                        autoComplete="tel"
                      />
                    </label>

                    <label className="fullField">
                      Email manzil
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                </section>

                <section className="formCard">
                  <div className="sectionHeading">
                    <span className="stepNumber">02</span>
                    <div>
                      <h2>Yetkazib berish manzili</h2>
                      <p>Mahsulotlaringiz qayerga yetkazilsin?</p>
                    </div>
                  </div>

                  <div className="fieldsGrid">
                    <label>
                      Mamlakat *
                      <select
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="Uzbekistan">🇺🇿 Uzbekistan</option>
                        <option value="South Korea">🇰🇷 South Korea</option>
                      </select>
                    </label>

                    <label>
                      Shahar *
                      <input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Shahar nomi"
                        autoComplete="address-level2"
                      />
                    </label>

                    <label className="fullField">
                      To‘liq manzil *
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ko‘cha, uy, xonadon..."
                        autoComplete="street-address"
                      />
                    </label>
                  </div>
                </section>

                <section className="formCard">
                  <div className="sectionHeading">
                    <span className="stepNumber">03</span>
                    <div>
                      <h2>Yetkazib berish turi</h2>
                      <p>O‘zingizga qulay usulni tanlang.</p>
                    </div>
                  </div>

                  <div className="deliveryOptions">
                    <label className={delivery === "standard" ? "deliveryOption selected" : "deliveryOption"}>
                      <input
                        type="radio"
                        name="delivery"
                        value="standard"
                        checked={delivery === "standard"}
                        onChange={(e) => setDelivery(e.target.value)}
                      />
                      <span className="deliveryEmoji">🚚</span>
                      <span>
                        <b>Oddiy yetkazib berish</b>
                        <small>Narxi va muddati keyin tasdiqlanadi</small>
                      </span>
                    </label>

                    <label className={delivery === "pickup" ? "deliveryOption selected" : "deliveryOption"}>
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={delivery === "pickup"}
                        onChange={(e) => setDelivery(e.target.value)}
                      />
                      <span className="deliveryEmoji">📍</span>
                      <span>
                        <b>O‘zim olib ketaman</b>
                        <small>Agar olib ketish xizmati mavjud bo‘lsa</small>
                      </span>
                    </label>
                  </div>
                </section>

                <section className="formCard">
                  <div className="sectionHeading">
                    <span className="stepNumber">04</span>
                    <div>
                      <h2>Qo‘shimcha izoh</h2>
                      <p>Buyurtmangiz haqida qo‘shimcha ma’lumot.</p>
                    </div>
                  </div>

                  <textarea
                    className="noteInput"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Masalan: yetkazib berish bo‘yicha izoh..."
                  />
                </section>

                <button
                  className="mainButton submitButton"
                  disabled={busy || items.length === 0}
                  type="submit"
                >
                  {busy ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash →"}
                </button>

                <p className="privacyNote">
                  🔒 Ma’lumotlaringiz faqat buyurtmani rasmiylashtirish uchun
                  ishlatiladi.
                </p>
              </form>

              <aside className="orderCard">
                <div className="orderCardTitle">
                  <div>
                    <h2>Buyurtmangiz</h2>
                    <p>{itemCount} ta mahsulot</p>
                  </div>
                  <span className="bagIcon">🛍️</span>
                </div>

                {items.length === 0 ? (
                  <div className="emptyCart">
                    <div>🛒</div>
                    <h3>Savatingiz bo‘sh</h3>
                    <p>Buyurtma berish uchun mahsulot tanlang.</p>
                    <Link href="/" className="continueLink">
                      Mahsulotlarni ko‘rish
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="orderItems">
                      {items.map(({ product, quantity }) => (
                        <div className="orderItem" key={product.id}>
                          <div className="productPicture">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <span>{product.emoji}</span>
                            )}
                          </div>

                          <div className="productDetails">
                            <b>{product.name}</b>
                            <small>
                              {formatMoney(product.price, product.currency)}
                            </small>
                            <div className="quantityControl">
                              <button
                                type="button"
                                onClick={() => changeQuantity(product.id, -1)}
                                aria-label="Kamaytirish"
                              >
                                −
                              </button>
                              <span>{quantity}</span>
                              <button
                                type="button"
                                onClick={() => changeQuantity(product.id, 1)}
                                aria-label="Ko‘paytirish"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <strong className="itemTotal">
                            {formatMoney(
                              product.price * quantity,
                              product.currency
                            )}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="priceSummary">
                      <div>
                        <span>Mahsulotlar soni</span>
                        <b>{itemCount} ta</b>
                      </div>

                      {/* So‘m va vonni birgalikda ko‘rsatish */}
{(() => {
  const uzs = totals["UZS"] || 0;
  const krw = totals["KRW"] || 0;

  // Taxminiy kurs: 1 KRW = 9 UZS
  const totalUZS = uzs + krw * 9;
  const totalKRW = krw + uzs / 9;

  return (
    <>
      <div>
        <span>🇺🇿 O‘zbekiston so‘mida</span>
        <b>{formatMoney(totalUZS, "UZS")}</b>
      </div>

      <div>
        <span>🇰🇷 Koreya vonida</span>
        <b>{formatMoney(Math.round(totalKRW), "KRW")}</b>
      </div>
    </>
  );
})()}

                      <div className="deliveryPrice">
                        <span>Yetkazib berish</span>
                        <b>Keyin tasdiqlanadi</b>
                      </div>
                    </div>

                    <div className="orderNotice">
                      💗 Buyurtmangiz yuborilgach, do‘kon egasi siz bilan
                      bog‘lanadi.
                    </div>
                  </>
                )}
              </aside>
            </div>
          </>
        )}
      </div>

      <footer className="checkoutFooter">
        <Link href="/">K·MARKET ✿</Link>
        <span>© 2026 K-MARKET · Korea 🇰🇷 ↔ Uzbekistan 🇺🇿</span>
      </footer>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff9fc; color: #302337; }
        .checkoutPage {
          min-height: 100vh;
          font-family: Arial, sans-serif;
          background: linear-gradient(180deg, #fff4fa 0, #fffafd 330px, #fff 100%);
        }
        .checkoutHeader {
          height: 76px; padding: 0 6%;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,.94); border-bottom: 1px solid #f3e6ee;
        }
        .checkoutLogo {
          color: #342139; text-decoration: none; font-size: 23px;
          font-weight: 900; letter-spacing: -1px;
        }
        .checkoutLogo span, .checkoutLogo i { color: #ed4b9b; }
        .checkoutLogo i { font-style: normal; margin-left: 3px; }
        .backLink { color: #8b7183; text-decoration: none; font-size: 14px; }
        .backLink:hover, .continueLink:hover { color: #e43f91; }
        .checkoutContainer { max-width: 1160px; margin: auto; padding: 48px 24px 80px; }
        .checkoutIntro {
          display: flex; justify-content: space-between; align-items: center;
          gap: 20px; margin-bottom: 32px;
        }
        .eyebrow { color: #e34a96; font-size: 11px; font-weight: 800; letter-spacing: 2px; }
        .checkoutIntro h1 { font-size: clamp(27px, 4vw, 39px); margin: 10px 0; letter-spacing: -1.5px; }
        .checkoutIntro p { color: #907e8d; margin: 0; font-size: 14px; }
        .secureLabel {
          background: white; border: 1px solid #f5dce9; color: #bd4d83;
          padding: 12px 17px; border-radius: 30px; font-size: 12px; white-space: nowrap;
        }
        .checkoutGrid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; align-items: start; }
        .checkoutForm { display: grid; gap: 18px; min-width: 0; }
        .formCard, .orderCard, .successCard {
          background: white; border: 1px solid #f1e5ec; border-radius: 19px;
          padding: 25px; box-shadow: 0 8px 30px rgba(78, 35, 61, .045);
        }
        .sectionHeading { display: flex; gap: 14px; align-items: center; margin-bottom: 23px; }
        .stepNumber {
          width: 39px; height: 39px; border-radius: 12px; background: #fff0f7;
          color: #e44494; display: grid; place-items: center; font-weight: 800; font-size: 13px;
        }
        .sectionHeading h2, .orderCardTitle h2 { margin: 0 0 5px; font-size: 17px; }
        .sectionHeading p, .orderCardTitle p { margin: 0; color: #9a8996; font-size: 12px; }
        .fieldsGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 17px; }
        .fieldsGrid label { display: flex; flex-direction: column; gap: 8px; color: #554453; font-size: 12px; font-weight: 700; }
        .fieldsGrid input, .fieldsGrid select, .fieldsGrid textarea, .noteInput {
          width: 100%; min-width: 0; border: 1px solid #eadfe7; border-radius: 10px;
          background: #fff; padding: 13px 14px; color: #35263a; font: inherit;
          font-size: 13px; outline: none; transition: .2s;
        }
        .fieldsGrid input:focus, .fieldsGrid select:focus, .fieldsGrid textarea:focus, .noteInput:focus {
          border-color: #e94b9b; box-shadow: 0 0 0 3px #fceaf3;
        }
        .fieldsGrid input::placeholder, .fieldsGrid textarea::placeholder, .noteInput::placeholder { color: #b7aab4; }
        .fullField { grid-column: 1 / -1; }
        .deliveryOptions { display: grid; gap: 12px; }
        .deliveryOption {
          display: flex; align-items: center; gap: 13px; padding: 15px;
          border: 1px solid #eee3eb; border-radius: 13px; cursor: pointer; transition: .2s;
        }
        .deliveryOption.selected { border-color: #ed77b0; background: #fff7fb; }
        .deliveryOption input { accent-color: #e74797; }
        .deliveryEmoji { font-size: 23px; }
        .deliveryOption b, .deliveryOption small { display: block; }
        .deliveryOption b { font-size: 13px; margin-bottom: 5px; }
        .deliveryOption small { color: #9b8996; font-size: 11px; }
        .noteInput { resize: vertical; }
        .mainButton {
          display: inline-flex; justify-content: center; align-items: center;
          border: 0; border-radius: 12px; padding: 16px 22px;
          color: white; background: linear-gradient(100deg, #ed4c9c, #d93486);
          font-size: 14px; font-weight: 800; text-decoration: none; cursor: pointer;
          box-shadow: 0 8px 18px rgba(224, 56, 139, .18); transition: .2s;
        }
        .mainButton:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(224, 56, 139, .25); }
        .mainButton:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .submitButton { width: 100%; }
        .privacyNote { margin: -7px 0 0; text-align: center; color: #a18e9c; font-size: 11px; }
        .orderCard { position: sticky; top: 95px; }
        .orderCardTitle { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #f1e8ee; }
        .bagIcon { font-size: 24px; }
        .orderItems { display: grid; gap: 18px; padding: 20px 0; }
        .orderItem { display: grid; grid-template-columns: 62px minmax(0, 1fr); gap: 12px; position: relative; padding-right: 0; }
        .productPicture {
          width: 62px; height: 68px; display: grid; place-items: center;
          background: #fff1f7; border-radius: 12px; overflow: hidden; font-size: 27px;
        }
        .productPicture img { width: 100%; height: 100%; object-fit: cover; }
        .productDetails { min-width: 0; }
        .productDetails b { display: block; font-size: 12px; line-height: 1.4; padding-right: 5px; }
        .productDetails small { display: block; color: #998794; font-size: 11px; margin-top: 5px; }
        .quantityControl { display: flex; align-items: center; gap: 11px; margin-top: 9px; }
        .quantityControl button {
          width: 24px; height: 24px; border: 1px solid #f0dce8; border-radius: 7px;
          background: #fff7fb; color: #d83d89; font-size: 17px; cursor: pointer;
        }
        .quantityControl span { font-size: 12px; font-weight: 700; }
        .itemTotal { grid-column: 2; color: #4b3447; font-size: 12px; margin-top: -5px; }
        .priceSummary { border-top: 1px solid #f1e8ee; padding-top: 17px; display: grid; gap: 14px; }
        .priceSummary div { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; }
        .priceSummary span { color: #927f8d; }
        .priceSummary b { text-align: right; font-size: 12px; }
        .deliveryPrice { padding-top: 12px; border-top: 1px dashed #eadde6; }
        .orderNotice { margin-top: 20px; padding: 13px; border-radius: 10px; background: #fff3f8; color: #a45b80; font-size: 11px; line-height: 1.6; }
        .emptyCart { text-align: center; padding: 34px 10px; }
        .emptyCart div { font-size: 38px; }
        .emptyCart h3 { font-size: 16px; }
        .emptyCart p { color: #988794; font-size: 12px; }
        .continueLink { color: #df438f; font-size: 12px; font-weight: 800; text-decoration: none; }
        .errorMessage { background: #fff0f0; color: #b23a48; padding: 14px; border-radius: 10px; margin-bottom: 18px; font-size: 13px; }
        .successCard { max-width: 650px; margin: 35px auto; text-align: center; padding: 45px 25px; }
        .successIcon { width: 65px; height: 65px; display: grid; place-items: center; margin: 0 auto 20px; border-radius: 50%; background: #e9f9ef; color: #269b5c; font-size: 32px; }
        .successCard h2 { font-size: 23px; }
        .successCard p { color: #887987; font-size: 13px; line-height: 1.7; }
        .successInfo { background: #fff4f9; padding: 12px; border-radius: 10px; }
        .smallNote { font-size: 11px !important; }
        .successCard .mainButton { margin-top: 15px; }
        .checkoutFooter {
          display: flex; justify-content: space-between; gap: 15px; flex-wrap: wrap;
          padding: 25px 6%; border-top: 1px solid #f1e6ed; background: white;
          color: #a18e9c; font-size: 11px;
        }
        .checkoutFooter a { color: #d9418e; text-decoration: none; font-weight: 900; }
        @media(max-width: 800px) {
          .checkoutGrid { grid-template-columns: 1fr; }
          .orderCard { position: static; grid-row: 1; }
          .checkoutContainer { padding-top: 30px; }
        }
        @media(max-width: 520px) {
          .checkoutHeader { height: 65px; padding: 0 18px; }
          .checkoutLogo { font-size: 19px; }
          .backLink { font-size: 11px; }
          .checkoutContainer { padding: 27px 14px 50px; }
          .checkoutIntro { align-items: flex-start; flex-direction: column; }
          .secureLabel { padding: 9px 13px; }
          .formCard, .orderCard { padding: 18px; border-radius: 15px; }
          .fieldsGrid { grid-template-columns: 1fr; }
          .fullField { grid-column: auto; }
          .checkoutIntro h1 { font-size: 27px; }
          .checkoutFooter { padding: 22px 16px; }
        }
      `}</style>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main style={{ padding: 40 }}>Yuklanmoqda...</main>}>
      <CheckoutForm />
    </Suspense>
  );
}

