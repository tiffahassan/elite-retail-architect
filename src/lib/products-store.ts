import { useSyncExternalStore } from "react";

export interface Product {
  id: string;
  barcode: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  category: string;
  brand: string;
  supplier: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  minSellingPrice: number;
  quantity: number;
  minStock: number;
  batchNumber: string;
  mfgDate: string; // YYYY-MM-DD
  expiryDate: string;
  warehouse: string;
  imageUrl: string;
  notes: string;
}

const STORAGE_KEY = "ne_products_v1";

const seed: Product[] = [
  {
    id: crypto.randomUUID(),
    barcode: "6221031492001",
    sku: "COS-LIP-001",
    nameAr: "أحمر شفاه ماتي فاخر",
    nameEn: "Luxury Matte Lipstick",
    category: "مستحضرات التجميل",
    brand: "Elite Beauty",
    supplier: "شركة الجمال للتوزيع",
    unit: "قطعة",
    purchasePrice: 85,
    sellingPrice: 165,
    minSellingPrice: 140,
    quantity: 42,
    minStock: 10,
    batchNumber: "LB-2025-A12",
    mfgDate: "2025-03-10",
    expiryDate: "2027-03-10",
    warehouse: "المستودع الرئيسي",
    imageUrl:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop",
    notes: "لون أحمر كلاسيكي",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221031492002",
    sku: "COS-FND-002",
    nameAr: "كريم أساس مرطب",
    nameEn: "Hydrating Foundation",
    category: "مستحضرات التجميل",
    brand: "Natural Glow",
    supplier: "شركة الجمال للتوزيع",
    unit: "قطعة",
    purchasePrice: 210,
    sellingPrice: 385,
    minSellingPrice: 340,
    quantity: 6,
    minStock: 8,
    batchNumber: "FD-2025-B03",
    mfgDate: "2025-01-05",
    expiryDate: "2026-08-05",
    warehouse: "المستودع الرئيسي",
    imageUrl:
      "https://images.unsplash.com/photo-1631214524020-3c8895a1a89a?w=200&h=200&fit=crop",
    notes: "",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221055100010",
    sku: "MED-MSK-010",
    nameAr: "كمامات طبية معقمة (50 قطعة)",
    nameEn: "Sterile Medical Masks (50 pcs)",
    category: "المستلزمات الطبية",
    brand: "MediCare",
    supplier: "المصرية للمستلزمات الطبية",
    unit: "علبة",
    purchasePrice: 55,
    sellingPrice: 95,
    minSellingPrice: 80,
    quantity: 120,
    minStock: 25,
    batchNumber: "MSK-2024-Q4",
    mfgDate: "2024-10-01",
    expiryDate: "2029-10-01",
    warehouse: "مستودع المستلزمات الطبية",
    imageUrl:
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=200&h=200&fit=crop",
    notes: "",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221055100011",
    sku: "MED-GLV-011",
    nameAr: "قفازات نتريل مقاس M",
    nameEn: "Nitrile Gloves Size M",
    category: "المستلزمات الطبية",
    brand: "MediCare",
    supplier: "المصرية للمستلزمات الطبية",
    unit: "علبة",
    purchasePrice: 120,
    sellingPrice: 195,
    minSellingPrice: 170,
    quantity: 0,
    minStock: 15,
    batchNumber: "GLV-2024-08",
    mfgDate: "2024-08-15",
    expiryDate: "2027-08-15",
    warehouse: "مستودع المستلزمات الطبية",
    imageUrl:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
    notes: "نفدت الكمية — يحتاج إعادة طلب",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221088900101",
    sku: "SUP-OMG-101",
    nameAr: "أوميجا 3 - 1000 مج",
    nameEn: "Omega 3 - 1000 mg",
    category: "المكملات الغذائية",
    brand: "VitaPlus",
    supplier: "شركة الصحة للمكملات",
    unit: "عبوة",
    purchasePrice: 145,
    sellingPrice: 265,
    minSellingPrice: 230,
    quantity: 34,
    minStock: 10,
    batchNumber: "OMG-2025-01",
    mfgDate: "2025-01-20",
    expiryDate: "2026-03-01",
    warehouse: "المستودع الرئيسي",
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
    notes: "قريب من الصلاحية",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221088900102",
    sku: "SUP-VTC-102",
    nameAr: "فيتامين سي فوار",
    nameEn: "Vitamin C Effervescent",
    category: "المكملات الغذائية",
    brand: "VitaPlus",
    supplier: "شركة الصحة للمكملات",
    unit: "علبة",
    purchasePrice: 60,
    sellingPrice: 110,
    minSellingPrice: 95,
    quantity: 78,
    minStock: 20,
    batchNumber: "VTC-2025-02",
    mfgDate: "2025-02-10",
    expiryDate: "2027-02-10",
    warehouse: "المستودع الرئيسي",
    imageUrl:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&h=200&fit=crop",
    notes: "",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221077700201",
    sku: "PC-SHM-201",
    nameAr: "شامبو الأرغان الفاخر",
    nameEn: "Argan Luxury Shampoo",
    category: "العناية الشخصية",
    brand: "Nature Care",
    supplier: "مؤسسة العناية الشاملة",
    unit: "قطعة",
    purchasePrice: 90,
    sellingPrice: 175,
    minSellingPrice: 150,
    quantity: 24,
    minStock: 12,
    batchNumber: "SHM-2024-11",
    mfgDate: "2024-11-01",
    expiryDate: "2025-12-15",
    warehouse: "المستودع الرئيسي",
    imageUrl:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop",
    notes: "",
  },
  {
    id: crypto.randomUUID(),
    barcode: "6221077700202",
    sku: "PC-CRM-202",
    nameAr: "كريم مرطب لليدين",
    nameEn: "Hand Moisturizing Cream",
    category: "العناية الشخصية",
    brand: "Nature Care",
    supplier: "مؤسسة العناية الشاملة",
    unit: "قطعة",
    purchasePrice: 45,
    sellingPrice: 89,
    minSellingPrice: 75,
    quantity: 60,
    minStock: 15,
    batchNumber: "CRM-2025-01",
    mfgDate: "2025-01-15",
    expiryDate: "2027-01-15",
    warehouse: "المستودع الرئيسي",
    imageUrl:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
    notes: "",
  },
];

