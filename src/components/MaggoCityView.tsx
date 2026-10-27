/**
 * MaggoCity - Premier Smart BSF Maggot Circular Economy Module
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 * Biokonversi Sampah Organik Cerdas & Pemberdayaan Ekonomi Mandiri
 */

import React, { useState, useMemo } from "react";
import {
  Bug,
  Sparkles,
  TrendingUp,
  Droplets,
  Thermometer,
  Gauge,
  Leaf,
  Scale,
  Coins,
  Truck,
  Fish,
  Egg,
  Layers,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Users,
  Award,
  ArrowRight,
  Clock,
  Info,
  Calendar,
  Zap,
  Check,
  Plus,
  Minus,
  Box,
  Calculator,
} from "lucide-react";
import {
  JAKARTA_MAGGO_HUBS,
  ACTIVE_BSF_BATCHES,
  MAGGO_MARKETPLACE_LISTINGS,
  FEED_FORMULA_PRESETS,
  COMMUNITY_EMPOWERMENT_STORIES,
  MAGGOCITY_CITYWIDE_STATS,
  MaggoHubNode,
  BsfLifecycleBatch,
  MaggoMarketplaceItem,
  FeedFormulaPreset,
} from "../data/maggoCityData";
import { MaggoBepAndPillars } from "./MaggoBepAndPillars";
import { MaggoProfitabilityBepCalculator } from "./MaggoProfitabilityBepCalculator";

interface MaggoCityViewProps {
  isDarkMode: boolean;
}

type MaggoSubTab = "bep_calculator" | "bep_business" | "bioreactors" | "calculator" | "lifecycle" | "diet_ai" | "marketplace" | "empowerment";

