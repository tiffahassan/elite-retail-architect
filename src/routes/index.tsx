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
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ناتشورال آند إيليت — لوحة التحكم" },
      {
        name: "description",
        content:
          "ناتشورال آند إيليت — نظام نقاط بيع وإدارة مخزون احترافي لمستحضرات التجميل والمستلزمات الطبية والمكملات الغذائية والعناية الشخصية.",
      },
      { property: "og:title", content: "ناتشورال آند إيليت — لوحة التحكم" },
      {
        property: "og:description",
        content: "نقي بالطبيعة. متميّز بالاختيار. نظام نقاط بيع وإدارة مخزون فاخر.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Lang = "ar" | "en";

const t = {
  ar: {
    brand: "ناتشورال آند إيليت",
    system: "نظام نقاط البيع",
    tagline: "نقي بالطبيعة. متميّز بالاختيار.",
    signOut: "تسجيل الخروج",
    role: "مديرة المتجر",
    searchPh: "ابحث عن الأصناف والفواتير والعملاء…",
    dashboard: "لوحة التحكم",
    welcome: "أهلاً بعودتك — إليك ما يجري في متجرك اليوم.",
    nav: {
      dashboard: "لوحة التحكم",
      pos: "نقاط البيع",
      inventory: "المخزون",
      products: "الأصناف",
      customers: "العملاء",
      suppliers: "الموردون",
      invoices: "الفواتير",
      reports: "التقارير",
      settings: "الإعدادات",
    },
    kpis: {
      todaySales: "مبيعات اليوم",
      monthlySales: "مبيعات الشهر",
      netProfit: "صافي الربح",
      lowStock: "الأصناف منخفضة المخزون",
      expiry: "تنبيهات الصلاحية",
      cash: "رصيد الخزينة",
      items: "صنف",
      within30: "خلال ٣٠ يوم",
      drawer: "الدرج",
    },
    salesOverview: "نظرة عامة على المبيعات",
    last12: "آخر ١٢ شهراً",
    currency: "ج.م",
    categoryMix: "توزيع الفئات",
    revenueShare: "حصة الإيرادات",
    categories: ["مستحضرات التجميل", "المكملات الغذائية", "المستلزمات الطبية", "العناية الشخصية"],
    recentSales: "أحدث المبيعات",
    latestTx: "آخر المعاملات",
    viewAll: "عرض الكل",
    table: {
      invoice: "الفاتورة",
      customer: "العميل",
      items: "الأصناف",
      total: "الإجمالي",
      status: "الحالة",
    },
    paid: "مدفوعة",
    refund: "مرتجع",
    months: ["ي", "ف", "م", "أ", "م", "ي", "ي", "أ", "س", "أ", "ن", "د"],
    walkIn: "عميل عابر",
    customers: ["ليلى حداد", "عمر خالد", "عميل عابر", "سارة علي", "أحمد ناصر"],
    footer: "© {year} ناتشورال آند إيليت — نقي بالطبيعة. متميّز بالاختيار.",
    langToggle: "EN",
    themeLabel: "تبديل الوضع",
  },
  en: {
    brand: "Natural & Elite",
    system: "POS System",
    tagline: "Pure by Nature. Elite by Choice.",
    signOut: "Sign out",
    role: "Store Manager",
    searchPh: "Search products, invoices, customers…",
    dashboard: "Dashboard",
    welcome: "Welcome back — here is what's happening in your store today.",
    nav: {
      dashboard: "Dashboard",
      pos: "Point of Sale",
      inventory: "Inventory",
      products: "Products",
      customers: "Customers",
      suppliers: "Suppliers",
      invoices: "Invoices",
      reports: "Reports",
      settings: "Settings",
    },
    kpis: {
      todaySales: "Today's Sales",
      monthlySales: "Monthly Sales",
      netProfit: "Net Profit",
      lowStock: "Low Stock",
      expiry: "Expiry Alerts",
      cash: "Cash Balance",
      items: "items",
      within30: "≤ 30 days",
      drawer: "drawer",
    },
    salesOverview: "Sales overview",
    last12: "Last 12 months",
    currency: "EGP",
    categoryMix: "Category mix",
    revenueShare: "Revenue share",
    categories: ["Cosmetics", "Supplements", "Medical", "Personal Care"],
    recentSales: "Recent sales",
    latestTx: "Latest transactions",
    viewAll: "View all",
    table: {
      invoice: "Invoice",
      customer: "Customer",
      items: "Items",
      total: "Total",
      status: "Status",
    },
    paid: "Paid",
    refund: "Refund",
    months: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    walkIn: "Walk-in",
    customers: ["Layla Haddad", "Omar Khaled", "Walk-in", "Sara Ali", "Ahmad Nasser"],
    footer: "© {year} Natural & Elite POS — Pure by Nature. Elite by Choice.",
    langToggle: "AR",
    themeLabel: "Toggle theme",
  },
} as const;

const chartData = [42, 55, 48, 63, 72, 68, 81, 74, 88, 95, 84, 102];

function Dashboard() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("ar");
  const L = t[lang];
  const isRtl = lang === "ar";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [dark, isRtl, lang]);

  const navItems = [
    { icon: LayoutDashboard, label: L.nav.dashboard, active: true },
    { icon: ShoppingCart, label: L.nav.pos },
    { icon: Boxes, label: L.nav.inventory },
    { icon: Package, label: L.nav.products },
    { icon: Users, label: L.nav.customers },
    { icon: Truck, label: L.nav.suppliers },
    { icon: Receipt, label: L.nav.invoices },
    { icon: BarChart3, label: L.nav.reports },
    { icon: Settings, label: L.nav.settings },
  ];

  const kpis = [
    { label: L.kpis.todaySales, value: "٤٬٢٨٥٫٦٠ ج.م", delta: "+12.4%", icon: DollarSign, tone: "gold" },
    { label: L.kpis.monthlySales, value: "١٢٨٬٩٤٠ ج.م", delta: "+8.1%", icon: TrendingUp, tone: "sage" },
    { label: L.kpis.netProfit, value: "٤٢٬٣١٠ ج.م", delta: "+5.7%", icon: Wallet, tone: "gold" },
    { label: L.kpis.lowStock, value: "23", delta: L.kpis.items, icon: AlertTriangle, tone: "warn" },
    { label: L.kpis.expiry, value: "9", delta: L.kpis.within30, icon: CalendarClock, tone: "warn" },
    { label: L.kpis.cash, value: "١٢٬٥٤٠ ج.م", delta: L.kpis.drawer, icon: Wallet, tone: "sage" },
  ];

  const donut = [
    { label: L.categories[0], value: 38, color: "var(--ne-gold)" },
    { label: L.categories[1], value: 27, color: "var(--ne-sage)" },
    { label: L.categories[2], value: 22, color: "#7A9E7E" },
    { label: L.categories[3], value: 13, color: "#C9A96B" },
  ];

  const recentSales = [
    { id: "INV-10241", customer: L.customers[0], items: 4, total: "١٨٦٫٢٠ ج.م", status: "paid" as const },
    { id: "INV-10240", customer: L.customers[1], items: 2, total: "٥٤٫٠٠ ج.م", status: "paid" as const },
    { id: "INV-10239", customer: L.customers[2], items: 7, total: "٣١٢٫٧٥ ج.م", status: "paid" as const },
    { id: "INV-10238", customer: L.customers[3], items: 1, total: "٢٤٫٩٠ ج.م", status: "refund" as const },
    { id: "INV-10237", customer: L.customers[4], items: 3, total: "٩٨٫٤٠ ج.م", status: "paid" as const },
  ];

  const max = Math.max(...chartData);
  const total = donut.reduce((s, d) => s + d.value, 0);
  let acc = 0;

  const fontStack = isRtl
    ? '"Cairo", system-ui, sans-serif'
    : '"Cairo", system-ui, sans-serif';
  const serifStack = isRtl
    ? '"Cairo", "Amiri", serif'
    : '"Amiri", "Cairo", serif';

  return (
    <div
      className="min-h-screen"
      style={{
        background: dark ? "#12110E" : "#F8F6F1",
        color: dark ? "#EDE7D9" : "#2A2620",
        fontFamily: fontStack,
        // @ts-expect-error css var
        "--ne-gold": "#C9A96B",
        "--ne-sage": "#8FAE8B",
        "--ne-ink": dark ? "#EDE7D9" : "#2A2620",
        "--ne-surface": dark ? "#1B1A16" : "#FFFFFF",
        "--ne-border": dark ? "#2A2822" : "#EAE4D5",
        "--ne-serif": serifStack,
      }}
    >
      <style>{`.font-serif{font-family:var(--ne-serif) !important;}`}</style>
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 min-h-screen p-5 border-e"
          style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-full grid place-items-center text-white font-serif text-lg"
              style={{ background: "var(--ne-gold)" }}
            >
              {isRtl ? "ن" : "N"}
            </div>
            <div>
              <div className="font-serif text-lg leading-tight">{L.brand}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-60">{L.system}</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((n) => (
              <button
                key={n.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-start"
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
            <LogOut size={18} /> {L.signOut}
          </button>

          <p className="mt-6 text-[11px] italic text-center opacity-60 font-serif">
            {L.tagline}
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
                placeholder={L.searchPh}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <button
              onClick={() => setLang((v) => (v === "ar" ? "en" : "ar"))}
              className="text-xs px-3 py-2 rounded-lg border hidden sm:block font-medium"
              style={{ borderColor: "var(--ne-border)" }}
            >
              {L.langToggle}
            </button>
            <button
              onClick={() => setDark((v) => !v)}
              className="p-2 rounded-lg border"
              style={{ borderColor: "var(--ne-border)" }}
              aria-label={L.themeLabel}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="p-2 rounded-lg border relative"
              style={{ borderColor: "var(--ne-border)" }}
            >
              <Bell size={16} />
              <span
                className="absolute -top-1 -end-1 w-4 h-4 text-[10px] rounded-full grid place-items-center text-white"
                style={{ background: "var(--ne-gold)" }}
              >
                3
              </span>
            </button>
            <div className="flex items-center gap-2 ps-2">
              <div
                className="w-9 h-9 rounded-full grid place-items-center text-white text-sm font-medium"
                style={{ background: "var(--ne-sage)" }}
              >
                {isRtl ? "ر" : "RS"}
              </div>
              <div className="hidden md:block leading-tight">
                <div className="text-sm font-medium">{isRtl ? "رانيا س." : "Rania S."}</div>
                <div className="text-[11px] opacity-60">{L.role}</div>
              </div>
            </div>
          </header>

          <div className="p-5 lg:p-8 space-y-6">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl">{L.dashboard}</h1>
              <p className="text-sm opacity-70 mt-1">{L.welcome}</p>
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
                    <h2 className="font-serif text-xl">{L.salesOverview}</h2>
                    <p className="text-xs opacity-60">{L.last12}</p>
                  </div>
                  <div className="text-xs opacity-70">{L.currency}</div>
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
                      <span className="text-[10px] opacity-60">{L.months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
              >
                <h2 className="font-serif text-xl mb-1">{L.categoryMix}</h2>
                <p className="text-xs opacity-60 mb-4">{L.revenueShare}</p>
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
                  <h2 className="font-serif text-xl">{L.recentSales}</h2>
                  <p className="text-xs opacity-60">{L.latestTx}</p>
                </div>
                <button
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ background: "var(--ne-gold)", color: "#fff" }}
                >
                  {L.viewAll}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-start opacity-60 text-xs">
                      <th className="px-5 py-3 font-medium text-start">{L.table.invoice}</th>
                      <th className="px-5 py-3 font-medium text-start">{L.table.customer}</th>
                      <th className="px-5 py-3 font-medium text-start">{L.table.items}</th>
                      <th className="px-5 py-3 font-medium text-start">{L.table.total}</th>
                      <th className="px-5 py-3 font-medium text-start">{L.table.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((s) => (
                      <tr key={s.id} className="border-t" style={{ borderColor: "var(--ne-border)" }}>
                        <td className="px-5 py-3 font-mono text-xs" dir="ltr">{s.id}</td>
                        <td className="px-5 py-3">{s.customer}</td>
                        <td className="px-5 py-3">{s.items}</td>
                        <td className="px-5 py-3 font-medium" dir="ltr">{s.total}</td>
                        <td className="px-5 py-3">
                          <span
                            className="text-[11px] px-2 py-1 rounded-full"
                            style={{
                              background:
                                s.status === "paid"
                                  ? "rgba(143,174,139,0.18)"
                                  : "rgba(217,119,87,0.18)",
                              color: s.status === "paid" ? "#4E7A52" : "#B45A3C",
                            }}
                          >
                            {s.status === "paid" ? L.paid : L.refund}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="pt-4 pb-2 text-center text-xs opacity-60 font-serif italic">
              {L.footer.replace("{year}", String(new Date().getFullYear()))}
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