function load(): Product[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Product[];
  } catch {
    return seed;
  }
}

let state: Product[] = typeof window !== "undefined" ? load() : seed;
const listeners = new Set<() => void>();

function commit(next: Product[]) {
  state = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export const productsStore = {
  get: () => state,
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  add: (p: Omit<Product, "id">) => commit([{ ...p, id: crypto.randomUUID() }, ...state]),
  update: (id: string, p: Partial<Product>) =>
    commit(state.map((x) => (x.id === id ? { ...x, ...p } : x))),
  remove: (id: string) => commit(state.filter((x) => x.id !== id)),
  duplicate: (id: string) => {
    const src = state.find((x) => x.id === id);
    if (!src) return;
    const copy: Product = {
      ...src,
      id: crypto.randomUUID(),
      sku: src.sku + "-COPY",
      barcode: src.barcode + "-C",
      nameAr: src.nameAr + " (نسخة)",
      nameEn: src.nameEn + " (Copy)",
    };
    commit([copy, ...state]);
  },
  replaceAll: (list: Product[]) => commit(list),
  bulkAdd: (list: Omit<Product, "id">[]) =>
    commit([...list.map((p) => ({ ...p, id: crypto.randomUUID() })), ...state]),
};

export function useProducts(): Product[] {
  return useSyncExternalStore(
    productsStore.subscribe,
    productsStore.get,
    () => seed,
  );
}

export function stockStatus(p: Product): "in" | "low" | "out" {
  if (p.quantity <= 0) return "out";
  if (p.quantity <= p.minStock) return "low";
  return "in";
}

export function expiryStatus(p: Product): "valid" | "soon" | "expired" {
  const now = new Date();
  const exp = new Date(p.expiryDate);
  const days = (exp.getTime() - now.getTime()) / 86400000;
  if (days < 0) return "expired";
  if (days <= 60) return "soon";
  return "valid";
}
