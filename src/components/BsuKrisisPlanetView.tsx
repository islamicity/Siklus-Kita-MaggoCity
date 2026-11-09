/**
 * BsuKrisisPlanetView - Bank Sampah Unit Pencegah Krisis Planet Module
 * Based on Malaka Jaya / DKI Jakarta Community Education Board
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  Recycle,
  Sparkles,
  Scale,
  Coins,
  ShieldCheck,
  Leaf,
  Bug,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Droplets,
  Flame,
  Search,
  Filter,
  Package,
  Plus,
  Minus,
  Check,
  Calculator,
  ShoppingBag,
  ExternalLink,
  MapPin,
  HelpCircle,
  FileText,
  Truck,
  RotateCw,
} from "lucide-react";
import {
  BSU_CATEGORIES_INFO,
  BSU_PENCEGAH_KRISIS_ITEMS,
  BSU_CIRCULAR_SOLUTIONS,
  BsuWasteItem,
} from "../data/bsuKrisisPlanetData";
import { WasteLogEntry } from "../types";
import confetti from "canvas-confetti";

interface BsuKrisisPlanetViewProps {
  isDarkMode: boolean;
  onAddWasteLog?: (log: WasteLogEntry) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const BsuKrisisPlanetView: React.FC<BsuKrisisPlanetViewProps> = ({
  isDarkMode,
  onAddWasteLog,
  onNavigateToTab,
}) => {
  // Navigation inside the BSU view
  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "solutions" | "calculator" | "exchange">(
    "catalog"
  );

  // Filters for the catalog
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItemDetail, setSelectedItemDetail] = useState<BsuWasteItem | null>(
    BSU_PENCEGAH_KRISIS_ITEMS[0]
  );

  // Interactive Digital Scale Simulator (Calculator)
  const [scaleItems, setScaleItems] = useState<Record<string, number>>({
    "logam-kaleng": 2.5,
    "plastik-bodong": 3.0,
    "kertas-kardus": 5.0,
    "lain-minyak-jelantah": 2.0,
  });

  const [simulatedNasabahName, setSimulatedNasabahName] = useState<string>("Ibu Sari (RT 03 / RW 04)");
  const [weighSuccessNotice, setWeighSuccessNotice] = useState<string | null>(null);

  // Exchange Reward catalog simulation
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return BSU_PENCEGAH_KRISIS_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === "ALL" || item.mainCategory === selectedCategory;
      const matchQuery =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aliasLabels.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Total Estimated Savings / Calculation from Scale
  const calculationSummary = useMemo(() => {
    let totalRupiah = 0;
    let totalKg = 0;
    let totalPoints = 0;
    let totalCarbonAvoided = 0;

    Object.entries(scaleItems).forEach(([itemId, qty]) => {
      const found = BSU_PENCEGAH_KRISIS_ITEMS.find((it) => it.id === itemId);
      if (found && qty > 0) {
        totalRupiah += found.currentPricePerKg * qty;
        totalKg += qty;
        totalPoints += found.pointsAwardedPerUnit * qty;
        totalCarbonAvoided += found.carbonAvoidedPerKg * qty;
      }
    });

    return {
      totalRupiah: Math.round(totalRupiah),
      totalKg: Math.round(totalKg * 10) / 10,
      totalPoints: Math.round(totalPoints),
      totalCarbonAvoided: Math.round(totalCarbonAvoided * 10) / 10,
    };
  }, [scaleItems]);

  const handleUpdateScaleQty = (itemId: string, delta: number) => {
    setScaleItems((prev) => {
      const current = prev[itemId] || 0;
      const nextVal = Math.max(0, Math.round((current + delta) * 10) / 10);
      if (nextVal === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: nextVal };
    });
  };

  const handleRecordWeighing = () => {
    if (calculationSummary.totalKg <= 0) return;

    if (onAddWasteLog) {
      const primaryItem =
        BSU_PENCEGAH_KRISIS_ITEMS.find((it) => scaleItems[it.id] > 0) || BSU_PENCEGAH_KRISIS_ITEMS[0];

      onAddWasteLog({
        id: `LOG-BSU-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        itemName: `Setoran BSU: ${primaryItem.name} dkk (${calculationSummary.totalKg} kg)`,
        category: primaryItem.mainCategory === "LOGAM" ? "Logam & Kaca" : "Plastik (PET/HDPE)",
        weightKg: calculationSummary.totalKg,
        points: calculationSummary.totalPoints,
        co2eKg: calculationSummary.totalCarbonAvoided,
        facility: "Bank Sampah Unit (BSU) Pencegah Krisis Planet",
        householdId: "HH-CLD-0402",
        synced: true,
        encryptedHash: `bsu-${Date.now()}-hash`,
      });
    }

    setWeighSuccessNotice(
      `Setoran anorganik Rp ${calculationSummary.totalRupiah.toLocaleString("id-ID")} (${calculationSummary.totalKg} kg) berhasil diverifikasi dan ditambahkan ke buku tabungan digital nasabah!`
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#38bdf8", "#f59e0b", "#a855f7"],
      });
    } catch {}

    setTimeout(() => setWeighSuccessNotice(null), 5000);
  };

  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ========================================================== */}
      {/* HERO BANNER: PAPAN EDUKASI BSU PENCEGAH KRISIS PLANET       */}
      {/* ========================================================== */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDarkMode
            ? "bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/60 border-emerald-800/40"
            : "bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border-emerald-200 shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Recycle className="w-3.5 h-3.5" />
                Inisiatif Malaka Jaya &amp; DKI Jakarta
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sirkularitas Presisi
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30">
                <Coins className="w-3.5 h-3.5" />
                Berdaya Ekonomi &amp; Ekologis
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              BSU Pencegah Krisis Planet: Jenis Sampah Anorganik Terpilah
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Model digitalisasi papan edukasi pemilahan sampah anorganik unit komunitas (Malaka Jaya / DKI Jakarta).
              Menghubungkan 18+ jenis komoditas sampah terpilah (logam, alumunium, botol bodong, PE assoy, MLP, emberan,
              kardus, minyak jelantah, hingga aki) dengan solusi hilirisasi bernilai tinggi, integrasi maggot sirkular,
              dan tabungan sembako digital.
            </p>
          </div>

          {/* Quick Embedded Reference Badge / Photo Preview */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3.5 max-w-sm ${
              isDarkMode ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-emerald-200 shadow-sm"
            }`}
          >
            <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 flex-shrink-0 bg-slate-950">
              <img
                src="/assets/aistudio/image_ee7640ec.png"
                alt="Papan Edukasi BSU Pencegah Krisis Planet"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // fallback visual if path varies
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80";
                }}
              />
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                Papan Asli Lapangan
              </span>
              <p className="font-bold text-slate-900 dark:text-white line-clamp-2 text-[11px] leading-tight">
                BSU Pencegah Krisis Planet (Malaka Jaya, Jakarta Timur)
              </p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>Edukasi Gang Sempit Mendunia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 flex flex-wrap gap-2">
          {[
            {
              id: "catalog",
              label: "Katalog 18+ Jenis Sampah Terpilah",
              icon: <Package className="w-4 h-4" />,
            },
            {
              id: "solutions",
              label: "3 Solusi Cerdas & Sirkular",
              icon: <Sparkles className="w-4 h-4" />,
            },
            {
              id: "calculator",
              label: "Kalkulator Nilai Jual & Timbangan BSU",
              icon: <Calculator className="w-4 h-4" />,
            },
            {
              id: "exchange",
              label: "Skema Penukaran Sembako & E-Wallet",
              icon: <ShoppingBag className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? isDarkMode
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                    : "bg-emerald-600 text-white shadow-sm font-bold"
                  : isDarkMode
                  ? "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* SUBTAB 1: KATALOG 18+ JENIS SAMPAH ANORGANIK TERPILAH      */}
      {/* ========================================================== */}
      {activeSubTab === "catalog" && (
        <div className="space-y-6">
          {/* Top Category Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BSU_CATEGORIES_INFO.map((cat) => {
              const isSelected = selectedCategory === cat.category;
              return (
                <button
                  key={cat.category}
                  onClick={() =>
                    setSelectedCategory((prev) => (prev === cat.category ? "ALL" : cat.category))
                  }
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? "bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                        : "bg-emerald-50/80 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                      : cardBg
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.badgeBg} ${cat.badgeText}`}
                    >
                      {cat.itemsCount} Varian
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {cat.avgPriceRange}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className={`p-4 rounded-2xl border ${cardBg} flex flex-col sm:flex-row items-center gap-3`}>
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari jenis sampah (misal: Alumunium, Bodong, MLP, Boncos, Jelantah, Aki)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs">
                {["ALL", "LOGAM", "PLASTIK", "KERTAS", "LAIN_LAIN"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === c
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white"
                    }`}
                  >
                    {c === "ALL" ? "Semua" : c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Grid: List on Left (7 cols), Selected Item Detail on Right (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Items List */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Menampilkan {filteredItems.length} jenis sampah terpilah</span>
                <span className="text-[11px]">Pilih item untuk melihat SOP &amp; hilirisasi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => {
                  const isSelected = selectedItemDetail?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemDetail(item)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? isDarkMode
                            ? "bg-slate-800/95 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                            : "bg-emerald-50/90 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                          : cardBg + " hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              item.mainCategory === "LOGAM"
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                : item.mainCategory === "PLASTIK"
                                ? "bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30"
                                : item.mainCategory === "KERTAS"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {item.mainCategory} • {item.subCategory}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            +{item.pointsAwardedPerUnit} Poin
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                            {item.aliasLabels.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Nilai Standar BSU:</span>
                          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                            Rp {item.currentPricePerKg.toLocaleString("id-ID")}
                            <span className="text-[10px] font-normal text-slate-400">/{item.priceUnit}</span>
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateScaleQty(item.id, 1);
                            setActiveSubTab("calculator");
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Timbang
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Selected Item Detail Card */}
            <div className="lg:col-span-5">
              {selectedItemDetail ? (
                <div className={`p-5 rounded-2xl border ${cardBg} space-y-4 sticky top-24`}>
                  <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {selectedItemDetail.papanLabelPosition}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedItemDetail.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {selectedItemDetail.resaleDemandLevel}
                    </span>
                  </div>

                  {/* Benchmark Price Banner */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Patokan Harga BSU DKI 2026:
                      </span>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        Rp {selectedItemDetail.currentPricePerKg.toLocaleString("id-ID")}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          per {selectedItemDetail.priceUnit}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Cegah Emisi:</span>
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        {selectedItemDetail.carbonAvoidedPerKg} kg CO₂e/{selectedItemDetail.priceUnit}
                      </span>
                    </div>
                  </div>

                  {/* Hilirisasi & Recycled Yield */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">
                      Potensi Hilirisasi &amp; Produk Turunan:
                    </span>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {selectedItemDetail.recycledProductYield}
                    </p>
                  </div>

                  {/* SOP Pemilahan */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">
                      SOP Pemilahan Agar Bernilai Maksimal:
                    </span>
                    <div className="space-y-1.5">
                      {selectedItemDetail.prepInstructions.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips Ekonomis & Ekologis */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                      <strong>Strategi Cuan:</strong> {selectedItemDetail.economicAdvice}
                    </div>
                    <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-300">
                      <strong>Dampak Lingkungan:</strong> {selectedItemDetail.ecologicalImpact}
                    </div>
                  </div>

                  {/* Action: Add to scale */}
                  <button
                    onClick={() => {
                      handleUpdateScaleQty(selectedItemDetail.id, 1);
                      setActiveSubTab("calculator");
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Masukkan ke Timbangan Digital BSU (+1 {selectedItemDetail.priceUnit})</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* SUBTAB 2: 3 SOLUSI CERDAS & INTEGRASI SIRKULARITAS        */}
      {/* ========================================================== */}
      {activeSubTab === "solutions" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Solusi Cerdas &amp; Praktis Mengoptimalkan Sampah BSU
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pilar strategi holistik: peningkatan nilai ekonomi sampah anorganik, integrasi limbah organik maggot BSF,
              serta digitalisasi transparansi bank sampah tingkat RW.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BSU_CIRCULAR_SOLUTIONS.map((sol, idx) => (
              <div
                key={sol.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${cardBg} ${
                  idx === 0
                    ? "hover:border-amber-500/50"
                    : idx === 1
                    ? "hover:border-emerald-500/50"
                    : "hover:border-sky-500/50"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pilar Solusi
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{sol.title}</h3>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {sol.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{sol.summary}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Aksi Konkret di Lapangan:
                    </span>
                    <ul className="space-y-2 text-xs">
                      {sol.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {idx === 0 && (
                    <button
                      onClick={() => setActiveSubTab("catalog")}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Buka Katalog Pemilahan <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx === 1 && (
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab("maggocity")}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Buka Modul MaggoCity BSF <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx === 2 && (
                    <button
                      onClick={() => setActiveSubTab("exchange")}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Lihat Skema Penukaran Sembako <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Deep-Dive Case Study: Minyak Jelantah to Biodiesel & Sabun Cuci */}
          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border-purple-800/40"
                : "bg-gradient-to-r from-purple-50 via-white to-white border-purple-200"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  Studi Kasus Solutif
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Dari Limbah Dapur Menjadi Sabun Mandiri &amp; Bahan Bakar Biodiesel
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Di BSU Malaka Jaya, 1 liter minyak jelantah tidak dibuang ke wastafel. Sebagian disaring dengan arang
                  aktif untuk produksi <strong>Sabun Batang Cuci Piring Komersial BSU</strong> (dijual Rp5.000/batang ke
                  warga), dan sisanya disetor ke agregator biodiesel untuk energi terbarukan.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <span className="text-[10px] text-slate-400 block">Nilai Jual Jelantah</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                    Rp 7.500 / liter
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-slate-400 block">Cegah Kerusakan Air</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    1 Juta Liter / L
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* SUBTAB 3: KALKULATOR NILAI JUAL & TIMBANGAN BSU DIGITAL    */}
      {/* ========================================================== */}
      {activeSubTab === "calculator" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Kalkulator Nilai Jual &amp; Simulator Timbangan BSU
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Simulasi perhitungan nilai uang tunai, akumulasi poin reward, dan pencegahan emisi karbon dari pemilahan
              sampah anorganik rumah tangga sebelum disetor ke Bank Sampah Unit.
            </p>
          </div>

          {weighSuccessNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{weighSuccessNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Scale Items Editor (7 cols) */}
            <div className={`lg:col-span-7 p-5 rounded-2xl border ${cardBg} space-y-4`}>
              <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Nama Nasabah / RT:</span>
                  <input
                    type="text"
                    value={simulatedNasabahName}
                    onChange={(e) => setSimulatedNasabahName(e.target.value)}
                    className="font-bold text-sm bg-transparent border-b border-dashed border-slate-400 dark:border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => setScaleItems({})}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" /> Reset Timbangan
                </button>
              </div>

              {/* Items in the scale basket */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Daftar Sampah Terpilah yang Ditimbang:
                </span>

                {Object.keys(scaleItems).length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <Scale className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-400">Keranjang timbangan masih kosong.</p>
                    <button
                      onClick={() =>
                        setScaleItems({
                          "logam-kaleng": 2.0,
                          "plastik-bodong": 3.0,
                          "kertas-kardus": 4.5,
                          "lain-minyak-jelantah": 1.5,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                    >
                      Muat Contoh Setoran Rumah Tangga
                    </button>
                  </div>
                ) : (
                  Object.entries(scaleItems).map(([itemId, qty]) => {
                    const item = BSU_PENCEGAH_KRISIS_ITEMS.find((it) => it.id === itemId);
                    if (!item) return null;
                    const subtotal = Math.round(item.currentPricePerKg * qty);

                    return (
                      <div
                        key={itemId}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 block">
                            Rp {item.currentPricePerKg.toLocaleString("id-ID")} / {item.priceUnit}
                          </span>
                        </div>

                        {/* Weight adjuster */}
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateScaleQty(itemId, -0.5)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center font-bold font-mono">
                            {qty} {item.priceUnit}
                          </span>
                          <button
                            onClick={() => handleUpdateScaleQty(itemId, 0.5)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                            Rp {subtotal.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[10px] text-slate-400">+{item.pointsAwardedPerUnit * qty} Poin</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Add Selector Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  + Tambah Jenis Sampah Lainnya ke Timbangan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BSU_PENCEGAH_KRISIS_ITEMS.filter((it) => !scaleItems[it.id]).slice(0, 8).map((it) => (
                    <button
                      key={it.id}
                      onClick={() => handleUpdateScaleQty(it.id, 1)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:text-emerald-500 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{it.name.split(" ")[0]} ({it.subCategory.split(" ")[0]})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Instant Financial & Ecological Bill (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-6 rounded-2xl border ${cardBg} space-y-5 sticky top-24`}>
                <div className="border-b pb-3 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Struk Setoran Bank Sampah
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Rekap Hasil Penimbangan
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 space-y-1">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">
                      Total Saldo Rupiah Nasabah:
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      Rp {calculationSummary.totalRupiah.toLocaleString("id-ID")}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Dapat langsung ditabung, ditarik tunai, atau ditukar sembako
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Total Berat</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {calculationSummary.totalKg} kg
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Poin Reward</span>
                      <span className="font-bold text-amber-500 text-sm">
                        +{calculationSummary.totalPoints}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Cegah Karbon</span>
                      <span className="font-bold text-teal-600 text-sm">
                        {calculationSummary.totalCarbonAvoided} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRecordWeighing}
                    disabled={calculationSummary.totalKg <= 0}
                    className={`w-full py-3 rounded-xl font-bold text-xs text-white transition flex items-center justify-center gap-2 shadow-md ${
                      calculationSummary.totalKg > 0
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 cursor-pointer shadow-emerald-600/20"
                        : "bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Catat &amp; Simpan ke Buku Tabungan E2EE</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Transaksi diverifikasi otomatis dengan segel integritas kriptografi SHA-256
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* SUBTAB 4: SKEMA PENUKARAN BERDAYA (SEMBAKO & E-WALLET)     */}
      {/* ========================================================== */}
      {activeSubTab === "exchange" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
              Skema Penukaran Sampah Menjadi Sembako &amp; Kebutuhan Harian
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Hasil tabungan sampah anorganik BSU dapat langsung dibelanjakan menjadi paket bahan pokok, voucher token
              listrik, e-wallet, atau sabun ramah lingkungan hasil olahan minyak jelantah terpurifikasi.
            </p>
          </div>

          {redeemSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{redeemSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: "rew-beras",
                name: "Beras Premium Ramos 2.5 kg",
                category: "Sembako Pokok",
                costRupiah: 35000,
                equivalentWaste: "Setara 2.5 kg Kaleng atau 7 kg Botol Bodong PET",
                stock: 24,
                icon: "🌾",
              },
              {
                id: "rew-minyak",
                name: "Minyak Goreng Baru 1 Liter",
                category: "Sembako Pokok",
                costRupiah: 17500,
                equivalentWaste: "Setara 2.3 Liter Minyak Jelantah Bersih",
                stock: 40,
                icon: "🍳",
              },
              {
                id: "rew-sabun-bsu",
                name: "Sabun Cuci Piring Herbal BSU (450ml)",
                category: "Produk Olahan BSU",
                costRupiah: 6000,
                equivalentWaste: "Hasil Hilirisasi Minyak Jelantah Terpurifikasi",
                stock: 55,
                icon: "🧼",
              },
              {
                id: "rew-telur",
                name: "Telur Ayam Omega-3 (10 Butir)",
                category: "Protein Segar",
                costRupiah: 22000,
                equivalentWaste: "Hasil Ternak Berpakan Maggot BSF Cerdas",
                stock: 18,
                icon: "🥚",
              },
              {
                id: "rew-pln",
                name: "Token Listrik PLN Rp20.000",
                category: "Tagihan Utilitas",
                costRupiah: 21500,
                equivalentWaste: "Setara 1.5 kg Alumunium Panci Bekas",
                stock: 99,
                icon: "⚡",
              },
              {
                id: "rew-gopay",
                name: "Saldo E-Wallet GoPay / OVO Rp25.000",
                category: "Digital Cash",
                costRupiah: 26000,
                equivalentWaste: "Langsung cair ke nomor HP nasabah",
                stock: 99,
                icon: "📱",
              },
              {
                id: "rew-pupuk-kasgot",
                name: "Pupuk Organik Kasgot 5 kg",
                category: "Produk Sirkular BSU",
                costRupiah: 5000,
                equivalentWaste: "Hasil Biokonversi Maggot Siklus BSU",
                stock: 35,
                icon: "🌱",
              },
              {
                id: "rew-ecobrick-kursi",
                name: "Kursi Santai Ecobrick Komposit",
                category: "Upcycled Furniture",
                costRupiah: 75000,
                equivalentWaste: "Dibuat dari 12 botol limbah plastik sachet MLP",
                stock: 6,
                icon: "🪑",
              },
            ].map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${cardBg} transition-all hover:border-emerald-500/50`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Stok: {item.stock}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.equivalentWaste}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-slate-400">Harga Tukar:</span>
                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      Rp {item.costRupiah.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setRedeemSuccess(
                        `Penukaran "${item.name}" berhasil diajukan! Saldo tabungan sampah Anda terpotong Rp ${item.costRupiah.toLocaleString(
                          "id-ID"
                        )} dan voucher siap diambil di loket BSU Malaka Jaya.`
                      );
                      try {
                        confetti({
                          particleCount: 50,
                          spread: 60,
                          origin: { y: 0.6 },
                        });
                      } catch {}
                      setTimeout(() => setRedeemSuccess(null), 6000);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Tukar Saldo Sampah</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
