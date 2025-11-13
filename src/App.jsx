import { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/60 border-b border-white/30">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 shadow-lg" />
          <span className="font-semibold tracking-tight text-gray-800">Cafe Aesthetica</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#home" className="hover:text-gray-900">Beranda</a>
          <a href="#menu" className="hover:text-gray-900">Menu</a>
          <a href="#about" className="hover:text-gray-900">Tentang</a>
          <a href="#reserve" className="hover:text-gray-900">Reservasi</a>
        </nav>
        <a href="#reserve" className="hidden md:inline-flex bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow hover:shadow-md transition">Pesan Meja</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative pt-24 pb-20 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Tempat Ngopi yang Estetik & Cozy
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Nikmati kopi spesialti, pastry hangat, dan suasana hangat untuk kerja atau santai.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <a href="#menu" className="px-5 py-3 rounded-full bg-amber-500 text-white shadow hover:shadow-lg transition">Lihat Menu</a>
            <a href="#reserve" className="px-5 py-3 rounded-full bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow transition">Reservasi</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-amber-100 to-pink-100 shadow-2xl p-2">
            <div className="h-full w-full rounded-2xl bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI5MTcyNDJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)'}} />
          </div>
        </div>
      </div>
    </section>
  )
}

function MenuSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/menu`)
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="menu" className="py-16 bg-gradient-to-b from-white to-amber-50/40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Menu Favorit</h2>
            <p className="text-gray-600 mt-1">Diracik dengan bahan terbaik setiap hari.</p>
          </div>
          <span className="text-sm text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">Terbaru</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img src={item.image_url || `https://source.unsplash.com/600x600/?coffee,${encodeURIComponent(item.name)}`}
                       alt={item.name}
                       className="h-full w-full object-cover group-hover:scale-105 transition"/>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-amber-700 font-medium">Rp{(item.price * 15000).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDYWZlJTIwaW50ZXJpb3J8ZW58MHwwfHx8MTc2Mjk5MjAyNXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Cafe interior" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tentang Kami</h2>
          <p className="mt-4 text-gray-600">Kami percaya kopi terbaik lahir dari biji pilihan, teknik penyeduhan presisi, dan keramahan yang tulus. Ruang kami didesain estetik agar nyaman untuk bekerja, bertemu, atau sekadar me-time.</p>
          <ul className="mt-6 space-y-2 text-gray-700">
            <li>• Single-origin & house blend</li>
            <li>• Pastry fresh from oven</li>
            <li>• Free Wi‑Fi & banyak colokan</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Reservation() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: 2, message: '' })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`${BACKEND_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, guests: Number(form.guests) })
      })
      const data = await res.json()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', date: '', time: '', guests: 2, message: '' })
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <section id="reserve" className="py-16 bg-gradient-to-t from-white to-pink-50/40">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Reservasi Meja</h2>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 bg-white/70 p-6 rounded-2xl border border-gray-100 shadow">
          {[
            {key: 'name', label: 'Nama Lengkap', type: 'text'},
            {key: 'email', label: 'Email', type: 'email'},
            {key: 'phone', label: 'Nomor HP', type: 'text'},
            {key: 'date', label: 'Tanggal', type: 'date'},
            {key: 'time', label: 'Jam', type: 'time'},
            {key: 'guests', label: 'Jumlah Tamu', type: 'number'},
          ].map(f => (
            <div key={f.key} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">{f.label}</label>
              <input required className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300" type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1">Catatan</label>
            <textarea className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300" rows="3" value={form.message} onChange={e => setForm(prev => ({...prev, message: e.target.value}))}></textarea>
          </div>
          <div className="md:col-span-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">Kami akan mengirimkan konfirmasi via email.</p>
            <button className="px-5 py-2.5 rounded-full bg-gray-900 text-white shadow hover:shadow-md transition" disabled={status==='loading'}>
              {status==='loading' ? 'Mengirim...' : 'Kirim Reservasi'}
            </button>
          </div>
          {status==='success' && <p className="md:col-span-2 text-green-600">Reservasi terkirim! Terima kasih.</p>}
          {status==='error' && <p className="md:col-span-2 text-red-600">Terjadi kesalahan. Coba lagi ya.</p>}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} Cafe Aesthetica — dibuat dengan cinta dan kopi.
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(40%_40%_at_10%_10%,rgba(251,191,36,0.15),transparent),radial-gradient(40%_40%_at_90%_10%,rgba(244,114,182,0.15),transparent)]">
      <Navbar />
      <main>
        <Hero />
        <MenuSection />
        <About />
        <Reservation />
      </main>
      <Footer />
    </div>
  )
}

export default App
