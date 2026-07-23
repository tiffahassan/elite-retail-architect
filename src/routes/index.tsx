import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Wallet,
  CalendarClock,
  Search,
  Bell,
  Moon,
  Sun,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Users,
  Truck,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Natural & Elite POS — Dashboard" },
      {
        name: "description",
        content:
          "Natural & Elite POS — Pure by Nature. Elite by Choice. Premium POS & inventory management for cosmetics, medical supplies, supplements and personal care.",
      },
      { property: "og:title", content: "Natural & Elite POS — Dashboard" },
      {
        property: "og:description",
        content: "Pure by Nature. Elite by Choice. Premium POS & inventory management dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ShoppingCart, label: "Point of Sale" },
  { icon: Boxes, label: "Inventory" },
  { icon: Package, label: "Products" },
  { icon: Users, label: "Customers" },
  { icon: Truck, label: "Suppliers" },
  { icon: Receipt, label: "Invoices" },
  { icon: Settings, label: "Settings" },
];

const kpis = [
  { label: "Today's Sales", value: "$4,285.60", delta: "+12.4%", icon: DollarSign, tone: "gold" },
  { label: "Monthly Sales", value: "$128,940", delta: "+8.1%", icon: TrendingUp, tone: "sage" },
  { label: "Net Profit", value: "$42,310", delta: "+5.7%", icon: Wallet, tone: "gold" },
  { label: "Low Stock", value: "23", delta: "items", icon: AlertTriangle, tone: "warn" },
  { label: "Expiry Alerts", value: "9", delta: "≤ 30 days", icon: CalendarClock, tone: "warn" },
  { label: "Cash Balance", value: "$12,540", delta: "drawer", icon: Wallet, tone: "sage" },
];

const recentSales = [
  { id: "INV-10241", customer: "Layla Haddad", items: 4, total: "$186.20", status: "Paid" },
  { id: "INV-10240", customer: "Omar Khaled", items: 2, total: "$54.00", status: "Paid" },
  { id: "INV-10239", customer: "Walk-in", items: 7, total: "$312.75", status: "Paid" },
  { id: "INV-10238", customer: "Sara Ali", items: 1, total: "$24.90", status: "Refund" },
  { id: "INV-10237", customer: "Ahmad Nasser", items: 3, total: "$98.40", status: "Paid" },
];

const chartData = [42, 55, 48, 63, 72, 68, 81, 74, 88, 95, 84, 102];
const donut = [
  { label: "Cosmetics", value: 38, color: "var(--ne-gold)" },
  { label: "Supplements", value: 27, color: "var(--ne-sage)" },
  { label: "Medical", value: 22, color: "#7A9E7E" },
  { label: "Personal Care", value: 13, color: "#C9A96B" },
];

