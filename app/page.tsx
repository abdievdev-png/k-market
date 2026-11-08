"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  nameKo: string;
  category: string;
  categoryKo: string;
  price: number;
  currency: "KRW" | "UZS";
  emoji: string;
  description: string;
  descriptionKo: string;
  tag?: string;
  bg: string;
  image: string;
};

export const products: Product[] = [
  { id: 1, name: "Centella yuz toneri", nameKo: "센텔라 토너", category: "Parvarish", categoryKo: "스킨케어", price: 18500, currency: "UZS", emoji: "🧴", description: "Kundalik yuz parvarishi uchun toner.", descriptionKo: "매일 사용하는 얼굴 토너.", tag: "TOP", bg: "#fff0f5", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=85" },
  { id: 2, name: "Koreys yuz kremi", nameKo: "한국 페이스 크림", category: "Parvarish", categoryKo: "스킨케어", price: 24000, currency: "UZS", emoji: "🫙", description: "Namlikni saqlashga yordam beruvchi krem.", descriptionKo: "피부 보습을 위한 크림.", tag: "YANGI", bg: "#f7efff", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85" },
  { id: 3, name: "Koreys uzum ichimligi", nameKo: "포도 음료", category: "Ichimlik", categoryKo: "음료", price: 2500, currency: "KRW", emoji: "🍇", description: "Mevali ichimlik — katalog namunasi.", descriptionKo: "상큼한 과일 음료.", bg: "#f0f4ff", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=85" },
  { id: 4, name: "K-pop foto kartalar", nameKo: "케이팝 포토카드", category: "Aksessuar", categoryKo: "액세서리", price: 9000, currency: "UZS", emoji: "🎴", description: "Kolleksion aksessuar uchun namuna.", descriptionKo: "수집용 포토카드.", bg: "#fff3f8", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=85" },
  { id: 5, name: "Koreys ramen", nameKo: "한국 라면", category: "Gazak", categoryKo: "간식", price: 3000, currency: "KRW", emoji: "🍜", description: "Tez tayyorlanadigan noodl — namuna.", descriptionKo: "간편하게 조리하는 라면.", tag: "TOP", bg: "#fff4e9", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&q=85" },
  { id: 6, name: "Lab balzami", nameKo: "립밤", category: "Parvarish", categoryKo: "스킨케어", price: 11000, currency: "UZS", emoji: "💄", description: "Lab parvarishi uchun ixcham balzam.", descriptionKo: "입술 보습을 위한 립밤.", bg: "#fff0f5", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=900&q=85" },
  { id: 7, name: "Soch qisqichi", nameKo: "헤어 집게핀", category: "Aksessuar", categoryKo: "액세서리", price: 8000, currency: "UZS", emoji: "🎀", description: "Har kungi obraz uchun aksessuar.", descriptionKo: "데일리 헤어 액세서리.", bg: "#fceeff", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85" },
  { id: 8, name: "Asalli pechenye", nameKo: "허니 쿠키", category: "Gazak", categoryKo: "간식", price: 2200, currency: "KRW", emoji: "🍪", description: "Choy bilan yeyiladigan shirin gazak.", descriptionKo: "차와 함께 먹는 달콤한 쿠키.", bg: "#fff5df", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=900&q=85" }
];

type CartItem = { product: Product; quantity: number };

export function formatMoney(value: number, currency: Product["currency"]) {
  return new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(value) + " " + (currency === "KRW" ? "₩" : "so‘m");
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [market, setMarket] = useState<"UZ" | "KR">("UZ");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [lang, setLang] = useState<"uz" | "ko">("uz");
  const [notice, setNotice] = useState("");

  const t = (uz: string, ko: string) => lang === "uz" ? uz : ko;
  const shown = useMemo(() => products.filter(p =>
    (p.name + " " + p.nameKo + " " + p.description + " " + p.descriptionKo).toLowerCase().includes(search.toLowerCase()) &&
    (category === "all" || p.category === category)
  ), [search, category]);

  const items: CartItem[] = products.filter(p => cart[p.id] > 0).map(product => ({ product, quantity: cart[product.id] }));
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const update = (id: number, delta: number) => setCart(old => ({ ...old, [id]: Math.max(0, (old[id] || 0) + delta) }));

  function goCheckout() {
    localStorage.setItem("seoul-cart", JSON.stringify(cart));
    window.location.href = `/checkout?market=${market}`;
  }

  return (
    <>
      <div className="announcement">
        <div className="announcement-inner">
          <span>🇰🇷 {t("Koreyadan tanlangan mahsulotlar", "한국에서 엄선한 상품")}</span>
          <span className="announcement-right">{t("Savollaringiz bormi? Biz bilan bog‘laning", "궁금한 점이 있나요? 문의하세요")}</span>
        </div>
      </div>

      <header className="site-header">
        <nav className="nav-shell">
          <Link className="brand" href="/">K<span>·</span>MARKET<i>✿</i></Link>
          <div className="nav-links">
            <a href="#top">{t("Bosh sahifa", "홈")}</a>
            <a href="#products">{t("Mahsulotlar", "상품")}</a>
            <a href="#about">{t("Biz haqimizda", "소개")}</a>
          </div>
          <div className="nav-actions">
            <select className="market-select" value={market} onChange={e => setMarket(e.target.value as "UZ" | "KR")} aria-label="Bozor">
              <option value="UZ">🇺🇿 O‘zbekiston</option>
              <option value="KR">🇰🇷 한국 / Korea</option>
            </select>
            <button className="language-button" onClick={() => setLang(lang === "uz" ? "ko" : "uz")}>{lang === "uz" ? "🇰🇷 한국어" : "🇺🇿 O‘zbekcha"}</button>
            <Link className="account-link" href="/register">{t("Kirish", "로그인")}</Link>
            <button className="cart-button" onClick={() => setShowCart(!showCart)} aria-label="Savat">♡ <span>{count}</span></button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div className="hero-content">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> KOREA PICKS · K-MARKET</span>
              <h1>{t("Koreyaning eng sara mahsulotlari bir joyda!", "한국의 인기 상품을 한곳에서!")}</h1>
              <p>{t("Sevimli koreys kosmetikasi, taomlari va kundalik mahsulotlarini oson toping.", "좋아하는 한국 화장품과 식품, 생활용품을 만나보세요.")}</p>
              <div className="hero-buttons">
                <a className="button-primary" href="#products">{t("Xaridni boshlash", "쇼핑 시작하기")} <span>↗</span></a>
                <Link className="button-quiet" href="/register">{t("A'zo bo‘lish", "회원가입")}</Link>
              </div>
              <div className="hero-trust"><span>✦ 100% {t("tanlangan mahsulotlar", "엄선된 상품")}</span><span>✦ {t("Koreyadan ilhom", "한국에서 온 감성")}</span></div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo" role="img" aria-label="Koreys kosmetikasi va sovg‘alar" />
              <div className="floating-note note-top">SEOUL<br/><b>STYLE</b> ✿</div>
              <div className="discount-sticker"><small>{t("Birinchi xaridga", "첫 구매")}</small><strong>20<em>%</em></strong><span>{t("CHEGIRMA", "할인")}</span></div>
              <div className="floating-note note-bottom">안녕하세요! ♡</div>
            </div>
          </div>
          <div className="hero-bottom-line"><span>DISCOVER KOREA</span><span>✿ ✿ ✿</span><span>SHOP YOUR FAVORITES</span></div>
        </section>

        <section className="welcome-strip">
          <div className="welcome-icon">🎁</div>
          <div><b>{t("Yangi a'zolarga maxsus sovg‘a!", "신규 회원 특별 혜택!")}</b><p>{t("Ro‘yxatdan o‘ting va birinchi xaridingizga 20% chegirma oling.", "가입하고 첫 구매 20% 할인 혜택을 받으세요.")}</p></div>
          <Link href="/register" className="welcome-cta">{t("Chegirmani olish", "혜택 받기")} <span>→</span></Link>
        </section>

        <section className="category-section wrap">
          <div className="section-heading"><div><span className="section-kicker">CURATED FOR YOU</span><h2>{t("Kategoriyalar", "카테고리")}</h2></div><span className="heading-flower">✿</span></div>
          <div className="category-pills">
            {[
              ["all", "✦", t("Barchasi", "전체")],
              ["Parvarish", "🧴", t("Kosmetika", "뷰티")],
              ["Gazak", "🍜", t("Gazaklar", "간식")],
              ["Ichimlik", "🥤", t("Ichimliklar", "음료")],
              ["Aksessuar", "🎀", t("Aksessuarlar", "액세서리")]
            ].map(([value, icon, label]) => (
              <button key={value} className={`category-pill ${category === value ? "active" : ""}`} onClick={() => { setCategory(value); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </section>

        <section className="products-section wrap" id="products">
          <div className="section-heading product-heading">
            <div><span className="section-kicker">THE K-MARKET EDIT</span><h2>{t("Siz uchun tanlanganlar", "추천 상품")}</h2><p>{t("Koreyadan sevimli topilmalar", "한국에서 찾은 특별한 상품")}</p></div>
            <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("Mahsulot qidirish...", "상품 검색...")} /><span className="search-shortcut">↵</span></div>
          </div>
          <div className="product-grid">
            {shown.map(p => <article className="product-card" key={p.id}>
              <div className="product-image" style={{ backgroundImage: `url("${p.image}")`, backgroundColor: p.bg }}>
                {p.tag && <span className={`product-tag ${p.tag === "TOP" ? "tag-top" : "tag-new"}`}>{p.tag}</span>}
                <button className="wish-button" aria-label="Sevimlilarga qo‘shish" onClick={() => setNotice(t("Sevimlilar funksiyasi keyingi bosqichda ulanadi.", "찜 기능은 다음 단계에서 연결됩니다."))}>♡</button>
              </div>
              <div className="product-info">
                <span className="product-category">{lang === "uz" ? p.category : p.categoryKo}</span>
                <h3>{lang === "uz" ? p.name : p.nameKo}</h3>
                <p>{lang === "uz" ? p.description : p.descriptionKo}</p>
                <div className="product-bottom"><strong>{formatMoney(p.price, p.currency)}</strong><button className="add-button" onClick={() => { update(p.id, 1); setNotice(t("Savatga qo‘shildi!", "장바구니에 담았습니다!")); }}>+</button></div>
              </div>
            </article>)}
          </div>
          {shown.length === 0 && <p className="empty-state">{t("Mahsulot topilmadi.", "상품을 찾을 수 없습니다.")}</p>}
        </section>

        <section className="service-row wrap" id="about">
          <div><span>✧</span><b>{t("Ishonchli xarid", "안심 쇼핑")}</b><small>{t("Tanlangan mahsulotlar", "엄선된 상품")}</small></div>
          <div><span>♡</span><b>{t("Yordam xizmati", "고객 지원")}</b><small>{t("Mijozlar uchun yordam", "고객 상담")}</small></div>
          <div><span>↗</span><b>{t("Qulay buyurtma", "간편 주문")}</b><small>{t("Savat va buyurtma", "장바구니와 주문")}</small></div>
        </section>
      </main>

      {showCart && <div className="cart-backdrop" onClick={() => setShowCart(false)}>
        <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
          <div className="drawer-heading"><div><span className="section-kicker">YOUR BAG</span><h2>{t("Savat", "장바구니")} ({count})</h2></div><button onClick={() => setShowCart(false)}>×</button></div>
          {items.length === 0 ? <p className="empty-state">{t("Savatingiz hozircha bo‘sh.", "장바구니가 비어 있습니다.")}</p> : <>
            {items.map(({ product, quantity }) => <div className="drawer-item" key={product.id}>
              <div className="drawer-thumb" style={{ backgroundImage: `url("${product.image}")` }} />
              <div className="drawer-product"><b>{lang === "uz" ? product.name : product.nameKo}</b><small>{formatMoney(product.price, product.currency)}</small><div className="quantity-control"><button onClick={() => update(product.id, -1)}>−</button><span>{quantity}</span><button onClick={() => update(product.id, 1)}>+</button></div></div>
            </div>)}
            <div className="drawer-total"><span>{t("Jami (demo)", "합계 (데모)")}</span><b>{formatMoney(total, items.every(i => i.product.currency === items[0].product.currency) ? items[0].product.currency : "UZS")}</b></div>
            <p className="tiny-note">{t("Demo katalogda valyutalar aralash bo‘lishi mumkin. Haqiqiy savdoda kurs va valyuta alohida belgilanadi.", "데모 상품의 통화는 혼합될 수 있습니다.")}</p>
            <button className="button-primary checkout-button" onClick={goCheckout}>{t("Buyurtmaga o‘tish", "주문하기")} →</button>
          </>}
        </aside>
      </div>}

      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}

      <footer className="site-footer"><div className="footer-inner"><Link className="brand" href="/">K<span>·</span>MARKET<i>✿</i></Link><p>© 2026 K-MARKET · {t("Koreyadan mehr bilan", "한국에서 정성껏")}</p><Link href="/register">{t("Ro‘yxatdan o‘tish", "회원가입")}</Link></div></footer>
    </>
  );
}
