 "use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products, formatMoney } from "../page";

function CheckoutForm(){
 const params=useSearchParams(); const market=params.get("market")==="KR"?"KR":"UZ";
 const [cart,setCart]=useState<Record<number,number>>({});
 const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState("");
 const [address,setAddress]=useState(""); const [city,setCity]=useState(""); const [country,setCountry]=useState(market==="KR"?"South Korea":"Uzbekistan");
 const [delivery,setDelivery]=useState("standard"); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
 useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem("seoul-cart")||"{}"))}catch{}},[]);
 const items=useMemo(()=>products.filter(p=>(cart[p.id]||0)>0).map(p=>({product:p,quantity:cart[p.id]})),[cart]);
 const currency=market==="KR"?"KRW":"UZS";
 const total=items.reduce((sum,i)=>sum+i.product.price*i.quantity,0);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("");
  try{
   const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:{name,phone,email,address,city,country},market,currency,delivery,items:items.map(i=>({productId:i.product.id,quantity:i.quantity})),note:""})});
   const data=await res.json(); if(!res.ok)throw new Error(data.error||"Buyurtmani yuborib bo‘lmadi.");
   setMessage("Buyurtma qabul qilindi. Raqami: "+data.orderId+". Hozircha to‘lov yoqilmagan; do‘kon egasi buyurtmani tasdiqlashi kerak.");
   localStorage.removeItem("seoul-cart");setCart({});
  }catch(err){setMessage(err instanceof Error?err.message:"Xatolik yuz berdi.");}
  finally{setBusy(false);}
 }
 return <><nav className="nav"><Link className="brand" href="/">SEOUL<span>MARKET</span> ✿</Link><Link className="links" href="/">← Xaridni davom ettirish</Link></nav><main className="wrap"><div className="heading"><div><h1>Buyurtma</h1><p className="muted">Yetkazib berish ma’lumotlarini kiriting.</p></div></div>{message&&<p className={message.startsWith("Buyurtma qabul")?"success":"error"}>{message}</p>}<div className="checkoutLayout"><form className="panel" onSubmit={submit}><h2>Mijoz ma’lumotlari</h2><div className="formgrid"><label>Ism-familiya<input className="field" required value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></label><label>Telefon<input className="field" required value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" placeholder="+82 / +998 ..."/></label><label>Email (ixtiyoriy)<input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label><label>Mamlakat<select className="field" value={country} onChange={e=>setCountry(e.target.value)}><option>Uzbekistan</option><option>South Korea</option></select></label><label>Shahar<input className="field" required value={city} onChange={e=>setCity(e.target.value)} autoComplete="address-level2"/></label><label className="wide">To‘liq manzil<textarea className="field" required rows={3} value={address} onChange={e=>setAddress(e.target.value)} autoComplete="street-address"/></label><label className="wide">Yetkazib berish<select className="field" value={delivery} onChange={e=>setDelivery(e.target.value)}><option value="standard">Oddiy (narxi keyin tasdiqlanadi)</option><option value="pickup">Olib ketish (agar mavjud bo‘lsa)</option></select></label></div><p className="note">Buyurtma yuborilganda bu namuna serverga saqlashni faqat Supabase sozlanganida amalga oshiradi. To‘lov hozircha ulanmagan.</p><button className="checkout" disabled={busy||items.length===0}>{busy?"Yuborilmoqda…":"Buyurtma yuborish"}</button></form><aside className="panel"><h2>Buyurtma tarkibi</h2>{items.length===0?<p className="empty">Savat bo‘sh. <Link href="/">Mahsulot tanlang.</Link></p>:items.map(i=><div className="summaryLine" key={i.product.id}><span>{i.product.emoji} {i.product.name} × {i.quantity}</span><b>{formatMoney(i.product.price*i.quantity,i.product.currency)}</b></div>)}<div className="total"><span>Jami*</span><span>{items.length?formatMoney(total,items.every(i=>i.product.currency===items[0].product.currency)?items[0].product.currency:"UZS"):"—"}</span></div><p className="note">*Bu boshlang‘ich demo. Narxlar valyutaga qarab alohida yuritilishi, yetkazib berish va soliqlar serverda hisoblanishi kerak. Hozircha bu sahifada karta ma’lumotlarini kiritmang.</p></aside></div></main><footer className="footer"><div className="foot"><span>Seoul Market</span><span>Buyurtma va to‘lovlarni ishga tushirishdan oldin tekshiring.</span></div></footer></>;
}
export default function CheckoutPage(){return <Suspense fallback={<main className="wrap">Yuklanmoqda…</main>}><CheckoutForm/></Suspense>}