export const MaggoCityView: React.FC<MaggoCityViewProps> = ({ isDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<MaggoSubTab>("bep_calculator");

  // Selected Hub for Bioreactor Inspection
  const [selectedHubId, setSelectedHubId] = useState<string>("hub-pondok-labu");
  const [districtFilter, setDistrictFilter] = useState<string>("ALL");

  // Telemetry simulation state for the active hub
  const [bioreactorAdjustments, setBioreactorAdjustments] = useState<Record<string, { tempOffset: number; mistingActive: boolean; aerationBoost: boolean }>>({
    "hub-pondok-labu": { tempOffset: 0, mistingActive: false, aerationBoost: false },
    "hub-kramat-jati": { tempOffset: 0, mistingActive: true, aerationBoost: true },
  });

  // Calculator State
  const [calcWasteKgPerDay, setCalcWasteKgPerDay] = useState<number>(150);
  const [calcWasteType, setCalcWasteType] = useState<"resto" | "market" | "household" | "tofu_mix">("household");
  const [calcPriceFresh, setCalcPriceFresh] = useState<number>(8000);
  const [calcPriceKasgot, setCalcPriceKasgot] = useState<number>(3500);

  // Diet Formulation Interactive Sliders
  const [activeFormula, setActiveFormula] = useState<FeedFormulaPreset>(FEED_FORMULA_PRESETS[0]);
  const [customRicePercent, setCustomRicePercent] = useState<number>(30);
  const [customTofuPercent, setCustomTofuPercent] = useState<number>(35);
  const [customVegPercent, setCustomVegPercent] = useState<number>(25);
  const [customFruitPercent, setCustomFruitPercent] = useState<number>(10);

  // Marketplace Order Simulation State
  const [selectedProduct, setSelectedProduct] = useState<MaggoMarketplaceItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(5);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Active Hub Object
  const selectedHub = useMemo(() => {
    return JAKARTA_MAGGO_HUBS.find((h) => h.id === selectedHubId) || JAKARTA_MAGGO_HUBS[0];
  }, [selectedHubId]);

  // Filtered Hubs
  const filteredHubs = useMemo(() => {
    if (districtFilter === "ALL") return JAKARTA_MAGGO_HUBS;
    return JAKARTA_MAGGO_HUBS.filter((h) => h.cityDistrict === districtFilter);
  }, [districtFilter]);

  // Dynamic Calculator Output Calculations
  const calculatedOutputs = useMemo(() => {
    // Bioconversion ratio depends on substrate
    let bioconversionRatio = 0.20; // 20% fresh larvae yield default
    let kasgotRatio = 0.35; // 35% kasgot frass
    let proteinPct = 42;

    if (calcWasteType === "resto") {
      bioconversionRatio = 0.23;
      kasgotRatio = 0.32;
      proteinPct = 45;
    } else if (calcWasteType === "market") {
      bioconversionRatio = 0.18;
      kasgotRatio = 0.38;
      proteinPct = 39;
    } else if (calcWasteType === "household") {
      bioconversionRatio = 0.21;
      kasgotRatio = 0.35;
      proteinPct = 42;
    } else if (calcWasteType === "tofu_mix") {
      bioconversionRatio = 0.25;
      kasgotRatio = 0.30;
      proteinPct = 46.5;
    }

    const monthlyWasteKg = calcWasteKgPerDay * 30;
    const dailyFreshMaggotKg = calcWasteKgPerDay * bioconversionRatio;
    const monthlyFreshMaggotKg = monthlyWasteKg * bioconversionRatio;
    const monthlyDriedMaggotKg = monthlyFreshMaggotKg * 0.33; // 3:1 drying shrinkage
    const monthlyKasgotKg = monthlyWasteKg * kasgotRatio;

    const monthlyFreshRevenue = monthlyFreshMaggotKg * calcPriceFresh;
    const monthlyKasgotRevenue = monthlyKasgotKg * calcPriceKasgot;
    const totalMonthlyRevenue = monthlyFreshRevenue + monthlyKasgotRevenue;

    // Animal Feed Support Capacity
    // A catfish (lele) consumes ~3-5% body weight daily. 1 kg fresh maggot can feed ~35 adult lele / day
    const leleCapacity = Math.floor(dailyFreshMaggotKg * 35);
    // 1 laying hen consumes ~30g maggot daily as protein booster
    const chickenCapacity = Math.floor((dailyFreshMaggotKg * 1000) / 30);

    // Methane & Carbon Averted (0.32 kg CO2e per kg organic waste diverted from landfill)
    const monthlyCo2eAvertedKg = monthlyWasteKg * 0.32;

    return {
      monthlyWasteKg,
      dailyFreshMaggotKg: Math.round(dailyFreshMaggotKg * 10) / 10,
      monthlyFreshMaggotKg: Math.round(monthlyFreshMaggotKg),
      monthlyDriedMaggotKg: Math.round(monthlyDriedMaggotKg),
      monthlyKasgotKg: Math.round(monthlyKasgotKg),
      totalMonthlyRevenue,
      monthlyFreshRevenue,
      monthlyKasgotRevenue,
      leleCapacity,
      chickenCapacity,
      monthlyCo2eAvertedKg: Math.round(monthlyCo2eAvertedKg),
      proteinPct,
      fcr: Math.round((1 / bioconversionRatio) * 10) / 10,
    };
  }, [calcWasteKgPerDay, calcWasteType, calcPriceFresh, calcPriceKasgot]);

  // Interactive Recipe Score Calculation
  const recipeAnalysis = useMemo(() => {
    const total = customRicePercent + customTofuPercent + customVegPercent + customFruitPercent;
    // Estimated protein percentage
    const estProtein =
      customRicePercent * 0.08 +
      customTofuPercent * 0.52 +
      customVegPercent * 0.22 +
      customFruitPercent * 0.12;
    // Estimated moisture percentage
    const estMoisture =
      (customRicePercent * 65 +
        customTofuPercent * 75 +
        customVegPercent * 88 +
        customFruitPercent * 85) /
      100;

    let moistureSafety = "Ideal (65-75%)";
    let isWarning = false;
    if (estMoisture > 78) {
      moistureSafety = "Terlalu Basah (>78%) - Rawan Berbau! Tambahkan Bekatul";
      isWarning = true;
    } else if (estMoisture < 60) {
      moistureSafety = "Terlalu Kering (<60%) - Pertumbuhan Larva Melambat";
      isWarning = true;
    }

    return {
      total,
      estProtein: Math.round(estProtein * 10) / 10,
      estMoisture: Math.round(estMoisture * 10) / 10,
      moistureSafety,
      isWarning,
      bioconversionScore: total === 100 ? (estProtein > 20 ? 95 : 84) : 70,
    };
  }, [customRicePercent, customTofuPercent, customVegPercent, customFruitPercent]);

  // Handle simulated action for active hub
  const toggleMisting = (hubId: string) => {
    setBioreactorAdjustments((prev) => {
      const current = prev[hubId] || { tempOffset: 0, mistingActive: false, aerationBoost: false };
      return {
        ...prev,
        [hubId]: { ...current, mistingActive: !current.mistingActive },
      };
    });
  };

  const toggleAeration = (hubId: string) => {
    setBioreactorAdjustments((prev) => {
      const current = prev[hubId] || { tempOffset: 0, mistingActive: false, aerationBoost: false };
      return {
        ...prev,
        [hubId]: { ...current, aerationBoost: !current.aerationBoost },
      };
    });
  };

  const handleSimulateOrder = () => {
    if (!selectedProduct) return;
    const totalCost = selectedProduct.priceIdr * orderQuantity;
    setOrderSuccessMsg(
      `Pesanan ${orderQuantity} ${selectedProduct.unit} ${selectedProduct.title} berhasil diajukan ke ${selectedProduct.producerHub}! Estimasi biaya: Rp ${totalCost.toLocaleString("id-ID")}. Tim kemitraan akan segera menghubungi via WhatsApp.`
    );
    setTimeout(() => {
      setSelectedProduct(null);
      setOrderSuccessMsg(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner Header */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border shadow-sm transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-900/40 text-slate-100"
            : "bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border-emerald-200 text-slate-800"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Bug className="w-3.5 h-3.5" />
                MaggoCity DKI Jakarta
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Biokonversi Cerdas 45% Protein
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                <Coins className="w-3.5 h-3.5" />
                Ekonomi Mandiri Warga
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              MaggoCity: Ekosistem Biokonversi Maggot BSF Cerdas &amp; Berdaya
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Transformasi timbulan sampah organik DKI Jakarta (pasar induk, katering resto, dan RT/RW) menjadi pakan
              protein mandiri bernilai tinggi (Black Soldier Fly / <em>Hermetia illucens</em>), pupuk hayati Kasgot,
              serta pengentasan emisi gas metana secara berkelanjutan.
            </p>
          </div>

          {/* Quick Aggregate Stats Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-center min-w-[240px] space-y-2 backdrop-blur-sm ${
              isDarkMode
                ? "bg-slate-900/80 border-slate-800 text-slate-200"
                : "bg-white/90 border-emerald-100 text-slate-800 shadow-sm"
            }`}
          >
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Reduksi Sampah</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {MAGGOCITY_CITYWIDE_STATS.totalOrganicWasteProcessedTonsMonthly}
              </span>
              <span className="text-xs font-semibold text-slate-500">Ton / Bulan</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Hasil Pakan</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {(MAGGOCITY_CITYWIDE_STATS.totalFreshMaggotHarvestedKgMonthly / 1000).toFixed(1)} Ton
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Perputaran Kas</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {(MAGGOCITY_CITYWIDE_STATS.totalEconomicCirculationIdrMonthly / 1000000).toFixed(0)} Jt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 flex flex-wrap gap-2">
          {[
            { id: "bep_calculator", label: "Profitability & BEP Calculator", icon: <Calculator className="w-4 h-4" /> },
            { id: "bep_business", label: "Sistem 4 Pilar & Edukasi BEP", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "bioreactors", label: "Fleet Hub & Telemetri IoT", icon: <Gauge className="w-4 h-4" /> },
            { id: "calculator", label: "Kalkulator Potensi Cuan & Pakan", icon: <Scale className="w-4 h-4" /> },
            { id: "lifecycle", label: "Pelacak Siklus Hidup Batch", icon: <Egg className="w-4 h-4" /> },
            { id: "diet_ai", label: "AI Formulasi & Diet Substrat", icon: <Sparkles className="w-4 h-4" /> },
            { id: "marketplace", label: "Pasar Sirkular & Off-Taker", icon: <ShoppingBag className="w-4 h-4" /> },
            { id: "empowerment", label: "Warga Berdaya & Panduan RW", icon: <Users className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as MaggoSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === tab.id
                  ? isDarkMode
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-emerald-600 text-white font-bold shadow-sm"
                  : isDarkMode
                  ? "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "bg-white/80 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB: PROFITABILITY & BEP CALCULATOR */}
      {activeSubTab === "bep_calculator" && (
        <MaggoProfitabilityBepCalculator isDarkMode={isDarkMode} />
      )}

      {/* SUBTAB: 4 PILAR BUDIDAYA & ANALISIS BEP */}
      {activeSubTab === "bep_business" && (
        <MaggoBepAndPillars isDarkMode={isDarkMode} />
      )}

      {/* SUBTAB 1: BIOREACTOR FLEET & IOT TELEMETRY */}
      {activeSubTab === "bioreactors" && (
        <div className="space-y-6">
          {/* Top Filter and Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-500" />
                Jaringan Reaktor Biokonversi Maggot DKI Jakarta
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sensor telemetri lingkungan real-time dari 6 sentra biokonversi komunal aktif di 5 wilayah kota
                administrasi.
              </p>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "Jakarta Selatan", "Jakarta Timur", "Jakarta Barat", "Jakarta Utara", "Jakarta Pusat"].map(
                (district) => (
                  <button
                    key={district}
                    onClick={() => setDistrictFilter(district)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      districtFilter === district
                        ? "bg-emerald-600 text-white font-semibold"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-400 hover:text-slate-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {district === "ALL" ? "Semua Wilayah" : district.replace("Jakarta ", "")}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Hubs Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHubs.map((hub) => {
              const isSelected = hub.id === selectedHubId;
              const currentAdj = bioreactorAdjustments[hub.id] || {
                tempOffset: 0,
                mistingActive: false,
                aerationBoost: false,
              };
              const displayTemp = (hub.telemetry.avgTemperatureC + currentAdj.tempOffset).toFixed(1);

              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHubId(hub.id)}
                  className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? isDarkMode
                        ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                        : "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                      : isDarkMode
                      ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-emerald-200"
                  }`}
                >
                  {/* Status header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {hub.cityDistrict}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hub.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {hub.status === "ACTIVE" ? "Reaktor Aktif" : "Ekspansi Kapasitas"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{hub.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{hub.location}</p>

                  {/* Telemetry Sensor Badges */}
                  <div className="mt-4 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-center">
                    <div>
                      <span className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                        <Thermometer className="w-3 h-3 text-rose-500" />
                        Suhu
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{displayTemp}°C</span>
                    </div>
                    <div>
                      <span className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        Kelembapan
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {hub.telemetry.avgMoisturePercent}%
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                        <Zap className="w-3 h-3 text-amber-500" />
                        Skor Sehat
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {hub.telemetry.healthScorePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Monthly Output & Intake bar */}
                  <div className="mt-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Kapasitas Digunakan</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {hub.currentIntakeKgPerWeek.toLocaleString("id-ID")} /{" "}
                        {hub.capacityKgPerWeek.toLocaleString("id-ID")} kg/mgg
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(hub.currentIntakeKgPerWeek / hub.capacityKgPerWeek) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      <strong>{hub.bioreactorsCount}</strong> Reaktor • <strong>{hub.activeBatchesCount}</strong> Batch
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      Detail IoT <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Hub Bioreactor Inspector */}
          {selectedHub && (
            <div
              className={`rounded-2xl border p-6 transition-all ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Live Telemetry Terminal
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <h3 className="text-xl font-extrabold">{selectedHub.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Penanggung Jawab: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedHub.communityLead}</span> | Narahubung: {selectedHub.contactPerson}
                  </p>
                </div>

                {/* Quick Action Controls: Misting & Aeration */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleMisting(selectedHub.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      bioreactorAdjustments[selectedHub.id]?.mistingActive
                        ? "bg-blue-600 text-white border-blue-500 font-bold"
                        : isDarkMode
                        ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    {bioreactorAdjustments[selectedHub.id]?.mistingActive ? "Misting Aktif (ON)" : "Nyalakan Misting"}
                  </button>

                  <button
                    onClick={() => toggleAeration(selectedHub.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      bioreactorAdjustments[selectedHub.id]?.aerationBoost
                        ? "bg-purple-600 text-white border-purple-500 font-bold"
                        : isDarkMode
                        ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                    {bioreactorAdjustments[selectedHub.id]?.aerationBoost ? "Aerasi Turbo Aktif" : "Boost Aerasi"}
                  </button>
                </div>
              </div>

              {/* Sensor Diagnostics Details Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    Suhu Reaktor
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                      {selectedHub.telemetry.avgTemperatureC}°C
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">(Rentang Ideal: 28-32°C)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Termometer inframerah multi-zone</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    Kelembapan Substrat
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                      {selectedHub.telemetry.avgMoisturePercent}%
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">(Ideal: 65-72%)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Kadar air optimal aktivitas makan</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-500" />
                    Gas Amonia (NH₃)
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                      {selectedHub.telemetry.ammoniaPpm} ppm
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">(Aman &lt; 10 ppm)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Bebas bau menyengat di pemukiman</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                    pH Substrat Fermentasi
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                      {selectedHub.telemetry.substratePh}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">(Netral / Seimbang)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Tingkat asam basa sehat bagi larva</div>
                </div>
              </div>

              {/* Hub Circular Output Metrics & Partners */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hasil Produksi &amp; Nilai Ekonomi Bulanan
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-500">Maggot Segar Dipanen (Pakan Ikan):</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {selectedHub.monthlyOutputs.freshMaggotKg.toLocaleString("id-ID")} kg
                      </strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-500">Dried Maggot Oven Crispy (45% Protein):</span>
                      <strong className="text-amber-600 dark:text-amber-400">
                        {selectedHub.monthlyOutputs.driedMaggotKg.toLocaleString("id-ID")} kg
                      </strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-500">Pupuk Kasgot Hayati Kaya Kitin:</span>
                      <strong className="text-blue-600 dark:text-blue-400">
                        {selectedHub.monthlyOutputs.kasgotFertilizerKg.toLocaleString("id-ID")} kg
                      </strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
                      <span className="text-emerald-800 dark:text-emerald-300">Estimasi Pendapatan Sirkular Warga:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Rp {selectedHub.monthlyRevenueIdr.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ekosistem Pasokan &amp; Mitra Off-Taker
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block mb-1">Sumber Bahan Baku Organik Terverifikasi:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedHub.feedstockSources.map((source, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-500 text-[11px] block mb-1">Mitra Penyerapan Produk (Off-takers):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedHub.primaryOfftakers.map((buyer, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            {buyer}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: BIOCONVERSION & ECONOMIC CALCULATOR */}
      {activeSubTab === "calculator" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-500" />
              Kalkulator Cerdas Biokonversi &amp; Dampak Berdaya
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hitung potensi hasil panen protein larva, pupuk organik kasgot, pendapatan tambahan ekonomi warga, serta daya
              dukung peternakan ikan/unggas berdasarkan volume sampah organik harian Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls Panel */}
            <div
              className={`lg:col-span-5 rounded-2xl border p-6 space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Parameter Input Sampah
                </span>
                <span className="text-xs font-mono text-slate-400">Preset DKI 2026</span>
              </div>

              {/* Slider Waste Volume */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Volume Sampah Organik Harian:
                  </span>
                  <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    {calcWasteKgPerDay} kg / hari
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1500"
                  step="10"
                  value={calcWasteKgPerDay}
                  onChange={(e) => setCalcWasteKgPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10 kg (Skala RT/Keluarga)</span>
                  <span>150 kg (Restoran/RW)</span>
                  <span>1.500 kg (Pasar/Kelurahan)</span>
                </div>
              </div>

              {/* Waste Substrate Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Karakteristik Sumber Sampah Organik:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "household", label: "Campuran Rumah Tangga", note: "Rasio konversi 21%" },
                    { id: "resto", label: "Sisa Dapur & Resto/Katering", note: "Tinggi protein (23%)" },
                    { id: "market", label: "Sayuran & Buah Pasar", note: "Kadar air tinggi (18%)" },
                    { id: "tofu_mix", label: "Mix Ampas Tahu & Dedak", note: "Super yield (25%)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCalcWasteType(item.id as any)}
                      className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                        calcWasteType === item.id
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-semibold text-emerald-800 dark:text-emerald-300"
                          : isDarkMode
                          ? "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Price Assumptions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Harga Maggot Segar / Kg:</label>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Rp</span>
                    <input
                      type="number"
                      step="500"
                      value={calcPriceFresh}
                      onChange={(e) => setCalcPriceFresh(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border bg-transparent font-semibold border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Harga Pupuk Kasgot / Kg:</label>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Rp</span>
                    <input
                      type="number"
                      step="500"
                      value={calcPriceKasgot}
                      onChange={(e) => setCalcPriceKasgot(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border bg-transparent font-semibold border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Insight Ilmiah FCR:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Dengan FCR {calculatedOutputs.fcr}:1, setiap {calculatedOutputs.fcr} kg sampah organik terdekomposisi
                  menjadi 1 kg biomassa maggot berprotein {calculatedOutputs.proteinPct}%, plus pupuk kasgot kaya kitin
                  organik.
                </p>
              </div>
            </div>

            {/* Calculated Output Display Panel */}
            <div className="lg:col-span-7 space-y-4">
              {/* Highlight Card: Monthly Revenue & Biomass */}
              <div
                className={`rounded-2xl border p-6 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-800/40"
                    : "bg-gradient-to-br from-emerald-50 to-white border-emerald-200 shadow-sm"
                }`}
              >
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Proyeksi Perputaran Finansial Bulanan
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                    Rp {calculatedOutputs.totalMonthlyRevenue.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ bulan pendapatan kotor</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-emerald-500/20 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Maggot Segar ({calculatedOutputs.monthlyFreshMaggotKg} kg):</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      Rp {calculatedOutputs.monthlyFreshRevenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pupuk Kasgot ({calculatedOutputs.monthlyKasgotKg} kg):</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      Rp {calculatedOutputs.monthlyKasgotRevenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Biomass & Circular Yield Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`p-4 rounded-xl border text-center ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <Bug className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                  <span className="text-[11px] text-slate-400 block">Panen Maggot Segar</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {calculatedOutputs.dailyFreshMaggotKg} kg/hari
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ({calculatedOutputs.monthlyFreshMaggotKg} kg/bulan)
                  </span>
                </div>

                <div
                  className={`p-4 rounded-xl border text-center ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <Sparkles className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                  <span className="text-[11px] text-slate-400 block">Dried Maggot (Kering)</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {calculatedOutputs.monthlyDriedMaggotKg} kg/bulan
                  </span>
                  <span className="text-[10px] text-amber-500 block">Kadar Protein 45%</span>
                </div>

                <div
                  className={`p-4 rounded-xl border text-center ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <Leaf className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                  <span className="text-[11px] text-slate-400 block">Pupuk Kasgot Hayati</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {calculatedOutputs.monthlyKasgotKg} kg/bulan
                  </span>
                  <span className="text-[10px] text-blue-500 block">Kaya Senyawa Kitin</span>
                </div>
              </div>

              {/* Tangible Food Security Support (Lele & Poultry) */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Fish className="w-4 h-4 text-cyan-500" />
                  Daya Dukung Ketahanan Pangan Komunal
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                    <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                      <Fish className="w-4 h-4" />
                      Budidaya Ikan Lele / Nila
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Mampu mencukupi pakan segar gratis untuk hingga{" "}
                      <strong className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">
                        {calculatedOutputs.leleCapacity.toLocaleString("id-ID")} ekor
                      </strong>{" "}
                      ikan lele per hari, menghemat 50-60% pengeluaran pelet pabrikan.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <Egg className="w-4 h-4" />
                      Peternakan Unggas / Ayam Petelur
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Dapat menyuplai booster protein alami untuk{" "}
                      <strong className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                        {calculatedOutputs.chickenCapacity.toLocaleString("id-ID")} ekor
                      </strong>{" "}
                      ayam kampung / petelur per hari, meningkatkan daya tahan telur dan warna kuning pekat.
                    </p>
                  </div>
                </div>

                {/* Climate Impact */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    Emisi Gas Metana ($CH_4$) Averted:
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {calculatedOutputs.monthlyCo2eAvertedKg.toLocaleString("id-ID")} kg CO₂e / bulan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LIFECYCLE BATCH TRACKER */}
      {activeSubTab === "lifecycle" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Egg className="w-5 h-5 text-emerald-500" />
              Pelacak Siklus Hidup Batch BSF (Bioconversion Pipeline)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitoring 5 fase metamorfosis Black Soldier Fly dari kluster telur, pembesaran 5-DOL, biokonversi rakus,
              panen prepupa, hingga koloni indukan bertelur.
            </p>
          </div>

          {/* 5-Phase Pipeline Overview Bar */}
          <div
            className={`p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-5 gap-3 text-center ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {[
              { num: 1, label: "Telur / Oviposisi", days: "Hari 1 - 4", color: "text-amber-500" },
              { num: 2, label: "5-DOL Nursery", days: "Hari 5 - 7", color: "text-blue-500" },
              { num: 3, label: "Biokonversi Rakus", days: "Hari 8 - 18", color: "text-emerald-500" },
              { num: 4, label: "Prepupa / Panen", days: "Hari 19 - 22", color: "text-purple-500" },
              { num: 5, label: "Imago / Love Cage", days: "Hari 23 - 30", color: "text-rose-500" },
            ].map((st) => (
              <div key={st.num} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
                <span className={`text-xs font-black ${st.color}`}>Fase #{st.num}</span>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{st.label}</div>
                <div className="text-[10px] text-slate-400">{st.days}</div>
              </div>
            ))}
          </div>

          {/* Active Batches List */}
          <div className="space-y-4">
            {ACTIVE_BSF_BATCHES.map((batch) => {
              const progressPct = Math.round((batch.daysInCycle / batch.totalCycleDays) * 100);

              return (
                <div
                  key={batch.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
                        <Bug className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{batch.batchCode}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {batch.qualityGrade}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {batch.hubName} • Fase: <strong className="text-slate-700 dark:text-slate-300">{batch.stageLabel}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[11px]">Target Panen:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{batch.harvestTargetDate}</strong>
                    </div>
                  </div>

                  {/* Progress Bar of Cycle */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Siklus Hari ke-{batch.daysInCycle} dari {batch.totalCycleDays} hari
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Batch Substrate & Metric Cards */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Sampah Terurai:</span>
                      <strong className="text-slate-700 dark:text-slate-200">
                        {batch.substrateConsumedKg.toLocaleString("id-ID")} kg
                      </strong>
                      <span className="text-[10px] text-slate-400 block">/ {batch.substrateKgInitial} kg</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Estimasi Hasil Panen:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                        {batch.estimatedYieldKg} kg larva
                      </strong>
                      <span className="text-[10px] text-slate-400 block">FCR: {batch.fcrRatio}:1</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Suhu Substrat:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{batch.temperatureC}°C</strong>
                      <span className="text-[10px] text-slate-400 block">RH: {batch.humidityPercent}%</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Rekomendasi Tindakan:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 line-clamp-2 text-[11px]">
                        {batch.nextAction}
                      </span>
                    </div>
                  </div>

                  {/* Substrate description */}
                  <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <strong>Komposisi Pakan:</strong> {batch.substrateType}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: AI DIET FORMULATION & SUBSTRATE OPTIMIZER */}
      {activeSubTab === "diet_ai" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              AI Diet Rationing &amp; Pengatur Substrat Pakan Maggot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulasikan rasio nutrisi sampah organik (Karbohidrat : Protein Nabati : Serat Sayur : Buah) untuk mencapai
              kadar protein larva hingga 45%, mencegah pembusukan anaerobik asam, dan menekan bau amonia.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEED_FORMULA_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => setActiveFormula(preset)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeFormula.id === preset.id
                    ? "bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30"
                    : isDarkMode
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    FCR {preset.fcr}:1
                  </span>
                  {activeFormula.id === preset.id && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-1">{preset.name}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{preset.bestFor}</p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Rendemen: {preset.expectedBioconversionRate}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Recipe Mixer Studio */}
          <div
            className={`rounded-2xl border p-6 space-y-6 ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  Simulator Racikan Substrat Mandiri
                </h3>
                <p className="text-xs text-slate-400">
                  Ubah proporsi bahan sisa organik untuk melihat prediksi kadar protein larva dan indeks keamanan air lindi.
                </p>
              </div>

              {/* Total Percentage Indicator */}
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  recipeAnalysis.total === 100
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                }`}
              >
                Total Racikan: {recipeAnalysis.total}% {recipeAnalysis.total !== 100 && "(Harus Pas 100%)"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sliders Column */}
              <div className="space-y-4">
                {/* Rice / Carbs */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Sisa Nasi &amp; Karbohidrat Dapur (Energi Kalori):
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{customRicePercent}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={customRicePercent}
                    onChange={(e) => setCustomRicePercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Tofu / Soy Waste */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Ampas Tahu / Kedelai (Booster Protein Kasar):
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{customTofuPercent}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={customTofuPercent}
                    onChange={(e) => setCustomTofuPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Vegetables */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Limbah Sayuran Pasar (Serat &amp; Mineral):
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{customVegPercent}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={customVegPercent}
                    onChange={(e) => setCustomVegPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Fruits */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Limbah Buah Non-Asam (Enzim Alami Pengurai):
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{customFruitPercent}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={customFruitPercent}
                    onChange={(e) => setCustomFruitPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Analysis Score Column */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hasil Diagnostik AI Formula
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Prediksi Protein Larva</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {recipeAnalysis.estProtein}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Grade Premium Super</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Kadar Air Campuran</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                      {recipeAnalysis.estMoisture}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Ideal: 65 - 75%</span>
                  </div>
                </div>

                {/* Moisture Warning or Pass */}
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                    recipeAnalysis.isWarning
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {recipeAnalysis.isWarning ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">Status Kelembapan:</span>
                    <span>{recipeAnalysis.moistureSafety}</span>
                  </div>
                </div>

                {/* SOP Steps */}
                <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">SOP Pembuatan:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Cacah bahan hingga partikel halus 3-5mm sebelum ditebar ke reaktor.</li>
                    <li>Taburkan tipis 3 cm per hari agar suhu biopond stabil di 29-32°C.</li>
                    <li>Hindari sisa bawang berlebih atau kulit nanas/jeruk yang terlalu asam.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: CIRCULAR MARKETPLACE & OFF-TAKER EXCHANGE */}
      {activeSubTab === "marketplace" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
              Pasar Sirkular MaggoCity &amp; Penyerapan Off-Taker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pusat perdagangan produk biokonversi BSF langsung dari koperasi warga dan sentra TPS3R DKI Jakarta kepada
              peternak lele, unggas, serta pegiat urban farming.
            </p>
          </div>

          {/* Success Banner */}
          {orderSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{orderSuccessMsg}</span>
            </div>
          )}

          {/* Product Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MAGGO_MARKETPLACE_LISTINGS.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.category}
                    </span>
                    <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                      ★ {item.rating} ({item.soldCount} terjual)
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>

                  {item.proteinContent && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                      <strong>Nutrisi:</strong> {item.proteinContent}
                    </div>
                  )}

                  {item.npkContent && (
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-medium">
                      <strong>Komposisi:</strong> {item.npkContent}
                    </div>
                  )}

                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div>
                      Produsen: <strong className="text-slate-600 dark:text-slate-300">{item.producerHub}</strong>
                    </div>
                    <div>Stok Tersedia: {item.inStockQuantity} {item.unit}</div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Harga Satuan</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      Rp {item.priceIdr.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-slate-400"> / {item.unit}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setOrderQuantity(item.minimumOrder);
                    }}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                  >
                    Beli / Pasok <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal / Sheet for Order Simulation */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div
                className={`max-w-md w-full rounded-2xl border p-6 space-y-5 shadow-2xl ${
                  isDarkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Form Pemesanan / Kemitraan</span>
                    <h3 className="font-extrabold text-base">{selectedProduct.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-slate-400 hover:text-slate-200 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div>Sentra Produsen: {selectedProduct.producerHub}</div>
                  <div>Minimal Pembelian: {selectedProduct.minimumOrder} {selectedProduct.unit}</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    Harga: Rp {selectedProduct.priceIdr.toLocaleString("id-ID")} / {selectedProduct.unit}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Jumlah Pesanan:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOrderQuantity((q) => Math.max(selectedProduct.minimumOrder, q - 1))}
                      className="p-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-base min-w-[60px] text-center">
                      {orderQuantity} {selectedProduct.unit}
                    </span>
                    <button
                      onClick={() => setOrderQuantity((q) => q + 1)}
                      className="p-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total Cost Display */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-400">Estimasi Total:</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    Rp {(selectedProduct.priceIdr * orderQuantity).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-1/2 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSimulateOrder}
                    className="w-1/2 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  >
                    Konfirmasi Pesanan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 6: COMMUNITY EMPOWERMENT & RW PANDUAN */}
      {activeSubTab === "empowerment" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Program Warga Berdaya &amp; MaggoBox RW Mandiri
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kisah nyata kemandirian pakan dan peningkatan ekonomi warga DKI Jakarta melalui inovasi budidaya maggot BSF
              lingkungan rukun warga.
            </p>
          </div>

          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMMUNITY_EMPOWERMENT_STORIES.map((story) => (
              <div
                key={story.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {story.badge}
                  </span>
                  <h3 className="font-extrabold text-sm">{story.groupName}</h3>
                  <p className="text-xs text-slate-400">
                    Kelurahan {story.kelurahan}, {story.city} • {story.membersCount} Anggota Aktif
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{story.story}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Surplus Kas Bulanan:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    +Rp {story.monthlyIncomeIncrementIdr.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* MaggoBox RW Starter Guide & SOP */}
          <div
            className={`rounded-2xl border p-6 space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold">Panduan Implementasi MaggoBox Mandiri RW (Zero-Smell)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Langkah 1: Pilah Sampah</span>
                <p className="text-slate-500 text-[11px]">
                  Kumpulkan sisa makanan &amp; sayur dari 15-20 rumah tangga. Pastikan bebas kantong kresek, duri ikan besar,
                  dan cairan minyak berlebih.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Langkah 2: Tebar Bibit 5-DOL</span>
                <p className="text-slate-500 text-[11px]">
                  Tebarkan 10 gram bibit larva 5 hari (sekitar 350.000 bibit) ke atas substrat pencacahan yang telah
                  diberi fermentasi EM4.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Langkah 3: Feeding Rutin</span>
                <p className="text-slate-500 text-[11px]">
                  Beri pakan sisa organik 5-10 kg per hari secara bertahap selama 12 hari hingga larva memasuki fase
                  voracious feeding.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Langkah 4: Panen Mandiri</span>
                <p className="text-slate-500 text-[11px]">
                  Pasang ramp kemiringan 35°. Larva prepupa yang siap panen akan merayap keluar sendiri ke ember tampung
                  tanpa disentuh tangan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
