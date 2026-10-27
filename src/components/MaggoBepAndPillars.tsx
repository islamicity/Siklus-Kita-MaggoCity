/**
 * MaggoBepAndPillars - Smart BSF Maggot 4 Pillars & BEP Business Model Component
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 * Sistem Budidaya Maggot BSF Cerdas & Berdaya + Simulasi Analisis Usaha BEP
 */

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Coins,
  Scale,
  Leaf,
  Box,
  Fish,
  Egg,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  DollarSign,
  Droplets,
  Thermometer,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Building,
  Target,
} from "lucide-react";
import {
  FOUR_PILLARS_BSF_DATA,
  DEFAULT_BEP_SIMULATION_DATA,
  BEP_SUCCESS_KEYS_DATA,
  MaggotPillar,
} from "../data/maggoCityData";

interface MaggoBepAndPillarsProps {
  isDarkMode: boolean;
}

export const MaggoBepAndPillars: React.FC<MaggoBepAndPillarsProps> = ({ isDarkMode }) => {
  // Active pillar view selection
  const [activePillarTab, setActivePillarTab] = useState<string>("pilar-1-zero-cost-feed");

  // Dynamic BEP Interactive Simulation States
  const [harvestFreshKg, setHarvestFreshKg] = useState<number>(500);
  const [harvestDriedKg, setHarvestDriedKg] = useState<number>(20);
  const [harvestKasgotKg, setHarvestKasgotKg] = useState<number>(600);

  const [priceFreshPerKg, setPriceFreshPerKg] = useState<number>(8000);
  const [priceDriedPerKg, setPriceDriedPerKg] = useState<number>(65000);
  const [priceKasgotPerKg, setPriceKasgotPerKg] = useState<number>(1000);

  // CapEx customization
  const [capexConstruction, setCapexConstruction] = useState<number>(2500000);
  const [capexRacksAndTrays, setCapexRacksAndTrays] = useState<number>(1500000);
  const [capexRoasterOven, setCapexRoasterOven] = useState<number>(1500000);
  const [capexTools, setCapexTools] = useState<number>(500000);

  // OpEx customization
  const [opexSeedEggs, setOpexSeedEggs] = useState<number>(300000);
  const [opexTransport, setOpexTransport] = useState<number>(600000);
  const [opexFermentation, setOpexFermentation] = useState<number>(150000);
  const [opexPackaging, setOpexPackaging] = useState<number>(250000);
  const [opexUtilities, setOpexUtilities] = useState<number>(200000);

  // Integrated Farming Symbiosis Calculator States
  const [catfishCount, setCatfishCount] = useState<number>(5000); // 5000 ekor lele
  const [chickenCount, setChickenCount] = useState<number>(100); // 100 ekor ayam
  const [feedSubstitutionPercent, setFeedSubstitutionPercent] = useState<number>(60); // 60% subs

  // Reset to default standard benchmark
  const handleResetToStandard = () => {
    setHarvestFreshKg(500);
    setHarvestDriedKg(20);
    setHarvestKasgotKg(600);

    setPriceFreshPerKg(8000);
    setPriceDriedPerKg(65000);
    setPriceKasgotPerKg(1000);

    setCapexConstruction(2500000);
    setCapexRacksAndTrays(1500000);
    setCapexRoasterOven(1500000);
    setCapexTools(500000);

    setOpexSeedEggs(300000);
    setOpexTransport(600000);
    setOpexFermentation(150000);
    setOpexPackaging(250000);
    setOpexUtilities(200000);
  };

  // Live Calculations
  const totalCapex = useMemo(() => {
    return capexConstruction + capexRacksAndTrays + capexRoasterOven + capexTools;
  }, [capexConstruction, capexRacksAndTrays, capexRoasterOven, capexTools]);

  const totalOpex = useMemo(() => {
    return opexSeedEggs + opexTransport + opexFermentation + opexPackaging + opexUtilities;
  }, [opexSeedEggs, opexTransport, opexFermentation, opexPackaging, opexUtilities]);

  const revFresh = useMemo(() => harvestFreshKg * priceFreshPerKg, [harvestFreshKg, priceFreshPerKg]);
  const revDried = useMemo(() => harvestDriedKg * priceDriedPerKg, [harvestDriedKg, priceDriedPerKg]);
  const revKasgot = useMemo(() => harvestKasgotKg * priceKasgotPerKg, [harvestKasgotKg, priceKasgotPerKg]);
  const totalOmzet = useMemo(() => revFresh + revDried + revKasgot, [revFresh, revDried, revKasgot]);

  const netProfitMonthly = useMemo(() => totalOmzet - totalOpex, [totalOmzet, totalOpex]);

  // BEP (Production Volume of Fresh Maggot to cover OpEx)
  const bepFreshKg = useMemo(() => {
    if (priceFreshPerKg <= 0) return 0;
    return totalOpex / priceFreshPerKg;
  }, [totalOpex, priceFreshPerKg]);

  // Payback period (Months to recover initial CapEx)
  const paybackPeriodMonths = useMemo(() => {
    if (netProfitMonthly <= 0) return 999;
    return totalCapex / netProfitMonthly;
  }, [totalCapex, netProfitMonthly]);

  // Integrated Farming Feed Savings Math
  // Lele needs ~100g pellet per fish during lifecycle. In a month, 5000 lele consume ~150 kg feed. Commercial pellet is ~Rp13.000/kg.
  const monthlyLeleFeedExpenseWithoutMaggot = useMemo(() => {
    const kgPellet = (catfishCount * 0.035); // ~35g/day/fish batch
    return kgPellet * 13500;
  }, [catfishCount]);

  const monthlyChickenFeedExpenseWithoutMaggot = useMemo(() => {
    const kgFeed = chickenCount * 0.12 * 30; // 120g/chicken/day
    return kgFeed * 8500;
  }, [chickenCount]);

  const totalFarmingMonthlySavings = useMemo(() => {
    const totalCommercialFeedExpense = monthlyLeleFeedExpenseWithoutMaggot + monthlyChickenFeedExpenseWithoutMaggot;
    return totalCommercialFeedExpense * (feedSubstitutionPercent / 100);
  }, [monthlyLeleFeedExpenseWithoutMaggot, monthlyChickenFeedExpenseWithoutMaggot, feedSubstitutionPercent]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden transition-all ${
          isDarkMode
            ? "bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-800/40"
            : "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200 shadow-sm"
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Model Cerdas &amp; Berdaya BSF 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              <Coins className="w-3.5 h-3.5" />
              BEP Balik Modal 1,3 - 3 Bulan
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              <Fish className="w-3.5 h-3.5" />
              Hemat Pakan 50–70%
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Budidaya Maggot BSF Cerdas &amp; Berdaya: Ekonomi Sirkular &amp; Analisis BEP
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Pendekatan biokonversi lalat tentara hitam (<em>Black Soldier Fly</em>) yang menitikberatkan pada integrasi
            pakan limbah gratis, mekanisasi kandang mandiri sudut 30°, diversifikasi produk multi-aliran, serta simbiosis
            peternakan terpadu untuk menekan biaya dan melipatgandakan keuntungan.
          </p>
        </div>

        {/* Quick Benchmark Badge */}
        <div className="mt-6 pt-6 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium block">Investasi Awal (Modal)</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Rp {DEFAULT_BEP_SIMULATION_DATA.totalCapexIdr.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium block">Biaya Operasional / Bln</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Rp {DEFAULT_BEP_SIMULATION_DATA.totalOpexMonthlyIdr.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium block">Laba Bersih / Bln</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              Rp {DEFAULT_BEP_SIMULATION_DATA.netProfitMonthlyIdr.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium block">BEP Penjualan Maggot</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400">
              {DEFAULT_BEP_SIMULATION_DATA.bepProductionKgMonthly} kg / bulan
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 1: 4 PILAR UTAMA BUDIDAYA MAGGOT CERDAS & BERDAYA */}
      {/* ========================================================== */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                1
              </span>
              4 Pilar Utama Budidaya Maggot Cerdas &amp; Berdaya
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prinsip arsitektur operasional untuk menghasilkan panen efisien, nol bau limbah di pemukiman, dan margin
              keuntungan tinggi.
            </p>
          </div>
        </div>

        {/* 4 Pillars Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {FOUR_PILLARS_BSF_DATA.map((p) => {
            const isActive = activePillarTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillarTab(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isActive
                    ? isDarkMode
                      ? "bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                      : "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md ring-1 ring-emerald-600"
                    : isDarkMode
                    ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-emerald-500 text-slate-950"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    PILAR {p.pillarNumber}
                  </span>
                  {p.pillarNumber === 1 && <Leaf className="w-4 h-4 text-emerald-500" />}
                  {p.pillarNumber === 2 && <Box className="w-4 h-4 text-blue-500" />}
                  {p.pillarNumber === 3 && <Coins className="w-4 h-4 text-amber-500" />}
                  {p.pillarNumber === 4 && <Fish className="w-4 h-4 text-teal-500" />}
                </div>
                <h4 className="text-xs font-bold line-clamp-1">{p.title}</h4>
                <p className="text-[11px] opacity-75 line-clamp-2 mt-1">{p.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Detailed View */}
        {(() => {
          const pilar = FOUR_PILLARS_BSF_DATA.find((p) => p.id === activePillarTab) || FOUR_PILLARS_BSF_DATA[0];
          return (
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-500 text-slate-950">
                      Pilar {pilar.pillarNumber}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{pilar.title}</h4>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {pilar.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {pilar.coreConcept}
                  </p>
                </div>

                {/* Pillar Specific Highlight Badge */}
                <div
                  className={`p-4 rounded-xl border text-xs max-w-xs ${
                    isDarkMode ? "bg-emerald-950/40 border-emerald-800/60" : "bg-emerald-50/80 border-emerald-200"
                  }`}
                >
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Manfaat Utama Pilar {pilar.pillarNumber}
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                    {pilar.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Special Interactive Schematics for Pillar 1 and Pillar 2 */}
              {pilar.pillarNumber === 1 && (
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Resep Standar Fermentasi EM4 &amp; Molase (Zero-Cost &amp; Nol Bau)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800/40">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">1. Sampah Organik</span>
                      <span className="text-lg font-black text-emerald-600">100 kg</span>
                      <p className="text-[10px] text-slate-500 mt-1">Pasar sayur, buah, sisa nasi katering dicacah halus (5-15 mm).</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800/40">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">2. EM4 Aktif</span>
                      <span className="text-lg font-black text-blue-600">200 ml</span>
                      <p className="text-[10px] text-slate-500 mt-1">Bakteri asam laktat &amp; ragi pengurai amonia penekan bau.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800/40">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">3. Molase / Tetes Tebu</span>
                      <span className="text-lg font-black text-amber-600">200 ml</span>
                      <p className="text-[10px] text-slate-500 mt-1">Sumber glukosa energi percepat pembiakan mikroba probiotik.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800/40">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">4. Waktu Inkubasi</span>
                      <span className="text-lg font-black text-purple-600">24-48 Jam</span>
                      <p className="text-[10px] text-slate-500 mt-1">Anaerob dalam tong tertutup, beraroma tape segar siap tebar.</p>
                    </div>
                  </div>
                </div>
              )}

              {pilar.pillarNumber === 2 && (
                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                      <Box className="w-4 h-4" />
                      Mekanisme Biopond Miring ~30° Self-Harvesting Mandiri
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Memotong 80% Tenaga Sortir
                    </span>
                  </div>

                  {/* Visual Diagram Representation */}
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                      <span>[SKEMA TEKNIS BIOPOND SELF-HARVESTING MAGGOCITY]</span>
                      <span className="text-amber-400">Sudut Kemiringan: 30° - 35°</span>
                    </div>
                    <div className="py-2 text-[11px] leading-relaxed">
                      ┌──────────────────────────────────────────────┐<br />
                      │ &nbsp;[AREA MAKAN LARVA INSTAR 3-5]&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│<br />
                      │ &nbsp;Substrat lembab 60-70% + sampah fermentasi&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │<br />
                      │ &nbsp;Larva aktif makan secara voracious &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│<br />
                      └──────────────────────┐&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │<br />
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;/\ &nbsp;[RAMP MIRING ~30°] &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│<br />
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;/ &nbsp;Prepupa fotofobik merayap naik &nbsp;│<br />
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│ &nbsp;/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;│<br />
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;▼&nbsp;/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │<br />
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [WADAH EMBER PENAMPUNG PANEN OTOMATIS]
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      *Saat larva berganti kulit menjadi prepupa cokelat, insting alaminya mencari tempat kering dan gelap di tempat lebih tinggi. Larva merayap sendiri melewati sudut 30° dan terjatuh ke pipa/ember panen dalam keadaan 100% bersih tanpa residu kasgot!
                    </p>
                  </div>
                </div>
              )}

              {pilar.pillarNumber === 3 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] font-bold uppercase text-amber-500 block mb-1">Produk 1</span>
                    <h5 className="font-bold text-xs">Telur BSF (Bibit)</h5>
                    <p className="text-xs font-black text-emerald-600 mt-1">Rp5.000 - Rp8.000/g</p>
                    <span className="text-[10px] text-slate-500 block mt-1">Untuk peternak pemula Jabodetabek</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] font-bold uppercase text-emerald-500 block mb-1">Produk 2</span>
                    <h5 className="font-bold text-xs">Maggot Segar</h5>
                    <p className="text-xs font-black text-emerald-600 mt-1">Rp6.000 - Rp8.000/kg</p>
                    <span className="text-[10px] text-slate-500 block mt-1">Pakan lele, nila, ayam, bebek</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] font-bold uppercase text-blue-500 block mb-1">Produk 3</span>
                    <h5 className="font-bold text-xs">Dried Maggot (Oven)</h5>
                    <p className="text-xs font-black text-emerald-600 mt-1">Rp60.000 - Rp75.000/kg</p>
                    <span className="text-[10px] text-slate-500 block mt-1">Pakan burung kicau &amp; ikan predator</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] font-bold uppercase text-purple-500 block mb-1">Produk 4</span>
                    <h5 className="font-bold text-xs">Pupuk Kasgot</h5>
                    <p className="text-xs font-black text-emerald-600 mt-1">Rp1.000 - Rp3.500/kg</p>
                    <span className="text-[10px] text-slate-500 block mt-1">Pupuk organik sisa pencernaan</span>
                  </div>
                </div>
              )}

              {pilar.pillarNumber === 4 && (
                <div className="mt-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
                      <Fish className="w-4 h-4" />
                      Kalkulator Penghematan Pakan Ternak Terpadu (Simbiosis Maggot)
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      Substitusi Pakan: {feedSubstitutionPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                        Populasi Ikan Lele / Nila:
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={catfishCount}
                        onChange={(e) => setCatfishCount(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                      <div className="flex justify-between text-xs font-bold">
                        <span>{catfishCount.toLocaleString("id-ID")} Ekor</span>
                        <span className="text-slate-400">Kolam Bioflok</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                        Populasi Ayam Petelur / Kampung:
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="1000"
                        step="20"
                        value={chickenCount}
                        onChange={(e) => setChickenCount(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                      <div className="flex justify-between text-xs font-bold">
                        <span>{chickenCount.toLocaleString("id-ID")} Ekor</span>
                        <span className="text-slate-400">Kandang Unggas</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-600 text-white flex flex-col justify-center space-y-1">
                      <span className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">
                        Estimasi Hemat Biaya Pakan / Bulan
                      </span>
                      <span className="text-lg font-black">
                        Rp {Math.round(totalFarmingMonthlySavings).toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] text-emerald-200">
                        Memotong 50-70% biaya pelet komersial pabrikan
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocols Breakdown */}
              <div className="mt-6 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Protokol Operasional &amp; Standar Kerja
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {pilar.operationalProtocols.map((op, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1.5"
                    >
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{op.title}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{op.description}</p>
                      {op.parameters && (
                        <div className="pt-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                          {op.parameters}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Tips */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tips Lapangan:
                </span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {pilar.practicalTips[0]} {pilar.practicalTips[1]}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ========================================================== */}
      {/* SECTION 2: SIMULASI ANALISIS USAHA & BEP (±600 KG/BULAN)  */}
      {/* ========================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                2
              </span>
              Simulasi Analisis Usaha &amp; Titik Impas (BEP)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Simulasi bisnis skala menengah kapasitas target panen ±600 kg maggot per bulan dengan kalkulator dinamis.
            </p>
          </div>

          <button
            onClick={handleResetToStandard}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Tolak Ukur Standar (Rp6 Juta)
          </button>
        </div>

        {/* 3 Core Output Cards: Laba Bersih, BEP Kg, Payback Period */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Laba Bersih */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Laba Bersih / Bulan</span>
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                <Coins className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              Rp {netProfitMonthly.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Omzet (Rp {totalOmzet.toLocaleString("id-ID")}) - Biaya Ops (Rp {totalOpex.toLocaleString("id-ID")})
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded">
              Laba = Rp{totalOmzet.toLocaleString("id-ID")} - Rp{totalOpex.toLocaleString("id-ID")} = Rp{netProfitMonthly.toLocaleString("id-ID")}
            </div>
          </div>

          {/* Card 2: BEP Produksi */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">2. BEP Produksi Maggot</span>
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                <Scale className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {bepFreshKg.toFixed(1)} kg / bulan
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tolak ukur volume penjualan impas maggot segar untuk menutup seluruh biaya operasional.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded">
              BEP (kg) = Rp{totalOpex.toLocaleString("id-ID")} / Rp{priceFreshPerKg.toLocaleString("id-ID")} = {bepFreshKg.toFixed(1)} kg
            </div>
          </div>

          {/* Card 3: Payback Period */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Masa Balik Modal</span>
              <span className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {paybackPeriodMonths < 99 ? `${paybackPeriodMonths.toFixed(1)} Bulan` : "Defisit"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rasio Investasi Awal (Rp {totalCapex.toLocaleString("id-ID")}) terhadap Laba Bersih.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded">
              Balik Modal = Rp{totalCapex.toLocaleString("id-ID")} / Rp{netProfitMonthly.toLocaleString("id-ID")} ≈ {paybackPeriodMonths.toFixed(1)} bln
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Tables and Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column A: Modal Tetap (Investasi Awal) */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  A. Investasi Awal (Modal Tetap)
                </h4>
              </div>
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                Rp {totalCapex.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Kandang BSF + Biopond Semen 30°</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {capexConstruction.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="5000000"
                  step="250000"
                  value={capexConstruction}
                  onChange={(e) => setCapexConstruction(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block">Kandang indukan jaring + biopond miring 30°</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Rak &amp; Wadah Tray Plastik</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {capexRacksAndTrays.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="3500000"
                  step="250000"
                  value={capexRacksAndTrays}
                  onChange={(e) => setCapexRacksAndTrays(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block">30-40 tray plastik pembesaran 5-DOL</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Mesin Sangrai / Oven Maggot</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {capexRoasterOven.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="4000000"
                  step="250000"
                  value={capexRoasterOven}
                  onChange={(e) => setCapexRoasterOven(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block">Wajan putar sangrai / oven dehidrator</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Peralatan Panen, Timbangan, Saringan</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {capexTools.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="1500000"
                  step="100000"
                  value={capexTools}
                  onChange={(e) => setCapexTools(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block">Timbangan duduk 50kg, ayakan kasgot, eggies kayu</span>
              </div>
            </div>
          </div>

          {/* Column B: Biaya Operasional / Bulan */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  B. Biaya Operasional / Bulan
                </h4>
              </div>
              <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                Rp {totalOpex.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Bibit/Telur BSF (Awal)</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {opexSeedEggs.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="800000"
                  step="50000"
                  value={opexSeedEggs}
                  onChange={(e) => setOpexSeedEggs(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-400 block">Starter telur 50-60g (hanya awal; kelak mandiri)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Transportasi Pengambilan Sampah</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {opexTransport.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="1500000"
                  step="100000"
                  value={opexTransport}
                  onChange={(e) => setOpexTransport(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-400 block">Bensin motor gerobak jemput pasar &amp; resto DKI</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Bahan Fermentasi (EM4, Molase)</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {opexFermentation.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="25000"
                  value={opexFermentation}
                  onChange={(e) => setOpexFermentation(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-400 block">Mikroba EM4 + tetes tebu penekan amonia bau</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Kemasan, Pouch, &amp; Pemasaran</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {opexPackaging.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="600000"
                  step="50000"
                  value={opexPackaging}
                  onChange={(e) => setOpexPackaging(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-400 block">Pouch standing zipper dried maggot + karung kasgot</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Operasional Listrik &amp; Air</span>
                  <span className="text-slate-700 dark:text-slate-300">Rp {opexUtilities.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="25000"
                  value={opexUtilities}
                  onChange={(e) => setOpexUtilities(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-400 block">Pompa cuci maggot, lampu UV, air sumur</span>
              </div>
            </div>
          </div>

          {/* Column C: Estimasi Pendapatan Per Bulan */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  C. Estimasi Pendapatan / Bulan
                </h4>
              </div>
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                Rp {totalOmzet.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Maggot Segar ({harvestFreshKg} kg @ Rp{priceFreshPerKg.toLocaleString("id-ID")})</span>
                  <span className="text-emerald-600 font-bold">Rp {revFresh.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={harvestFreshKg}
                  onChange={(e) => setHarvestFreshKg(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Harga: Rp{priceFreshPerKg.toLocaleString("id-ID")}/kg</span>
                  <span>Target: 500 kg/bln</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Maggot Kering ({harvestDriedKg} kg @ Rp{priceDriedPerKg.toLocaleString("id-ID")})</span>
                  <span className="text-emerald-600 font-bold">Rp {revDried.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={harvestDriedKg}
                  onChange={(e) => setHarvestDriedKg(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Harga: Rp{priceDriedPerKg.toLocaleString("id-ID")}/kg</span>
                  <span>Target: 20 kg/bln</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Pupuk Kasgot ({harvestKasgotKg} kg @ Rp{priceKasgotPerKg.toLocaleString("id-ID")})</span>
                  <span className="text-emerald-600 font-bold">Rp {revKasgot.toLocaleString("id-ID")}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={harvestKasgotKg}
                  onChange={(e) => setHarvestKasgotKg(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Harga: Rp{priceKasgotPerKg.toLocaleString("id-ID")}/kg</span>
                  <span>Target: 600 kg/bln</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-1">
                <span className="font-bold text-[11px] block">Formula Titik Impas (BEP):</span>
                <p className="text-[10px] font-mono leading-relaxed">
                  BEP (Kg) = Biaya Operasional / Harga Jual Segar<br />
                  BEP (Kg) = Rp{totalOpex.toLocaleString("id-ID")} / Rp{priceFreshPerKg.toLocaleString("id-ID")} = <strong>{bepFreshKg.toFixed(1)} kg</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 3: KUNCI SUKSES MEMPERCEPAT BEP                  */}
      {/* ========================================================== */}
      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold">
              3
            </span>
            Kunci Sukses Mempercepat Titik Impas (BEP)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            3 pilar akselerasi wajib diterapkan oleh perintis biokonversi MaggoCity untuk memastikan balik modal di bawah 3 bulan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BEP_SUCCESS_KEYS_DATA.map((key) => (
            <div
              key={key.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDarkMode ? "bg-slate-900/80 border-slate-800 hover:border-emerald-600/50" : "bg-white border-slate-200 shadow-sm hover:border-emerald-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Target className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{key.title}</h4>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                  {key.coreRule}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">Dampak Akselerasi BEP: </strong>
                  {key.impactOnBep}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Checklist Tindakan Nyata:
                  </span>
                  {key.actionItems.map((act, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px]">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{key.warningNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
