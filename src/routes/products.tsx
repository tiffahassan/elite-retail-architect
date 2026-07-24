import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Upload,
  Download,
  Moon,
  Sun,
  Bell,
  ArrowRight,
  Package,
  X,
  ImageIcon,
  Filter,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  useProducts,
  productsStore,
  stockStatus,
  expiryStatus,
  type Product,
} from "@/lib/products-store";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "الأصناف — ناتشورال آند إيليت" },
      {
        name: "description",
        content:
          "إدارة الأصناف: الباركود، الأسعار، الكميات، الصلاحيات، الاستيراد والتصدير من إكسل — نظام ناتشورال آند إيليت.",
      },
      { property: "og:title", content: "الأصناف — ناتشورال آند إيليت" },
      {
        property: "og:description",
        content: "إدارة كاملة للأصناف مع الاستيراد والتصدير من إكسل.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

const CATEGORIES = [
  "مستحضرات التجميل",
  "المستلزمات الطبية",
  "المكملات الغذائية",
  "العناية الشخصية",
];

const emptyProduct: Omit<Product, "id"> = {
  barcode: "",
  sku: "",
  nameAr: "",
  nameEn: "",
  category: CATEGORIES[0],
  brand: "",
  supplier: "",
  unit: "قطعة",
  purchasePrice: 0,
  sellingPrice: 0,
  minSellingPrice: 0,
  quantity: 0,
  minStock: 0,
  batchNumber: "",
  mfgDate: new Date().toISOString().slice(0, 10),
  expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
  warehouse: "المستودع الرئيسي",
  imageUrl: "",
  notes: "",
};

function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${dt.getFullYear()}`;
}

function fmtEGP(n: number) {
  return `${n.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`;
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="fixed bottom-6 start-6 z-50 rounded-xl px-4 py-3 text-sm shadow-lg"
      style={{ background: "var(--ne-surface)", border: "1px solid var(--ne-border)", color: "var(--ne-ink)" }}
    >
      {msg}
    </div>
  );
}

function ProductsPage() {
  const navigate = useNavigate();
  const products = useProducts();
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [supFilter, setSupFilter] = useState("all");
  const [expFilter, setExpFilter] = useState<"all" | "valid" | "soon" | "expired">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<Product | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, [dark]);

  const suppliers = useMemo(
    () => Array.from(new Set(products.map((p) => p.supplier))).filter(Boolean),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.nameAr.toLowerCase().includes(q) && !p.nameEn.toLowerCase().includes(q) && !p.barcode.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (supFilter !== "all" && p.supplier !== supFilter) return false;
      if (expFilter !== "all" && expiryStatus(p) !== expFilter) return false;
      return true;
    });
  }, [products, query, catFilter, supFilter, expFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = p;
    setForm(rest);
    setDialogOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr.trim()) return;
    if (editing) {
      productsStore.update(editing.id, form);
      setToast("تم تحديث الصنف بنجاح");
    } else {
      productsStore.add(form);
      setToast("تم إضافة الصنف بنجاح");
    }
    setDialogOpen(false);
  };

  const doDelete = () => {
    if (!confirmDel) return;
    productsStore.remove(confirmDel.id);
    setToast("تم حذف الصنف");
    setConfirmDel(null);
  };

  const doDuplicate = (p: Product) => {
    productsStore.duplicate(p.id);
    setToast("تم إنشاء نسخة من الصنف");
  };

  const exportExcel = () => {
    const rows = filtered.map((p) => ({
      "الباركود": p.barcode,
      "الكود الداخلي": p.sku,
      "الاسم بالعربية": p.nameAr,
      "الاسم بالإنجليزية": p.nameEn,
      "التصنيف": p.category,
      "العلامة التجارية": p.brand,
      "المورد": p.supplier,
      "الوحدة": p.unit,
      "سعر الشراء": p.purchasePrice,
      "سعر البيع": p.sellingPrice,
      "أقل سعر بيع": p.minSellingPrice,
      "الكمية": p.quantity,
      "أقل مخزون": p.minStock,
      "رقم التشغيلة": p.batchNumber,
      "تاريخ الإنتاج": p.mfgDate,
      "تاريخ الصلاحية": p.expiryDate,
      "المستودع": p.warehouse,
      "صورة": p.imageUrl,
      "ملاحظات": p.notes,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, `products-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setToast("تم تصدير الأصناف إلى إكسل");
  };

  const importExcel = async (f: File) => {
    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
    const parsed: Omit<Product, "id">[] = rows.map((r) => ({
      barcode: String(r["الباركود"] ?? r["Barcode"] ?? ""),
      sku: String(r["الكود الداخلي"] ?? r["SKU"] ?? ""),
      nameAr: String(r["الاسم بالعربية"] ?? r["Name AR"] ?? ""),
      nameEn: String(r["الاسم بالإنجليزية"] ?? r["Name EN"] ?? ""),
      category: String(r["التصنيف"] ?? r["Category"] ?? CATEGORIES[0]),
      brand: String(r["العلامة التجارية"] ?? r["Brand"] ?? ""),
      supplier: String(r["المورد"] ?? r["Supplier"] ?? ""),
      unit: String(r["الوحدة"] ?? r["Unit"] ?? "قطعة"),
      purchasePrice: Number(r["سعر الشراء"] ?? r["Purchase Price"] ?? 0),
      sellingPrice: Number(r["سعر البيع"] ?? r["Selling Price"] ?? 0),
      minSellingPrice: Number(r["أقل سعر بيع"] ?? r["Min Selling Price"] ?? 0),
      quantity: Number(r["الكمية"] ?? r["Quantity"] ?? 0),
      minStock: Number(r["أقل مخزون"] ?? r["Min Stock"] ?? 0),
      batchNumber: String(r["رقم التشغيلة"] ?? r["Batch"] ?? ""),
      mfgDate: String(r["تاريخ الإنتاج"] ?? r["Mfg Date"] ?? new Date().toISOString().slice(0, 10)),
      expiryDate: String(r["تاريخ الصلاحية"] ?? r["Expiry"] ?? new Date().toISOString().slice(0, 10)),
      warehouse: String(r["المستودع"] ?? r["Warehouse"] ?? "المستودع الرئيسي"),
      imageUrl: String(r["صورة"] ?? r["Image"] ?? ""),
      notes: String(r["ملاحظات"] ?? r["Notes"] ?? ""),
    })).filter((p) => p.nameAr || p.nameEn);
    productsStore.bulkAdd(parsed);
    setToast(`تم استيراد ${parsed.length} صنف من إكسل`);
  };

  const stockBadge = (p: Product) => {
    const s = stockStatus(p);
    const map = {
      in: { bg: "rgba(143,174,139,0.18)", fg: "#4E7A52", label: "متوفر" },
      low: { bg: "rgba(217,150,55,0.20)", fg: "#B4741C", label: "منخفض" },
      out: { bg: "rgba(217,87,87,0.20)", fg: "#B43C3C", label: "نفد" },
    }[s];
    return (
      <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: map.bg, color: map.fg }}>
        {map.label}
      </span>
    );
  };

  const expBadge = (p: Product) => {
    const s = expiryStatus(p);
    const map = {
      valid: { bg: "rgba(143,174,139,0.18)", fg: "#4E7A52", label: "سارية" },
      soon: { bg: "rgba(217,150,55,0.20)", fg: "#B4741C", label: "قريبة الانتهاء" },
      expired: { bg: "rgba(217,87,87,0.20)", fg: "#B43C3C", label: "منتهية" },
    }[s];
    return (
      <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: map.bg, color: map.fg }}>
        {map.label}
      </span>
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: dark ? "#12110E" : "#F8F6F1",
        color: dark ? "#EDE7D9" : "#2A2620",
        fontFamily: '"Cairo", system-ui, sans-serif',
        // @ts-expect-error css var
        "--ne-gold": "#C9A96B",
        "--ne-sage": "#8FAE8B",
        "--ne-ink": dark ? "#EDE7D9" : "#2A2620",
        "--ne-surface": dark ? "#1B1A16" : "#FFFFFF",
        "--ne-border": dark ? "#2A2822" : "#EAE4D5",
        "--ne-serif": '"Amiri", "Cairo", serif',
      }}
    >
      <style>{`.font-serif{font-family:var(--ne-serif) !important;}`}</style>

      <header
        className="flex items-center gap-3 px-5 lg:px-8 py-4 border-b sticky top-0 z-10 backdrop-blur"
        style={{
          background: dark ? "rgba(27,26,22,0.85)" : "rgba(255,255,255,0.85)",
          borderColor: "var(--ne-border)",
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border"
          style={{ borderColor: "var(--ne-border)" }}
        >
          <ArrowRight size={14} />
          لوحة التحكم
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-9 h-9 rounded-full grid place-items-center text-white font-serif"
            style={{ background: "var(--ne-gold)" }}
          >
            ن
          </div>
          <div className="hidden md:block leading-tight">
            <div className="font-serif text-base">ناتشورال آند إيليت</div>
            <div className="text-[10px] tracking-[0.2em] uppercase opacity-60">
              إدارة الأصناف
            </div>
          </div>
        </div>
        <button
          onClick={() => setDark((v) => !v)}
          className="p-2 rounded-lg border"
          style={{ borderColor: "var(--ne-border)" }}
          aria-label="تبديل الوضع"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          className="p-2 rounded-lg border relative"
          style={{ borderColor: "var(--ne-border)" }}
          aria-label="الإشعارات"
        >
          <Bell size={16} />
        </button>
      </header>

      <main className="p-5 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl flex items-center gap-3">
              <Package size={28} style={{ color: "var(--ne-gold)" }} />
              الأصناف
            </h1>
            <p className="text-sm opacity-70 mt-1">
              إدارة كاملة للأصناف، الأسعار، الكميات والصلاحيات
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importExcel(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border"
              style={{ borderColor: "var(--ne-border)" }}
            >
              <Upload size={14} /> استيراد
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border"
              style={{ borderColor: "var(--ne-border)" }}
            >
              <Download size={14} /> تصدير
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg text-white font-medium"
              style={{ background: "var(--ne-gold)" }}
            >
              <Plus size={16} /> إضافة صنف
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className="rounded-2xl p-4 border grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3"
          style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border xl:col-span-2"
            style={{ borderColor: "var(--ne-border)" }}
          >
            <Search size={16} className="opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الباركود…"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm bg-transparent"
            style={{ borderColor: "var(--ne-border)" }}
          >
            <option value="all">كل التصنيفات</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={supFilter}
            onChange={(e) => setSupFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm bg-transparent"
            style={{ borderColor: "var(--ne-border)" }}
          >
            <option value="all">كل الموردين</option>
            {suppliers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value as typeof expFilter)}
            className="px-3 py-2 rounded-lg border text-sm bg-transparent"
            style={{ borderColor: "var(--ne-border)" }}
          >
            <option value="all">كل الصلاحيات</option>
            <option value="valid">سارية</option>
            <option value="soon">قريبة الانتهاء</option>
            <option value="expired">منتهية</option>
          </select>
        </div>

        <div className="text-xs opacity-60 flex items-center gap-2">
          <Filter size={12} /> عرض {filtered.length} من {products.length} صنف
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="opacity-60 text-xs" style={{ borderBottom: "1px solid var(--ne-border)" }}>
                  <th className="px-4 py-3 font-medium text-start">الصورة</th>
                  <th className="px-4 py-3 font-medium text-start">الاسم</th>
                  <th className="px-4 py-3 font-medium text-start">الباركود / SKU</th>
                  <th className="px-4 py-3 font-medium text-start">التصنيف</th>
                  <th className="px-4 py-3 font-medium text-start">المورد</th>
                  <th className="px-4 py-3 font-medium text-start">سعر البيع</th>
                  <th className="px-4 py-3 font-medium text-start">الكمية</th>
                  <th className="px-4 py-3 font-medium text-start">الصلاحية</th>
                  <th className="px-4 py-3 font-medium text-start">الحالة</th>
                  <th className="px-4 py-3 font-medium text-start">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid var(--ne-border)" }}>
                    <td className="px-4 py-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.nameAr}
                          className="w-12 h-12 rounded-lg object-cover border"
                          style={{ borderColor: "var(--ne-border)" }}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg grid place-items-center opacity-40 border"
                          style={{ borderColor: "var(--ne-border)" }}
                        >
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.nameAr}</div>
                      <div className="text-xs opacity-60" dir="ltr">{p.nameEn}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" dir="ltr">
                      <div className="font-mono">{p.barcode}</div>
                      <div className="opacity-60">{p.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-xs">{p.supplier}</td>
                    <td className="px-4 py-3 font-medium" dir="ltr">{fmtEGP(p.sellingPrice)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.quantity}</span>
                        {stockBadge(p)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs" dir="ltr">{fmtDate(p.expiryDate)}</div>
                      <div className="mt-1">{expBadge(p)}</div>
                    </td>
                    <td className="px-4 py-3 text-xs opacity-70">{p.brand}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                          title="تعديل"
                        >
                          <Pencil size={14} style={{ color: "var(--ne-sage)" }} />
                        </button>
                        <button
                          onClick={() => doDuplicate(p)}
                          className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                          title="تكرار"
                        >
                          <Copy size={14} style={{ color: "var(--ne-gold)" }} />
                        </button>
                        <button
                          onClick={() => setConfirmDel(p)}
                          className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                          title="حذف"
                        >
                          <Trash2 size={14} style={{ color: "#B43C3C" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center opacity-60 text-sm">
                      لا توجد أصناف مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setDialogOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl border max-h-[90vh] overflow-y-auto"
            style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b sticky top-0"
              style={{ borderColor: "var(--ne-border)", background: "var(--ne-surface)" }}
            >
              <div>
                <h2 className="font-serif text-2xl">
                  {editing ? "تعديل صنف" : "إضافة صنف جديد"}
                </h2>
                <p className="text-xs opacity-60 mt-1">
                  أدخل بيانات الصنف كاملة. الحقول المعلمة بـ (*) إلزامية.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="الاسم بالعربية *">
                <input
                  required
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="الاسم بالإنجليزية">
                <input
                  dir="ltr"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="الباركود">
                <input
                  dir="ltr"
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm font-mono"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="الكود الداخلي (SKU)">
                <input
                  dir="ltr"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm font-mono"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="التصنيف">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="العلامة التجارية">
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="المورد">
                <input
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="الوحدة">
                <input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="سعر الشراء (ج.م)">
                <input
                  type="number"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={(e) => setForm({ ...form, purchasePrice: +e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="سعر البيع (ج.م)">
                <input
                  type="number"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={(e) => setForm({ ...form, sellingPrice: +e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="أقل سعر بيع (ج.م)">
                <input
                  type="number"
                  step="0.01"
                  value={form.minSellingPrice}
                  onChange={(e) => setForm({ ...form, minSellingPrice: +e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="الكمية الحالية">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="أقل مخزون">
                <input
                  type="number"
                  value={form.minStock}
                  onChange={(e) => setForm({ ...form, minStock: +e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="رقم التشغيلة">
                <input
                  value={form.batchNumber}
                  onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="تاريخ الإنتاج">
                <input
                  type="date"
                  value={form.mfgDate}
                  onChange={(e) => setForm({ ...form, mfgDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="تاريخ الصلاحية">
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="المستودع">
                <input
                  value={form.warehouse}
                  onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <Field label="رابط صورة المنتج">
                <input
                  dir="ltr"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://…"
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                  style={{ borderColor: "var(--ne-border)" }}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="ملاحظات">
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
                    style={{ borderColor: "var(--ne-border)" }}
                  />
                </Field>
              </div>
              {form.imageUrl && (
                <div className="md:col-span-2">
                  <img
                    src={form.imageUrl}
                    alt="معاينة"
                    className="w-24 h-24 rounded-lg object-cover border"
                    style={{ borderColor: "var(--ne-border)" }}
                  />
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-end gap-2 px-6 py-4 border-t sticky bottom-0"
              style={{ borderColor: "var(--ne-border)", background: "var(--ne-surface)" }}
            >
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--ne-border)" }}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: "var(--ne-gold)" }}
              >
                {editing ? "حفظ التعديلات" : "إضافة الصنف"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setConfirmDel(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ background: "var(--ne-surface)", borderColor: "var(--ne-border)" }}
          >
            <h3 className="font-serif text-xl">تأكيد الحذف</h3>
            <p className="text-sm opacity-70 mt-2">
              هل تريد حذف الصنف "{confirmDel.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDel(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--ne-border)" }}
              >
                إلغاء
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{ background: "#B43C3C" }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {/* keep navigate reference to avoid unused warning */}
      <span className="hidden">{typeof navigate}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs opacity-70 mb-1.5">{label}</div>
      {children}
    </label>
  );
}
