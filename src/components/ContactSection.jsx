import { useState } from 'react'

export default function ContactSection(){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)

  function onChange(e){
    setForm({...form, [e.target.name]: e.target.value})
  }
  function onSubmit(e){
    e.preventDefault()
    setSent(true)
  }

  if(sent){
    return (
      <div className="card">
        <h2>İletişim</h2>
        <p>Teşekkürler {form.name}! Mesajınızı aldık. En kısa sürede döneceğiz.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>İletişim</h2>
      <form onSubmit={onSubmit} className="grid" style={{gap:14}}>
        <div className="grid" style={{gap:8}}>
          <label className="small">Ad Soyad</label>
          <input name="name" value={form.name} onChange={onChange} required style={{padding:'12px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,.12)', background:'transparent', color:'var(--ink)'}}/>
        </div>
        <div className="grid" style={{gap:8}}>
          <label className="small">E‑posta</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required style={{padding:'12px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,.12)', background:'transparent', color:'var(--ink)'}}/>
        </div>
        <div className="grid" style={{gap:8}}>
          <label className="small">Mesaj</label>
          <textarea name="message" rows="5" value={form.message} onChange={onChange} required style={{padding:'12px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,.12)', background:'transparent', color:'var(--ink)', resize:'vertical'}}/>
        </div>
        <div>
          <button className="btn" type="submit">Gönder</button>
        </div>
      </form>
      <p className="small" style={{marginTop:10}}>Alternatif: <a href="mailto:hello@yourbrand.com">hello@yourbrand.com</a></p>
    </div>
  )
}