
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { products, formatMoney } from "./products";

export default function Home() {
  const [lang, setLang] = useState<"uz" | "ko">("uz");
  const [market, setMarket] = useState<"UZ" | "KR">("UZ");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [notice, setNotice] = useState("");

  const t = (uz: string, ko: string) => lang === "uz" ? uz : ko;

  // Bosh sahifadagi 4 ta slayd
  const slides = [
    {
      label: "KOREA PICKS",
      title: t("Koreyaning eng sara mahsulotlari bir joyda!", "한국의 인기 상품을 한곳에서!"),
      description: t("Sevimli koreys kosmetikasi, taomlari va kundalik mahsulotlarini kashf eting.", "한국 화장품, 식품과 생활용품을 만나보세요."),
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=90"
    },
    {
      label: "BEAUTY COLLECTION",
      title: t("Koreys go‘zalligi sizga yanada yaqin!", "한국의 아름다움을 더 가까이!"),
      description: t("Mashhur parvarish mahsulotlarini K-MARKET orqali toping.", "인기 스킨케어 제품을 K-MARKET에서 만나보세요."),
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1400&q=90"
    },
    {
      label: "KOREAN LIFESTYLE",
      title: t("Har kuni yangi koreyscha kashfiyot!", "매일 새로운 한국 라이프스타일!"),
      description: t("Qiziqarli mahsulotlar va kundalik xaridlar bir sahifada.", "다양한 상품과 일상 쇼핑을 한곳에서."),
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1400&q=90"
    },
    {
      label: "SPECIAL SHOPPING",
      title: t("Sevimli mahsulotlaringizni tanlang!", "마음에 드는 상품을 선택하세요!"),
      description: t("K-MARKET bilan xarid qilish yanada qulay.", "K-MARKET과 함께 편리한 쇼핑을 경험하세요."),
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=90"
    }
  ];

  // Har 4 soniyada keyingi slaydga o'tish
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((old) => (old + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Savatga mahsulot qo'shish
  const addToCart = (id: number) => {
    setCart((old) => ({
      ...old,
      [id]: (old[id] || 0) + 1
    }));

    setNotice(t("Mahsulot savatga qo‘shildi!", "상품이 장바구니에 추가되었습니다!"));
    setShowCart(true);
  };

  // Mahsulot sonini o'zgartirish
  const changeQuantity = (id: number, amount: number) => {
    setCart((old) => {
      const next = { ...old };
      const quantity = (next[id] || 0) + amount;

      if (quantity <= 0) delete next[id];
      else next[id] = quantity;

      return next;
    });
  };

  // Jami mahsulotlar soni
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Kategoriyalar
  const categories = [
    { id: "all", uz: "Barchasi", ko: "전체" },
    { id: "beauty", uz: "Kosmetika", ko: "뷰티" },
    { id: "food", uz: "Oziq-ovqat", ko: "식품" },
    { id: "fashion", uz: "Aksessuarlar", ko: "패션" },
    { id: "kpop", uz: "K-pop", ko: "케이팝" }
  ];

  // Qidiruv va kategoriya bo'yicha saralash
  const shownProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.nameKo.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  // Savatdagi mahsulotlar
  const cartProducts = products.filter((product) => cart[product.id]);

  // Umumiy narx
  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0
  );

  const currentSlide = slides[slideIndex];

  return (
    <main>
      {/* Yuqori xabar */}
      <div className="announcement">
        {t("K-MARKET — Koreyadan sizga!", "K-MARKET — 한국에서 당신에게!")}
      </div>

      {/* Sayt menyusi */}
      <header className="header">
        <Link href="/" className="logo">K<span>·</span>MARKET</Link>

        <nav className="nav">
          <a href="#home">{t("Bosh sahifa", "홈")}</a>
          <a href="#products">{t("Mahsulotlar", "상품")}</a>
          <a href="#about">{t("Biz haqimizda", "소개")}</a>
        </nav>

        <div className="header-actions">
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as "UZ" | "KR")}
            aria-label="Bozorni tanlash"
          >
            <option value="UZ">🇺🇿 O‘zbekiston</option>
            <option value="KR">🇰🇷 Korea</option>
          </select>

          <button
            className="language-button"
            onClick={() => setLang(lang === "uz" ? "ko" : "uz")}
          >
            {lang === "uz" ? "🇺🇿 UZ" : "🇰🇷 KO"}
          </button>

          <Link href="/login" className="login-link">
            {t("Kirish", "로그인")}
          </Link>

          <button className="cart-button" onClick={() => setShowCart(true)}>
            🛍️ <span>{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Bosh slaydlar */}
      <section className="hero" id="home">
        <div
          className="hero-photo"
          style={{ backgroundImage: `url("${currentSlide.image}")` }}
        />

        <div className="hero-content">
          <span className="hero-label">{currentSlide.label}</span>
          <h1>{currentSlide.title}</h1>
          <p>{currentSlide.description}</p>

          <a href="#products" className="hero-button">
            {t("Xarid qilish", "쇼핑하기")} →
          </a>

          <div className="hero-controls">
            <button
              className="hero-arrow"
              onClick={() =>
                setSlideIndex((slideIndex + slides.length - 1) % slides.length)
              }
              aria-label="Oldingi slayd"
            >
              ←
            </button>

            {slides.map((slide, index) => (
              <button
                key={slide.label}
                className={`hero-dot ${index === slideIndex ? "active" : ""}`}
                onClick={() => setSlideIndex(index)}
                aria-label={`${index + 1}-slayd`}
              />
            ))}

            <button
              className="hero-arrow"
              onClick={() => setSlideIndex((slideIndex + 1) % slides.length)}
              aria-label="Keyingi slayd"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Ro'yxatdan o'tish taklifi */}
      <section className="welcome-strip">
        <div>
          <strong>{t("Yangi a'zolarga 20% chegirma!", "신규 회원 20% 할인!")}</strong>
          <p>{t("Ro‘yxatdan o‘ting va maxsus taklifdan foydalaning.", "가입하고 특별 혜택을 받아보세요.")}</p>
        </div>
        <Link href="/register">{t("Ro‘yxatdan o‘tish", "회원가입")} →</Link>
      </section>

      {/* Xizmatlar */}
      <section className="services" id="about">
        <div>🚚 <strong>{t("Qulay yetkazib berish", "편리한 배송")}</strong></div>
        <div>💳 <strong>{t("Qulay xarid", "간편한 쇼핑")}</strong></div>
        <div>🇰🇷 <strong>{t("Koreys mahsulotlari", "한국 상품")}</strong></div>
      </section>

      {/* Mahsulotlar katalogi */}
      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">K·MARKET COLLECTION</span>
            <h2>{t("Ommabop mahsulotlar", "인기 상품")}</h2>
          </div>
          <p>{t("Siz uchun tanlangan mahsulotlar", "당신을 위해 준비한 상품")}</p>
        </div>

        <div className="catalog-tools">
          <input
            type="search"
            placeholder={t("Mahsulot qidirish...", "상품 검색...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item.id}
                className={category === item.id ? "category active" : "category"}
                onClick={() => setCategory(item.id)}
              >
                {lang === "uz" ? item.uz : item.ko}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {shownProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image" style={{ background: product.bg }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span>{product.emoji}</span>
                )}
                {product.tag && <span className="product-tag">{product.tag}</span>}
              </div>

              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{lang === "uz" ? product.name : product.nameKo}</h3>
                <p>{lang === "uz" ? product.description : product.descriptionKo}</p>

                <div className="product-bottom">
                  <strong>
                    {formatMoney(product.price, market === "UZ" ? "UZS" : "KRW")}
                  </strong>

                  <button onClick={() => addToCart(product.id)}>
                    + {t("Savatga", "담기")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {shownProducts.length === 0 && (
          <p className="empty-products">
            {t("Mahsulot topilmadi.", "상품을 찾을 수 없습니다.")}
          </p>
        )}
      </section>

      {/* Pastki qism */}
      <footer className="footer">
        <div>
          <Link href="/" className="logo">K<span>·</span>MARKET</Link>
          <p>{t("Koreys mahsulotlari — bir joyda.", "한국 상품을 한곳에서.")}</p>
        </div>

        <div className="footer-socials">
          <a href="https://t.me/bm64i" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://www.instagram.com/_abdiev.o5/" target="_blank" rel="noreferrer">Instagram</a>
        </div>

        <p className="creator">Eldor — Web Developer · K-MARKET Creator.</p>
      </footer>

      {/* Savat oynasi */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-heading">
              <h2>{t("Savat", "장바구니")}</h2>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cartProducts.length === 0 ? (
              <p>{t("Savatingiz hozircha bo‘sh.", "장바구니가 비어 있습니다.")}</p>
            ) : (
              <>
                {cartProducts.map((product) => (
                  <div className="cart-item" key={product.id}>
                    <div>
                      <strong>{lang === "uz" ? product.name : product.nameKo}</strong>
                      <p>{formatMoney(product.price, market === "UZ" ? "UZS" : "KRW")}</p>
                    </div>

                    <div className="quantity-controls">
                      <button onClick={() => changeQuantity(product.id, -1)}>−</button>
                      <span>{cart[product.id]}</span>
                      <button onClick={() => changeQuantity(product.id, 1)}>+</button>
                    </div>
                  </div>
                ))}

                <div className="cart-total">
                  <strong>{t("Jami:", "합계:")}</strong>
                  <strong>{formatMoney(total, market === "UZ" ? "UZS" : "KRW")}</strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() => {
                    localStorage.setItem("seoul-cart", JSON.stringify(cart));
                    window.location.href = `/checkout?market=${market}`;
                  }}
                >
                  {t("Buyurtmani rasmiylashtirish", "주문하기")} →
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {notice && (
        <div className="notice" onClick={() => setNotice("")}>
          {notice} ✕
        </div>
      )}
    </main>
  );
}