function Dashboard() {
  const [dark, setDark] = useState(false);
  const [rtl, setRtl] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [dark, rtl]);

  const max = Math.max(...chartData);
  const total = donut.reduce((s, d) => s + d.value, 0);
  let acc = 0;

  return (
    <div
      className="min-h-screen"
      style={{
        background: dark ? "#12110E" : "#F8F6F1",
        color: dark ? "#EDE7D9" : "#2A2620",
        // Theme tokens for this page
        // @ts-expect-error css var
        "--ne-gold": "#C9A96B",
        "--ne-sage": "#8FAE8B",
        "--ne-ink": dark ? "#EDE7D9" : "#2A2620",
        "--ne-surface": dark ? "#1B1A16" : "#FFFFFF",
        "--ne-border": dark ? "#2A2822" : "#EAE4D5",
      }}
    >
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 min-h-screen p-5 border-r"
          style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-full grid place-items-center text-white font-serif text-lg"
              style={{ background: "var(--ne-gold)" }}
            >
              N
            </div>
            <div>
              <div className="font-serif text-lg leading-tight">Natural & Elite</div>
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-60">POS System</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {nav.map((n) => (
              <button
                key={n.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  background: n.active ? "rgba(201,169,107,0.12)" : "transparent",
                  color: n.active ? "var(--ne-gold)" : "inherit",
                  fontWeight: n.active ? 600 : 400,
                }}
              >
                <n.icon size={18} />
                {n.label}
              </button>
            ))}
          </nav>

          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm opacity-70 hover:opacity-100">
            <LogOut size={18} /> Sign out
          </button>

          <p className="mt-6 text-[11px] italic text-center opacity-60 font-serif">
            Pure by Nature. Elite by Choice.
          </p>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <header
            className="flex items-center gap-3 px-5 lg:px-8 py-4 border-b sticky top-0 z-10 backdrop-blur"
            style={{
              background: dark ? "rgba(27,26,22,0.85)" : "rgba(255,255,255,0.85)",
              borderColor: "var(--ne-border)",
            }}
          >
            <div
              className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg border"
              style={{ borderColor: "var(--ne-border)" }}
            >
              <Search size={16} className="opacity-60" />
              <input
                placeholder="Search products, invoices, customers…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <button
              onClick={() => setRtl((v) => !v)}
              className="text-xs px-3 py-2 rounded-lg border hidden sm:block"
              style={{ borderColor: "var(--ne-border)" }}
            >
              {rtl ? "EN" : "AR"}
            </button>
            <button
              onClick={() => setDark((v) => !v)}
              className="p-2 rounded-lg border"
              style={{ borderColor: "var(--ne-border)" }}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="p-2 rounded-lg border relative"
              style={{ borderColor: "var(--ne-border)" }}
            >
              <Bell size={16} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 text-[10px] rounded-full grid place-items-center text-white"
                style={{ background: "var(--ne-gold)" }}
              >
                3
              </span>
            </button>
            <div className="flex items-center gap-2 pl-2">
              <div
                className="w-9 h-9 rounded-full grid place-items-center text-white text-sm font-medium"
                style={{ background: "var(--ne-sage)" }}
              >
                RS
              </div>
              <div className="hidden md:block leading-tight">
                <div className="text-sm font-medium">Rania S.</div>
                <div className="text-[11px] opacity-60">Store Manager</div>
              </div>
            </div>
          </header>

          <div className="p-5 lg:p-8 space-y-6">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl">Dashboard</h1>
              <p className="text-sm opacity-70 mt-1">
                Welcome back — here is what's happening in your store today.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl p-4 border transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-70">{k.label}</span>
                    <div
                      className="w-8 h-8 rounded-lg grid place-items-center"
                      style={{
                        background:
                          k.tone === "gold"
                            ? "rgba(201,169,107,0.15)"
                            : k.tone === "sage"
                              ? "rgba(143,174,139,0.18)"
                              : "rgba(217,119,87,0.15)",
                        color:
                          k.tone === "gold"
                            ? "var(--ne-gold)"
                            : k.tone === "sage"
                              ? "var(--ne-sage)"
                              : "#D97757",
                      }}
                    >
                      <k.icon size={16} />
                    </div>
                  </div>
                  <div className="mt-3 font-serif text-2xl">{k.value}</div>
                  <div className="text-[11px] mt-1 opacity-70">{k.delta}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div
                className="xl:col-span-2 rounded-2xl p-5 border"
                style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-serif text-xl">Sales overview</h2>
                    <p className="text-xs opacity-60">Last 12 months</p>
                  </div>
                  <div className="text-xs opacity-70">USD</div>
                </div>
                <div className="flex items-end gap-2 h-56">
                  {chartData.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${(v / max) * 100}%`,
                          background:
                            i === chartData.length - 1
                              ? "var(--ne-gold)"
                              : "linear-gradient(180deg, var(--ne-sage), rgba(143,174,139,0.4))",
                        }}
                      />
                      <span className="text-[10px] opacity-60">
                        {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
              >
                <h2 className="font-serif text-xl mb-1">Category mix</h2>
                <p className="text-xs opacity-60 mb-4">Revenue share</p>
                <div className="flex items-center gap-5">
                  <svg viewBox="0 0 42 42" className="w-32 h-32 -rotate-90">
                    <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--ne-border)" strokeWidth="4" />
                    {donut.map((d) => {
                      const dash = (d.value / total) * 100;
                      const seg = (
                        <circle
                          key={d.label}
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="none"
                          stroke={d.color}
                          strokeWidth="4"
                          strokeDasharray={`${dash} ${100 - dash}`}
                          strokeDashoffset={-acc}
                        />
                      );
                      acc += dash;
                      return seg;
                    })}
                  </svg>
                  <ul className="space-y-2 text-sm flex-1">
                    {donut.map((d) => (
                      <li key={d.label} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: d.color }}
                          />
                          {d.label}
                        </span>
                        <span className="opacity-70">{d.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--ne-border)" }}>
                <div>
                  <h2 className="font-serif text-xl">Recent sales</h2>
                  <p className="text-xs opacity-60">Latest transactions</p>
                </div>
                <button
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ background: "var(--ne-gold)", color: "#fff" }}
                >
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left opacity-60 text-xs">
                      <th className="px-5 py-3 font-medium">Invoice</th>
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Items</th>
                      <th className="px-5 py-3 font-medium">Total</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((s) => (
                      <tr key={s.id} className="border-t" style={{ borderColor: "var(--ne-border)" }}>
                        <td className="px-5 py-3 font-mono text-xs">{s.id}</td>
                        <td className="px-5 py-3">{s.customer}</td>
                        <td className="px-5 py-3">{s.items}</td>
                        <td className="px-5 py-3 font-medium">{s.total}</td>
                        <td className="px-5 py-3">
                          <span
                            className="text-[11px] px-2 py-1 rounded-full"
                            style={{
                              background:
                                s.status === "Paid"
                                  ? "rgba(143,174,139,0.18)"
                                  : "rgba(217,119,87,0.18)",
                              color: s.status === "Paid" ? "#4E7A52" : "#B45A3C",
                            }}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="pt-4 pb-2 text-center text-xs opacity-60 font-serif italic">
              © {new Date().getFullYear()} Natural & Elite POS — Pure by Nature. Elite by Choice.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
