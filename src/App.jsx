import { useEffect, useMemo, useState } from "react";

// Backend base URL (set VITE_BACKEND_URL in environment). Falls back to localhost.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur border-b border-zinc-200/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500" />
          <span className="font-semibold tracking-tight">Aurora Cafe</span>
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <a href="#menu" className="hover:text-amber-600 transition-colors">Menu</a>
          <a href="#reservation" className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors">Reservasi</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="pt-24 pb-12 bg-gradient-to-b from-amber-50 to-white">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Kopi istimewa, suasana nyaman.</h1>
          <p className="mt-3 text-zinc-600">Tempat yang tenang untuk menikmati kopi terbaik dan pastry segar setiap hari.</p>
          <div className="mt-6 flex gap-3">
            <a href="#menu" className="px-5 py-2.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors">Lihat Menu</a>
            <a href="#reservation" className="px-5 py-2.5 rounded-full border border-zinc-200 hover:border-zinc-300">Reservasi</a>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center shadow-xl" />
      </div>
    </section>
  );
}

function MenuSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/menu`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response");
        setItems(data);
      } catch (e) {
        setError("Menu tidak dapat dimuat. Menampilkan contoh.");
        setItems([
          { name: "Signature Latte", description: "Espresso lembut dengan sirup homemade", price: 4.5, category: "Kopi", image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", is_featured: true },
          { name: "Croissant", description: "Pastry renyah, dipanggang setiap pagi", price: 3.0, category: "Pastry", image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba", is_featured: false },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(i => i.category)));
    return ["Semua", ...cats];
  }, [items]);

  const filtered = useMemo(() => items.filter(i => category === "Semua" || i.category === category), [items, category]);

  return (
    <section id="menu" className="py-14 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Menu</h2>
            {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${category===cat?"bg-black text-white border-black":"border-zinc-200 hover:border-zinc-300"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({length:8}).map((_,i)=> <div key={i} className="h-48 rounded-xl bg-zinc-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <article key={idx} className="rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-zinc-100 bg-cover bg-center" style={{backgroundImage:`url(${item.image_url})`}} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-amber-600 font-semibold">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{item.description}</p>
                  {item.is_featured && <span className="mt-3 inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Unggulan</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Reservation() {
  const [form, setForm] = useState({ full_name: "", phone: "", guests: 2, date: "", time: "", notes: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal mengirim reservasi");
      setStatus({ state: "success", message: "Reservasi berhasil!" });
      setForm({ full_name: "", phone: "", guests: 2, date: "", time: "", notes: "" });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  return (
    <section id="reservation" className="py-14 bg-gradient-to-t from-amber-50 to-white">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-3xl font-semibold tracking-tight">Reservasi Meja</h2>
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Nama lengkap" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required />
            <input className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="No. telepon" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input type="number" min={1} max={20} className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="Tamu" value={form.guests} onChange={e=>setForm({...form, guests: Number(e.target.value)})} required />
            <input type="date" className="rounded-xl border border-zinc-200 px-3 py-2" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
            <input type="time" className="rounded-xl border border-zinc-200 px-3 py-2" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required />
          </div>
          <textarea rows={3} className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="Catatan (opsional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          <div className="flex items-center gap-3">
            <button disabled={status.state==="loading"} className="px-5 py-2.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60">
              {status.state==="loading"?"Mengirim...":"Konfirmasi Reservasi"}
            </button>
            {status.state!=="idle" && (
              <span className={status.state==="success"?"text-emerald-600":status.state==="error"?"text-rose-600":"text-zinc-600"}>
                {status.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Aurora Cafe</p>
        <div className="flex gap-4 text-sm">
          <a href="#menu" className="hover:text-amber-600">Menu</a>
          <a href="#reservation" className="hover:text-amber-600">Reservasi</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <Hero />
      <MenuSection />
      <Reservation />
      <Footer />
    </div>
  );
}
