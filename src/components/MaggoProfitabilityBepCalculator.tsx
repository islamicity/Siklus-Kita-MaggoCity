/**
 * MaggoProfitabilityBepCalculator - Dedicated Profitability & BEP Calculator Tool
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 * Fitur Kalkulator Profitabilitas & BEP Interaktif Berbasis Model Ekonomi MaggoCity
 */

import React, { useState, useMemo } from "react";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Scale,
  Coins,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Building,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  ArrowRight,
  Fish,
  Leaf,
  Sliders,
  Share2,
} from "lucide-react";

interface MaggoProfitabilityBepCalculatorProps {
  isDarkMode: boolean;
}

// Preset types
type ModelPreset = "standard_600" | "household_150" | "commercial_2500" | "custom";

export const MaggoProfitabilityBepCalculator: React.FC<MaggoProfitabilityBepCalculatorProps> = ({ isDarkMode }) => {
  // Preset selector
  const [activePreset, setActivePreset] = useState<ModelPreset>("standard_600");

  // Mode: Direct Harvest Qty vs Waste Input
  const [calculationMode, setCalculationMode] = useState<"direct_harvest" | "waste_input">("direct_harvest");

  // Daily waste intake (if waste_input mode active)
  const [dailyWasteKg, setDailyWasteKg] = useState<number>(100); // 100 kg/day = 3000 kg waste/mo => ~600 kg maggot
  const [substrateYieldType, setSubstrateYieldType] = useState<"standard" | "resto" | "tofu">("standard");

  // Production Volumes (Monthly)
  const [freshMaggotKg, setFreshMaggotKg] = useState<number>(500);
  const [driedMaggotKg, setDriedMaggotKg] = useState<number>(20);
  const [kasgotKg, setKasgotKg] = useState<number>(600);
  const [seedEggsGram, setSeedEggsGram] = useState<number>(0); // Optional extra stream

  // Target Prices (IDR)
  const [priceFreshPerKg, setPriceFreshPerKg] = useState<number>(8000);
  const [priceDriedPerKg, setPriceDriedPerKg] = useState<number>(65000);
  const [priceKasgotPerKg, setPriceKasgotPerKg] = useState<number>(1000);
  const [priceSeedEggPerGram, setPriceSeedEggPerGram] = useState<number>(6000);

  // Cost Structure Mode
  const [costMode, setCostMode] = useState<"itemized" | "lump_sum">("itemized");

  // CapEx (Initial Capital Investment)
  const [capexConstruction, setCapexConstruction] = useState<number>(2500000);
  const [capexRacksAndTrays, setCapexRacksAndTrays] = useState<number>(1500000);
  const [capexOvenRoaster, setCapexOvenRoaster] = useState<number>(1500000);
  const [capexToolsAndHarvest, setCapexToolsAndHarvest] = useState<number>(500000);
  const [capexLumpSum, setCapexLumpSum] = useState<number>(6000000);

  // OpEx (Monthly Operational Costs)
  const [opexSeedAwal, setOpexSeedAwal] = useState<number>(300000);
  const [opexTransportSampah, setOpexTransportSampah] = useState<number>(600000);
  const [opexFermentasiEm4, setOpexFermentasiEm4] = useState<number>(150000);
  const [opexKemasanPouch, setOpexKemasanPouch] = useState<number>(250000);
  const [opexListrikAir, setOpexListrikAir] = useState<number>(200000);
  const [opexLumpSum, setOpexLumpSum] = useState<number>(1500000);

  // Copy Feedback State
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Apply Presets
  const applyPreset = (preset: ModelPreset) => {
    setActivePreset(preset);
    if (preset === "standard_600") {
      // Standar MaggoCity Skala Menengah (Target ±600 kg/bln)
      setFreshMaggotKg(500);
      setDriedMaggotKg(20);
      setKasgotKg(600);
      setSeedEggsGram(0);

      setPriceFreshPerKg(8000);
      setPriceDriedPerKg(65000);
      setPriceKasgotPerKg(1000);
      setPriceSeedEggPerGram(6000);

      setCapexConstruction(2500000);
      setCapexRacksAndTrays(1500000);
      setCapexOvenRoaster(1500000);
      setCapexToolsAndHarvest(500000);
      setCapexLumpSum(6000000);

      setOpexSeedAwal(300000);
      setOpexTransportSampah(600000);
      setOpexFermentasiEm4(150000);
      setOpexKemasanPouch(250000);
      setOpexListrikAir(200000);
      setOpexLumpSum(1500000);
    } else if (preset === "household_150") {
      // Skala Rumah Tangga / RT Komunal (150 kg/bln)
      setFreshMaggotKg(120);
      setDriedMaggotKg(5);
      setKasgotKg(180);
      setSeedEggsGram(0);

      setPriceFreshPerKg(8000);
      setPriceDriedPerKg(65000);
      setPriceKasgotPerKg(1500);
      setPriceSeedEggPerGram(6000);

      setCapexConstruction(800000);
      setCapexRacksAndTrays(600000);
      setCapexOvenRoaster(200000); // Wajan sangrai kompor
      setCapexToolsAndHarvest(200000);
      setCapexLumpSum(1800000);

      setOpexSeedAwal(100000);
      setOpexTransportSampah(150000);
      setOpexFermentasiEm4(50000);
      setOpexKemasanPouch(75000);
      setOpexListrikAir(75000);
      setOpexLumpSum(450000);
    } else if (preset === "commercial_2500") {
      // Skala Sentra TPS3R Komersial (2.500 kg/bln)
      setFreshMaggotKg(2000);
      setDriedMaggotKg(100);
      setKasgotKg(2800);
      setSeedEggsGram(150);

      setPriceFreshPerKg(7500);
      setPriceDriedPerKg(60000);
      setPriceKasgotPerKg(1000);
      setPriceSeedEggPerGram(5000);

      setCapexConstruction(9000000);
      setCapexRacksAndTrays(5500000);
      setCapexOvenRoaster(5500000); // Mesin rotary roaster
      setCapexToolsAndHarvest(2000000);
      setCapexLumpSum(22000000);

      setOpexSeedAwal(500000);
      setOpexTransportSampah(1800000);
      setOpexFermentasiEm4(600000);
      setOpexKemasanPouch(1100000);
      setOpexListrikAir(800000);
      setOpexLumpSum(4800000);
    }
  };

  // Automated Waste Input to Harvest Conversion
  const handleWasteConversionSync = () => {
    let yieldRatio = 0.20; // 20% fresh larvae default
    let kasgotRatio = 0.35;
    if (substrateYieldType === "resto") {
      yieldRatio = 0.23;
      kasgotRatio = 0.32;
    } else if (substrateYieldType === "tofu") {
      yieldRatio = 0.25;
      kasgotRatio = 0.38;
    }

    const monthlyWaste = dailyWasteKg * 30;
    const totalLarvae = Math.round(monthlyWaste * yieldRatio);
    // Allocate 85% fresh, 15% dried (approx 4.5kg fresh => 1kg dried)
    const freshPortion = Math.round(totalLarvae * 0.85);
    const driedPortion = Math.round((totalLarvae * 0.15) / 4.5);
    const kasgotTotal = Math.round(monthlyWaste * kasgotRatio);

    setFreshMaggotKg(freshPortion);
    setDriedMaggotKg(driedPortion);
    setKasgotKg(kasgotTotal);
    setActivePreset("custom");
  };

  // Financial Calculations
  const calculatedCapex = useMemo(() => {
    if (costMode === "lump_sum") return capexLumpSum;
    return capexConstruction + capexRacksAndTrays + capexOvenRoaster + capexToolsAndHarvest;
  }, [costMode, capexLumpSum, capexConstruction, capexRacksAndTrays, capexOvenRoaster, capexToolsAndHarvest]);

  const calculatedOpex = useMemo(() => {
    if (costMode === "lump_sum") return opexLumpSum;
    return opexSeedAwal + opexTransportSampah + opexFermentasiEm4 + opexKemasanPouch + opexListrikAir;
  }, [costMode, opexLumpSum, opexSeedAwal, opexTransportSampah, opexFermentasiEm4, opexKemasanPouch, opexListrikAir]);

  // Revenues
  const revFresh = useMemo(() => freshMaggotKg * priceFreshPerKg, [freshMaggotKg, priceFreshPerKg]);
  const revDried = useMemo(() => driedMaggotKg * priceDriedPerKg, [driedMaggotKg, priceDriedPerKg]);
  const revKasgot = useMemo(() => kasgotKg * priceKasgotPerKg, [kasgotKg, priceKasgotPerKg]);
  const revSeedEggs = useMemo(() => seedEggsGram * priceSeedEggPerGram, [seedEggsGram, priceSeedEggPerGram]);

  const totalOmzetMonthly = useMemo(() => {
    return revFresh + revDried + revKasgot + revSeedEggs;
  }, [revFresh, revDried, revKasgot, revSeedEggs]);

  const netProfitMonthly = useMemo(() => {
    return totalOmzetMonthly - calculatedOpex;
  }, [totalOmzetMonthly, calculatedOpex]);

  const profitMarginPercent = useMemo(() => {
    if (totalOmzetMonthly <= 0) return 0;
    return (netProfitMonthly / totalOmzetMonthly) * 100;
  }, [netProfitMonthly, totalOmzetMonthly]);

  const annualNetProfitProjected = useMemo(() => {
    return netProfitMonthly * 12;
  }, [netProfitMonthly]);

  // Break-Even Point (BEP) Calculations
  // BEP in Fresh Maggot Volume (kg) = Total OpEx / Selling Price Fresh Maggot
  const bepFreshMaggotKg = useMemo(() => {
    if (priceFreshPerKg <= 0) return 0;
    return calculatedOpex / priceFreshPerKg;
  }, [calculatedOpex, priceFreshPerKg]);

  // Margin of Safety (MoS %): how much buffer we have before dropping below break-even
  const marginOfSafetyPercent = useMemo(() => {
    if (freshMaggotKg <= 0) return 0;
    const mos = ((freshMaggotKg - bepFreshMaggotKg) / freshMaggotKg) * 100;
    return Math.max(-100, Math.min(100, mos));
  }, [freshMaggotKg, bepFreshMaggotKg]);

  // Break-Even Day in a 30-Day Cycle
  const breakEvenDayOfMonth = useMemo(() => {
    if (totalOmzetMonthly <= 0) return 30;
    const ratio = calculatedOpex / totalOmzetMonthly;
    const day = Math.ceil(ratio * 30);
    return Math.min(30, Math.max(1, day));
  }, [calculatedOpex, totalOmzetMonthly]);

  // Payback Period (Months to recover initial CapEx)
  const paybackPeriodMonths = useMemo(() => {
    if (netProfitMonthly <= 0) return 999;
    return calculatedCapex / netProfitMonthly;
  }, [calculatedCapex, netProfitMonthly]);

  // Business Feasibility Verdict
  const feasibilityVerdict = useMemo(() => {
    if (netProfitMonthly <= 0) {
      return {
        label: "DEFISIT / TIDAK MENGUNTUNGKAN",
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/15 border-rose-500/30",
        advice: "Biaya operasional melebihi omzet. Turunkan biaya transport atau naikkan volume panen & harga jual.",
        status: "danger",
      };
    }
    if (paybackPeriodMonths <= 3.5 && profitMarginPercent >= 45) {
      return {
        label: "SANGAT LAYAK & MENGUNTUNGKAN TINGGI (PRIMA)",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        advice: "Model bisnis sangat tangguh dengan masa balik modal kilat (<3.5 bulan) dan margin laba tebal. Sangat siap dieksekusi!",
        status: "excellent",
      };
    }
    if (paybackPeriodMonths <= 6) {
      return {
        label: "LAYAK & STABIL (MODERATE RETURN)",
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/15 border-blue-500/30",
        advice: "Arus kas sehat dan modal kembali dalam jangka menengah (3-6 bulan). Optimalkan porsi dried maggot untuk percepat BEP.",
        status: "good",
      };
    }
    return {
      label: "MARGIN TIPIS / PERLU OPTIMASI EFISIENSI",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30",
      advice: "Masa balik modal di atas 6 bulan. Pertimbangkan sistem Biopond Miring 30° untuk memotong biaya tenaga kerja sortir.",
      status: "warning",
    };
  }, [netProfitMonthly, paybackPeriodMonths, profitMarginPercent]);

  // Sensitivity Scenarios (Base, Best Case +15%, Stress Test -20% volume & +10% opex)
  const sensitivityScenarios = useMemo(() => {
    // Best Case (+15% revenue via price/volume, same opex)
    const bestOmzet = totalOmzetMonthly * 1.15;
    const bestProfit = bestOmzet - calculatedOpex;
    const bestPayback = bestProfit > 0 ? calculatedCapex / bestProfit : 999;

    // Worst Case (-20% harvest volume, +15% transport opex)
    const worstOmzet = totalOmzetMonthly * 0.8;
    const worstOpex = calculatedOpex * 1.12;
    const worstProfit = worstOmzet - worstOpex;
    const worstPayback = worstProfit > 0 ? calculatedCapex / worstProfit : 999;

    return {
      best: { omzet: bestOmzet, profit: bestProfit, payback: bestPayback },
      base: { omzet: totalOmzetMonthly, profit: netProfitMonthly, payback: paybackPeriodMonths },
      worst: { omzet: worstOmzet, profit: worstProfit, payback: worstPayback },
    };
  }, [totalOmzetMonthly, calculatedOpex, calculatedCapex, netProfitMonthly, paybackPeriodMonths]);

  // Formatted Executive Summary Text for Clipboard
  const executiveSummaryText = useMemo(() => {
    return `=====================================================
RINGKASAN EKSEKUTIF ANALISIS KELAYAKAN USAHA MAGGOCITY BSF
Inisiatif Ekonomi Sirkular Berdaya DKI Jakarta 2026
=====================================================

1. PROFIL & SKALA PRODUKSI BULANAN:
- Maggot Segar (Fresh): ${freshMaggotKg.toLocaleString("id-ID")} kg @ Rp${priceFreshPerKg.toLocaleString("id-ID")}/kg
- Maggot Kering (Dried): ${driedMaggotKg.toLocaleString("id-ID")} kg @ Rp${priceDriedPerKg.toLocaleString("id-ID")}/kg
- Pupuk Organik Kasgot: ${kasgotKg.toLocaleString("id-ID")} kg @ Rp${priceKasgotPerKg.toLocaleString("id-ID")}/kg
${seedEggsGram > 0 ? `- Telur Bibit BSF: ${seedEggsGram} gram @ Rp${priceSeedEggPerGram.toLocaleString("id-ID")}/gram\n` : ""}- Estimasi Sampah Terolah: ±${Math.round((freshMaggotKg / 0.2) / 1000 * 10) / 10} Ton sampah organik/bulan

2. STRUKTUR FINANSIAL & MODAL:
- Total Modal Investasi Awal (CapEx): Rp${calculatedCapex.toLocaleString("id-ID")}
- Total Biaya Operasional / Bulan (OpEx): Rp${calculatedOpex.toLocaleString("id-ID")}
- Total Omzet / Pendapatan Kotor / Bulan: Rp${totalOmzetMonthly.toLocaleString("id-ID")}
- LABA BERSIH OPERASIONAL / BULAN: Rp${netProfitMonthly.toLocaleString("id-ID")}
- Net Profit Margin: ${profitMarginPercent.toFixed(1)}%
- Proyeksi Laba Bersih Tahunan (12 Bln): Rp${annualNetProfitProjected.toLocaleString("id-ID")}

3. METRIK TITIK IMPAS (BEP) & BALIK MODAL:
- BEP Penjualan Maggot Segar: ${bepFreshMaggotKg.toFixed(1)} kg / bulan
  (Usaha telah menutup seluruh biaya operasional begitu ${bepFreshMaggotKg.toFixed(1)} kg maggot segar terjual)
- Margin of Safety (MoS): ${marginOfSafetyPercent.toFixed(1)}% di atas titik impas
- Titik Impas Tercapai: Hari ke-${breakEvenDayOfMonth} dari siklus 30 hari
- MASA BALIK MODAL (PAYBACK PERIOD): ${paybackPeriodMonths < 99 ? paybackPeriodMonths.toFixed(1) + " Bulan" : "Defisit"}

4. STATUS KELAYAKAN USAHA:
- Evaluasi: ${feasibilityVerdict.label}
- Rekomendasi: ${feasibilityVerdict.advice}

*Dibuat menggunakan MaggoCity Profitability & BEP Engine 2026*
=====================================================`;
  }, [
    freshMaggotKg,
    priceFreshPerKg,
    driedMaggotKg,
    priceDriedPerKg,
    kasgotKg,
    priceKasgotPerKg,
    seedEggsGram,
    priceSeedEggPerGram,
    calculatedCapex,
    calculatedOpex,
    totalOmzetMonthly,
    netProfitMonthly,
    profitMarginPercent,
    annualNetProfitProjected,
    bepFreshMaggotKg,
    marginOfSafetyPercent,
    breakEvenDayOfMonth,
    paybackPeriodMonths,
    feasibilityVerdict,
  ]);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(executiveSummaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Tool Overview */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDarkMode
            ? "bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-800/40"
            : "bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-emerald-200 shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Calculator className="w-3.5 h-3.5" />
                MaggoCity Engine 2026
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <Scale className="w-3.5 h-3.5" />
                Live Dynamic BEP Math
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Profitability &amp; BEP Calculator (Kalkulator Keuntungan &amp; Titik Impas)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Kalkulator simulasi komprehensif berbasis model ekonomi sirkular MaggoCity. Masukkan volume produksi,
              struktur biaya investasi &amp; operasional, serta harga target Anda untuk memperoleh ringkasan bisnis
              eksekutif seketika.
            </p>
          </div>

          {/* Quick Model Presets Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => applyPreset("standard_600")}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                activePreset === "standard_600"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Standar MaggoCity (600 kg)
            </button>
            <button
              onClick={() => applyPreset("household_150")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                activePreset === "household_150"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Skala RT (150 kg)
            </button>
            <button
              onClick={() => applyPreset("commercial_2500")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                activePreset === "commercial_2500"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Sentra TPS3R (2.500 kg)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left (5 Cols), Business Summary on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ==================================================== */}
        {/* LEFT COLUMN: PARAMETER INPUT CONTROLS (5 COLUMNS)    */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section A: Production Volume Inputs */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Volume Produksi Bulanan (Yield)
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setCalculationMode("direct_harvest")}
                  className={`px-2 py-0.5 rounded ${
                    calculationMode === "direct_harvest"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Panen Langsung
                </button>
                <button
                  onClick={() => setCalculationMode("waste_input")}
                  className={`px-2 py-0.5 rounded ${
                    calculationMode === "waste_input"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Konversi Sampah
                </button>
              </div>
            </div>

            {/* If Waste Conversion Mode is selected */}
            {calculationMode === "waste_input" && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Asupan Sampah Harian:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{dailyWasteKg} kg / hari</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={dailyWasteKg}
                    onChange={(e) => setDailyWasteKg(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>20 kg (RT)</span>
                    <span>100 kg (RW/Resto)</span>
                    <span>1.000 kg (Pasar)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  {[
                    { id: "standard", label: "Campur (20%)" },
                    { id: "resto", label: "Resto (23%)" },
                    { id: "tofu", label: "Tahu Mix (25%)" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSubstrateYieldType(s.id as any)}
                      className={`p-1.5 rounded text-center border font-semibold ${
                        substrateYieldType === s.id
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white/80 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleWasteConversionSync}
                  className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Hitung Konversi Panen Otomatis
                </button>
              </div>
            )}

            {/* Direct Harvest Volume Sliders */}
            <div className="space-y-3.5 text-xs">
              {/* Fresh Maggot */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Maggot Segar (Fresh):</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={freshMaggotKg}
                      onChange={(e) => {
                        setFreshMaggotKg(Number(e.target.value));
                        setActivePreset("custom");
                      }}
                      className="w-16 px-1.5 py-0.5 rounded text-right border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-emerald-600 dark:text-emerald-400"
                    />
                    <span className="text-slate-400 text-[11px]">kg/bln</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={freshMaggotKg}
                  onChange={(e) => {
                    setFreshMaggotKg(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Dried Maggot */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Maggot Kering (Dried Oven):</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={driedMaggotKg}
                      onChange={(e) => {
                        setDriedMaggotKg(Number(e.target.value));
                        setActivePreset("custom");
                      }}
                      className="w-16 px-1.5 py-0.5 rounded text-right border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-slate-400 text-[11px]">kg/bln</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={driedMaggotKg}
                  onChange={(e) => {
                    setDriedMaggotKg(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Kasgot Fertilizer */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Pupuk Kasgot Organik:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={kasgotKg}
                      onChange={(e) => {
                        setKasgotKg(Number(e.target.value));
                        setActivePreset("custom");
                      }}
                      className="w-16 px-1.5 py-0.5 rounded text-right border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-amber-600 dark:text-amber-400"
                    />
                    <span className="text-slate-400 text-[11px]">kg/bln</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="50"
                  value={kasgotKg}
                  onChange={(e) => {
                    setKasgotKg(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section B: Target Selling Prices */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Harga Jual Sasaran (Target Price)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 block">Maggot Segar (/kg)</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium">Rp</span>
                  <input
                    type="number"
                    step="500"
                    value={priceFreshPerKg}
                    onChange={(e) => {
                      setPriceFreshPerKg(Number(e.target.value));
                      setActivePreset("custom");
                    }}
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Standar: Rp8.000</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 block">Dried Maggot (/kg)</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    value={priceDriedPerKg}
                    onChange={(e) => {
                      setPriceDriedPerKg(Number(e.target.value));
                      setActivePreset("custom");
                    }}
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Standar: Rp65.000</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 block">Pupuk Kasgot (/kg)</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium">Rp</span>
                  <input
                    type="number"
                    step="200"
                    value={priceKasgotPerKg}
                    onChange={(e) => {
                      setPriceKasgotPerKg(Number(e.target.value));
                      setActivePreset("custom");
                    }}
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Standar: Rp1.000</span>
              </div>
            </div>
          </div>

          {/* Section C: Cost Structure (CapEx & OpEx) */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black">
                  3
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Struktur Biaya (Investasi &amp; Operasional)
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setCostMode("itemized")}
                  className={`px-2 py-0.5 rounded ${
                    costMode === "itemized"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Rincian Item
                </button>
                <button
                  onClick={() => setCostMode("lump_sum")}
                  className={`px-2 py-0.5 rounded ${
                    costMode === "lump_sum"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Total Cepat
                </button>
              </div>
            </div>

            {costMode === "lump_sum" ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[11px] block">Investasi Awal (CapEx):</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-semibold">Rp</span>
                    <input
                      type="number"
                      step="500000"
                      value={capexLumpSum}
                      onChange={(e) => {
                        setCapexLumpSum(Number(e.target.value));
                        setActivePreset("custom");
                      }}
                      className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[11px] block">Biaya Ops/Bulan (OpEx):</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-semibold">Rp</span>
                    <input
                      type="number"
                      step="100000"
                      value={opexLumpSum}
                      onChange={(e) => {
                        setOpexLumpSum(Number(e.target.value));
                        setActivePreset("custom");
                      }}
                      className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-bold text-amber-600 dark:text-amber-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* CapEx Summary Header */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Investasi Awal (Modal Tetap / CapEx):</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Rp {calculatedCapex.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Kandang &amp; Biopond:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {capexConstruction.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Rak &amp; Tray Plastik:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {capexRacksAndTrays.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Mesin Sangrai/Oven:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {capexOvenRoaster.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Alat Panen &amp; Timbangan:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {capexToolsAndHarvest.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OpEx Summary Header */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Biaya Operasional Bulanan (OpEx):</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      Rp {calculatedOpex.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Transport Sampah:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {opexTransportSampah.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Fermentasi EM4/Molase:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {opexFermentasiEm4.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Kemasan &amp; Pemasaran:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {opexKemasanPouch.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">Listrik &amp; Air:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Rp {opexListrikAir.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: INSTANT BUSINESS SUMMARY (7 COLUMNS)   */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Executive Feasibility Verdict Banner */}
          <div className={`p-5 rounded-2xl border ${feasibilityVerdict.color} transition-all`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                  Hasil Evaluasi Kelayakan Bisnis:
                </span>
                <h4 className="text-base sm:text-lg font-black tracking-tight">{feasibilityVerdict.label}</h4>
                <p className="text-xs opacity-90 leading-relaxed">{feasibilityVerdict.advice}</p>
              </div>

              <button
                onClick={handleCopySummary}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm ${
                  copiedText
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
                }`}
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Tersalin ke Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Ringkasan Bisnis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Core Monthly Highlights Grid (Omzet, OpEx, Laba Bersih, BEP) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Omzet */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Total Omzet / Bln
              </span>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Rp {totalOmzetMonthly.toLocaleString("id-ID")}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                {(totalOmzetMonthly / 1000000).toFixed(2)} Juta / bulan
              </span>
            </div>

            {/* OpEx */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Biaya Ops / Bln
              </span>
              <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                Rp {calculatedOpex.toLocaleString("id-ID")}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Biaya rutin bulanan
              </span>
            </div>

            {/* Laba Bersih */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Laba Bersih / Bln
              </span>
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                Rp {netProfitMonthly.toLocaleString("id-ID")}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                Margin: {profitMarginPercent.toFixed(1)}%
              </span>
            </div>

            {/* Balik Modal */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Balik Modal (ROI)
              </span>
              <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                {paybackPeriodMonths < 99 ? `${paybackPeriodMonths.toFixed(1)} Bln` : "N/A"}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                CapEx: Rp {(calculatedCapex / 1000000).toFixed(1)} Jt
              </span>
            </div>
          </div>

          {/* Deep-Dive BEP & Margin of Safety Engine Card */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Analisis Titik Impas (Break-Even Point Engine)
                </h4>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Formula: OpEx / Harga Jual
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* BEP Volume */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Volume Impas (Fresh):</span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {bepFreshMaggotKg.toFixed(1)} kg / bln
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Tolak ukur volume minimal maggot segar untuk menutup 100% biaya operasional bulanan.
                </p>
              </div>

              {/* Margin of Safety */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Batas Keamanan (MoS):</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  +{marginOfSafetyPercent.toFixed(1)}%
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Kapasitas panen Anda berada {marginOfSafetyPercent.toFixed(1)}% di atas zona impas (zona aman).
                </p>
              </div>

              {/* Break-Even Day */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Hari Capai Titik Impas:</span>
                <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                  Hari ke-{breakEvenDayOfMonth}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Sejak hari ke-{breakEvenDayOfMonth + 1} hingga akhir bulan, seluruh panen menjadi 100% keuntungan bersih!
                </p>
              </div>
            </div>

            {/* Visual MoS & Break-even Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  Progress Menuju BEP &amp; Margin Bersih:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Target: {freshMaggotKg} kg | BEP: {bepFreshMaggotKg.toFixed(1)} kg
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (bepFreshMaggotKg / Math.max(1, freshMaggotKg)) * 100)}%` }}
                  title="Porsi Biaya Operasional (BEP)"
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      0,
                      100 - (bepFreshMaggotKg / Math.max(1, freshMaggotKg)) * 100
                    )}%`,
                  }}
                  title="Margin Keuntungan Bersih"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                  Area Beban Operasional ({bepFreshMaggotKg.toFixed(1)} kg)
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Area Keuntungan Bersih (+{Math.max(0, freshMaggotKg - bepFreshMaggotKg).toFixed(1)} kg)
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Stream Breakdown Table */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Rincian Aliran Pendapatan Sirkular (Multi-Stream)
            </h4>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
                    <th className="py-2">Komoditas Produk</th>
                    <th className="py-2">Volume Panen</th>
                    <th className="py-2">Harga Satuan</th>
                    <th className="py-2 text-right">Subtotal Omzet</th>
                    <th className="py-2 text-right">Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  <tr>
                    <td className="py-2 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Maggot Segar
                    </td>
                    <td className="py-2">{freshMaggotKg.toLocaleString("id-ID")} kg</td>
                    <td className="py-2">Rp {priceFreshPerKg.toLocaleString("id-ID")}</td>
                    <td className="py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {revFresh.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 text-right text-slate-400">
                      {totalOmzetMonthly > 0 ? ((revFresh / totalOmzetMonthly) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Maggot Kering (Oven)
                    </td>
                    <td className="py-2">{driedMaggotKg.toLocaleString("id-ID")} kg</td>
                    <td className="py-2">Rp {priceDriedPerKg.toLocaleString("id-ID")}</td>
                    <td className="py-2 text-right font-bold text-blue-600 dark:text-blue-400">
                      Rp {revDried.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 text-right text-slate-400">
                      {totalOmzetMonthly > 0 ? ((revDried / totalOmzetMonthly) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Pupuk Kasgot Hayati
                    </td>
                    <td className="py-2">{kasgotKg.toLocaleString("id-ID")} kg</td>
                    <td className="py-2">Rp {priceKasgotPerKg.toLocaleString("id-ID")}</td>
                    <td className="py-2 text-right font-bold text-amber-600 dark:text-amber-400">
                      Rp {revKasgot.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 text-right text-slate-400">
                      {totalOmzetMonthly > 0 ? ((revKasgot / totalOmzetMonthly) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sensitivity Analysis Table (Stress Test) */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Uji Ketahanan &amp; Sensitivitas Usaha (Stress Test)
              </h4>
              <span className="text-[10px] text-slate-400">Skenario Optimis vs Konservatif</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                  Skenario Optimis (+15%)
                </span>
                <div className="font-black text-slate-800 dark:text-slate-100">
                  Rp {Math.round(sensitivityScenarios.best.profit).toLocaleString("id-ID")}/bln
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Balik modal: {sensitivityScenarios.best.payback < 99 ? sensitivityScenarios.best.payback.toFixed(1) + " bln" : "N/A"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 block uppercase">
                  Skenario Dasar (Aktif)
                </span>
                <div className="font-black text-slate-800 dark:text-slate-100">
                  Rp {Math.round(sensitivityScenarios.base.profit).toLocaleString("id-ID")}/bln
                </div>
                <span className="text-[10px] text-blue-600 font-semibold block">
                  Balik modal: {sensitivityScenarios.base.payback < 99 ? sensitivityScenarios.base.payback.toFixed(1) + " bln" : "N/A"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block uppercase">
                  Stress Test (-20% Panen)
                </span>
                <div className="font-black text-slate-800 dark:text-slate-100">
                  Rp {Math.round(sensitivityScenarios.worst.profit).toLocaleString("id-ID")}/bln
                </div>
                <span className="text-[10px] text-amber-600 font-semibold block">
                  Balik modal: {sensitivityScenarios.worst.payback < 99 ? sensitivityScenarios.worst.payback.toFixed(1) + " bln" : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
