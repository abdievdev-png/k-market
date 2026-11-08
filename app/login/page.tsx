"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Kirish sahifasi dizayni tayyor. Haqiqiy kirish uchun Supabase autentifikatsiyasini ulash kerak.");
  }

  return <main className="auth-page">
    <div className="auth-decoration auth-decoration-one" />
    <div className="auth-decoration auth-decoration-two" />
    <Link href="/" className="auth-brand">K<span>·</span>MARKET<i>✿</i></Link>
    <div className="auth-card">
      <div className="auth-art">
        <span className="auth-spark">✦</span>
        <div className="auth-gift">♡</div>
        <span className="auth-kicker">WELCOME BACK</span>
        <h1>Good to<br/>see you!</h1>
        <p>K-MARKET'dagi sevimli mahsulotlaringiz sizni kutmoqda.</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <span className="section-kicker">YOUR K-MARKET ACCOUNT</span>
        <h2>Hisobga kirish</h2>
        <p className="auth-subtitle">Xush kelibsiz! Ma’lumotlaringizni kiriting.</p>
        <label>Email manzilingiz<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"/></label>
        <label>Parol<input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Parolingiz"/></label>
        <button className="button-primary auth-submit" type="submit">Kirish <span>→</span></button>
        {message && <p className="auth-message" role="status">{message}</p>}
        <p className="auth-login">Hisobingiz yo‘qmi? <Link href="/register">Ro‘yxatdan o‘tish</Link></p>
        <Link className="auth-home" href="/">← Bosh sahifaga qaytish</Link>
      </form>
    </div>
    <p className="auth-foot">© 2026 K-MARKET · Made with ♡</p>
  </main>;
}
