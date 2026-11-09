
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

export function formatMoney(value: number, currency: Product["currency"]) {
  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0
  }).format(value) + " " + (currency === "KRW" ? "₩" : "so‘m");
}

