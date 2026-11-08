"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accepted) {
      setMessage("Davom etish uchun shartlarga rozilik bildiring.");
      return;
    }
    setMessage("Ro‘yxatdan o‘tish dizayni tayyor. Haqiqiy hisob yaratish uchun keyingi bosqichda Supabase autentifikatsiyasini ulaymiz.");
  }

  return <main className="auth-page">
    <div className="auth-decoration auth-decoration-one" />
    <div className="auth-decoration auth-decoration-two" />
    <Link href="/" className="auth-brand">K<span>·</span>MARKET<i>✿</i></Link>
    <div className="auth-card">
      <div className="auth-art">
        <span className="auth-spark">✦</span>
        <div className="auth-gift">🎁</div>
        <span className="auth-kicker">A LITTLE GIFT FROM KOREA</span>
        <h1>Welcome<br/>to K-MARKET</h1>
        <div className="auth-discount"><strong>20%</strong><span>FIRST ORDER<br/>DISCOUNT</span></div>
        <p>Ro‘yxatdan o‘ting va birinchi xaridingizda maxsus chegirmadan foydalaning.</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <span className="section-kicker">JOIN OUR COMMUNITY</span>
        <h2>Hisob yaratish</h2>
        <p className="auth-subtitle">K-MARKET olamiga xush kelibsiz ♡</p>
        <label>Ismingiz<input required value={name} onChange={e => setName(e.target.value)} placeholder="Ismingizni kiriting"/></label>
        <label>Email manzilingiz<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"/></label>
        <label>Parol<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kamida 8 ta belgi"/></label>
        <label className="auth-check"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}/> <span>Foydalanish shartlari bilan tanishdim va roziman.</span></label>
        <button className="button-primary auth-submit" type="submit">Ro‘yxatdan o‘tish <span>→</span></button>
        {message && <p className="auth-message" role="status">{message}</p>}
        <p className="auth-login">Hisobingiz bormi? <Link href="/login">Kirish</Link></p>
        <Link className="auth-home" href="/">← Bosh sahifaga qaytish</Link>
      </form>
    </div>
    <p className="auth-foot">© 2026 K-MARKET · Made with ♡</p>
  </main>;
}
