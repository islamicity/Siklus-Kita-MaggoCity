import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  MapPin,
  Flame,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Truck,
  ShieldCheck,
  Activity,
  Sliders,
  Filter,
  RefreshCw,
  ArrowRight,
  Info,
  Maximize2,
  X,
  Phone,
  Clock,
  Building,
  Check,
  Share2,
} from "lucide-react";
import {
  DKI_TPS3R_FACILITIES,
  DKI_WASTE_DENSITY_HOTSPOTS,
  DKI_MUNICIPALITIES,
  DKI_MAP_WATERWAYS,
  DKI_MAJOR_CORRIDORS,
  ExtendedTPS3RFacility,
} from "../data/dkiJakartaTPS3RData";

interface JakartaTPS3RMapProps {
  isDarkMode: boolean;
  onFacilitySelect?: (facility: ExtendedTPS3RFacility) => void;
}

export const JakartaTPS3RMap: React.FC<JakartaTPS3RMapProps> = ({
  isDarkMode,
  onFacilitySelect,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Facilities & Hotspots state (can be mutated by simulations and AI balancing)
  const [facilities, setFacilities] = useState<ExtendedTPS3RFacility[]>(DKI_TPS3R_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<ExtendedTPS3RFacility | null>(
    DKI_TPS3R_FACILITIES.find((f) => f.capacityPercent >= 90) || DKI_TPS3R_FACILITIES[0]
  );

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [saturationFilter, setSaturationFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "SAFE">("ALL");
  const [thresholdCutoff, setThresholdCutoff] = useState<number>(80);
  const [highlightOnlySaturated, setHighlightOnlySaturated] = useState<boolean>(false);

  // Layer Toggles
  const [showDensityHeatmap, setShowDensityHeatmap] = useState<boolean>(true);
  const [showWaterways, setShowWaterways] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showDistrictLabels, setShowDistrictLabels] = useState<boolean>(true);

  // Map Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Real-time Simulation & Auto-balancing state
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState<boolean>(true);
  const [activeRerouteLine, setActiveRerouteLine] = useState<{
    from: ExtendedTPS3RFacility;
    to: ExtendedTPS3RFacility;
    tonnage: number;
  } | null>(null);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Live telemetry pulse effect every 8 seconds when active
  useEffect(() => {
    if (!isLiveTelemetryActive) return;
    const interval = setInterval(() => {
      setFacilities((prev) =>
        prev.map((fac) => {
          // slight random fluctuation ±1-2%
          const delta = (Math.random() - 0.48) * 2;
          const newCap = Math.max(30, Math.min(99, Math.round(fac.capacityPercent + delta)));
          const newIntake = Number(((newCap / 100) * fac.dailyCapacityTons).toFixed(2));
          return {
            ...fac,
            capacityPercent: newCap,
            currentIntakeTons: newIntake,
            saturationLevel: newCap >= 80 ? "CRITICAL" : newCap >= 60 ? "WARNING" : "NORMAL",
            lastTelemetryUpdate: "Baru saja",
          };
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [isLiveTelemetryActive]);

  // Filtered facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      // Region filter
      if (selectedRegion !== "ALL" && fac.regionId !== selectedRegion) {
        return false;
      }
      // Saturation chip filter
      if (saturationFilter === "CRITICAL" && fac.capacityPercent < 80) return false;
      if (saturationFilter === "WARNING" && (fac.capacityPercent < 60 || fac.capacityPercent >= 80)) return false;
      if (saturationFilter === "SAFE" && fac.capacityPercent >= 60) return false;

      // Threshold slider filter if active
      if (highlightOnlySaturated && fac.capacityPercent < thresholdCutoff) {
        return false;
      }
      return true;
    });
  }, [facilities, selectedRegion, saturationFilter, thresholdCutoff, highlightOnlySaturated]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = facilities.length;
    const critical = facilities.filter((f) => f.capacityPercent >= 80).length;
    const warning = facilities.filter((f) => f.capacityPercent >= 60 && f.capacityPercent < 80).length;
    const safe = facilities.filter((f) => f.capacityPercent < 60).length;
    const totalDailyCapacity = facilities.reduce((acc, f) => acc + f.dailyCapacityTons, 0);
    const totalDailyIntake = facilities.reduce((acc, f) => acc + f.currentIntakeTons, 0);
    const avgSaturation = Math.round((totalDailyIntake / totalDailyCapacity) * 100);

    return {
      total,
      critical,
      warning,
      safe,
      totalDailyCapacity: totalDailyCapacity.toFixed(1),
      totalDailyIntake: totalDailyIntake.toFixed(1),
      avgSaturation,
    };
  }, [facilities]);

  // Action: Trigger AI Load Balancing
  const handleAILoadBalance = () => {
    // Find highest saturated facility and lowest saturated in same or neighboring region
    const sorted = [...facilities].sort((a, b) => b.capacityPercent - a.capacityPercent);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    if (!highest || !lowest || highest.capacityPercent < 75) {
      setDispatchNotice("Semua fasilitas TPS3R dalam rentang kapasitas aman (<75%).");
      setTimeout(() => setDispatchNotice(null), 4000);
      return;
    }

    const transferTons = 1.6;
    setActiveRerouteLine({
      from: highest,
      to: lowest,
      tonnage: transferTons,
    });

    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === highest.id) {
          const newIntake = Math.max(1, f.currentIntakeTons - transferTons);
          const newCap = Math.round((newIntake / f.dailyCapacityTons) * 100);
          return {
            ...f,
            currentIntakeTons: Number(newIntake.toFixed(2)),
            capacityPercent: newCap,
            saturationLevel: newCap >= 80 ? "CRITICAL" : newCap >= 60 ? "WARNING" : "NORMAL",
            status: newCap >= 85 ? "FULL_SOON" : "OPEN",
          };
        }
        if (f.id === lowest.id) {
          const newIntake = f.currentIntakeTons + transferTons;
          const newCap = Math.round((newIntake / f.dailyCapacityTons) * 100);
          return {
            ...f,
            currentIntakeTons: Number(newIntake.toFixed(2)),
            capacityPercent: newCap,
            saturationLevel: newCap >= 80 ? "CRITICAL" : newCap >= 60 ? "WARNING" : "NORMAL",
          };
        }
        return f;
      })
    );

    setDispatchNotice(
      `⚡ AI Load-Balancing Berhasil: Mengalihkan ${transferTons} Ton timbulan dari ${highest.name} (${highest.capacityPercent}% -> ${highest.capacityPercent - 15}%) ke ${lowest.name}!`
    );

    setTimeout(() => {
      setActiveRerouteLine(null);
    }, 7000);
    setTimeout(() => {
      setDispatchNotice(null);
    }, 8000);
  };

  // Action: Specific Dispatch for single facility
  const handleDispatchRelief = (facility: ExtendedTPS3RFacility) => {
    // Find lowest facility in same region or overall
    const candidates = facilities
      .filter((f) => f.id !== facility.id && f.capacityPercent < 70)
      .sort((a, b) => a.capacityPercent - b.capacityPercent);

    const target = candidates[0] || facilities.find((f) => f.id !== facility.id);
    if (!target) return;

    const transferTons = 1.4;
    setActiveRerouteLine({
      from: facility,
      to: target,
      tonnage: transferTons,
    });

    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === facility.id) {
          const newIntake = Math.max(1, f.currentIntakeTons - transferTons);
          const newCap = Math.round((newIntake / f.dailyCapacityTons) * 100);
          const updated = {
            ...f,
            currentIntakeTons: Number(newIntake.toFixed(2)),
            capacityPercent: newCap,
            saturationLevel: (newCap >= 80 ? "CRITICAL" : newCap >= 60 ? "WARNING" : "NORMAL") as any,
            status: (newCap >= 85 ? "FULL_SOON" : "OPEN") as any,
          };
          setSelectedFacility(updated);
          return updated;
        }
        if (f.id === target.id) {
          const newIntake = f.currentIntakeTons + transferTons;
          const newCap = Math.round((newIntake / f.dailyCapacityTons) * 100);
          return {
            ...f,
            currentIntakeTons: Number(newIntake.toFixed(2)),
            capacityPercent: newCap,
            saturationLevel: (newCap >= 80 ? "CRITICAL" : newCap >= 60 ? "WARNING" : "NORMAL") as any,
          };
        }
        return f;
      })
    );

    setDispatchNotice(
      `🚚 Armada Penyeimbang Dikirim! 2 Unit Truk Sampah Terpilah dialihkan ke ${target.name}. Saturasi ${facility.name} turun menjadi aman.`
    );
    setTimeout(() => setActiveRerouteLine(null), 7000);
    setTimeout(() => setDispatchNotice(null), 8000);
  };

  // Action: Simulate Holiday Feast / Rain Storm Surge (+15%)
  const handleSimulateSurge = () => {
    setFacilities((prev) =>
      prev.map((f) => {
        const surge = Math.round(Math.random() * 8 + 7); // +7% to +15%
        const newCap = Math.min(99, f.capacityPercent + surge);
        const newIntake = Number(((newCap / 100) * f.dailyCapacityTons).toFixed(2));
        return {
          ...f,
          capacityPercent: newCap,
          currentIntakeTons: newIntake,
          saturationLevel: newCap >= 80 ? "CRITICAL" : newCap >= 60 ? "WARNING" : "NORMAL",
          status: newCap >= 85 ? "FULL_SOON" : "OPEN",
        };
      })
    );
    setDispatchNotice("📈 Simulasi Lonjakan Sampah Hari Libur / Hujan Deras Diterapkan (+10-15% Seluruh DKI Jakarta)!");
    setTimeout(() => setDispatchNotice(null), 5000);
  };

  // Action: Reset Data
  const handleResetBaseline = () => {
    setFacilities(DKI_TPS3R_FACILITIES);
    setSelectedFacility(DKI_TPS3R_FACILITIES[0]);
    setActiveRerouteLine(null);
    setDispatchNotice("Status kapasitas TPS3R DKI Jakarta dikembalikan ke data patokan dasar.");
    setTimeout(() => setDispatchNotice(null), 4000);
  };

  // Pan & Zoom Handlers
  const handleZoom = (factor: number) => {
    setZoomLevel((prev) => Math.min(3.0, Math.max(0.8, Number((prev * factor).toFixed(2)))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cardBase = isDarkMode
    ? "bg-slate-900/90 border-slate-700/80 text-slate-100 shadow-xl"
    : "bg-white border-slate-200/90 text-slate-800 shadow-lg";

  return (
    <div
      id="jakarta-tps3r-interactive-map"
      className={`p-5 sm:p-6 rounded-3xl border ${cardBase} space-y-6 transition-all relative overflow-hidden`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-800 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md shadow-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-slate-100">
                  Peta Spasial & Status Real-Time TPS3R DKI Jakarta
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  GIS Waste Infrastructure DLH
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pemantauan densitas timbulan sampah dan identifikasi dini saturasi kapasitas Tempat Pengolahan Sampah Reuse-Reduce-Recycle di 5 Kotamadya.
              </p>
            </div>
          </div>
        </div>

        {/* Live Status indicator & AI Balancer trigger */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
          <button
            onClick={() => setIsLiveTelemetryActive(!isLiveTelemetryActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
              isLiveTelemetryActive
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500"
            }`}
            title="Aktifkan atau jeda polling telemetri live dari sensor TPS3R"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveTelemetryActive ? "bg-emerald-500 animate-ping" : "bg-slate-400"
              }`}
            />
            {isLiveTelemetryActive ? "Live Telemetri On" : "Telemetri Dijeda"}
          </button>

          <button
            id="ai-load-balance-button"
            onClick={handleAILoadBalance}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Load Balancer</span>
          </button>

          <button
            onClick={handleSimulateSurge}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
            title="Simulasikan lonjakan timbulan sampah +15% untuk menguji respon saturasi"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulasi Surge</span>
          </button>

          <button
            onClick={handleResetBaseline}
            className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
            title="Reset ke patokan data awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical High Saturation Alert Banner */}
      {stats.critical > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 shadow-sm shadow-rose-500/40 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>Peringatan Saturasi Sampah Tinggi: {stats.critical} Fasilitas TPS3R Melebihi Batas Aman (≥80%)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                Fasilitas berkedip merah mengalami penumpukan input residu dan organik. Disarankan mengalihkan armada ke fasilitas penyangga yang memiliki ruang kapasitas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSaturationFilter("CRITICAL");
                setHighlightOnlySaturated(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition shadow cursor-pointer"
            >
              Fokus Fasilitas Kritis
            </button>
          </div>
        </div>
      )}

      {/* Dispatch Action Notice Toast */}
      {dispatchNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between gap-2 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-medium">{dispatchNotice}</span>
          </div>
          <button
            onClick={() => setDispatchNotice(null)}
            className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary KPI Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Total TPS3R DKI</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-slate-800 dark:text-slate-100">
            {stats.total} <span className="text-xs font-normal text-slate-400">Unit</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tersebar di 5 Kotamadya</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/30">
          <div className="text-rose-600 dark:text-rose-400 font-medium text-[11px] flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Saturasi Tinggi (≥80%)
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-rose-600 dark:text-rose-400">
            {stats.critical} <span className="text-xs font-normal">Fasilitas</span>
          </div>
          <div className="text-[10px] text-rose-500/80 mt-0.5">Perlu redistribusi rute armada</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30">
          <div className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">Waspada (60–79%)</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-amber-600 dark:text-amber-400">
            {stats.warning} <span className="text-xs font-normal">Fasilitas</span>
          </div>
          <div className="text-[10px] text-amber-500/80 mt-0.5">Mendekati batas optimal</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">Kapasitas Aman (&lt;60%)</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
            {stats.safe} <span className="text-xs font-normal">Fasilitas</span>
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">Tersedia headroom penerimaan</div>
        </div>
      </div>

      {/* Control Bar: Region Tabs & Quick Saturation Filters */}
      <div className="space-y-3">
        {/* Municipality Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "ALL", label: "Seluruh DKI Jakarta" },
            { id: "jaksel", label: "Jakarta Selatan" },
            { id: "jakpus", label: "Jakarta Pusat" },
            { id: "jaktim", label: "Jakarta Timur" },
            { id: "jakbar", label: "Jakarta Barat" },
            { id: "jakut", label: "Jakarta Utara" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                selectedRegion === tab.id
                  ? "bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-900 shadow-sm font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Saturation Filter Chips & Threshold Slider */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter Saturasi:
            </span>
            <button
              onClick={() => {
                setSaturationFilter("ALL");
                setHighlightOnlySaturated(false);
              }}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                saturationFilter === "ALL" && !highlightOnlySaturated
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Semua ({facilities.length})
            </button>
            <button
              onClick={() => {
                setSaturationFilter("CRITICAL");
                setHighlightOnlySaturated(true);
              }}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                saturationFilter === "CRITICAL"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              Saturasi Kritis ≥80% ({stats.critical})
            </button>
            <button
              onClick={() => {
                setSaturationFilter("WARNING");
                setHighlightOnlySaturated(false);
              }}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                saturationFilter === "WARNING"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              }`}
            >
              Waspada 60-79% ({stats.warning})
            </button>
            <button
              onClick={() => {
                setSaturationFilter("SAFE");
                setHighlightOnlySaturated(false);
              }}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                saturationFilter === "SAFE"
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              }`}
            >
              Aman &lt;60% ({stats.safe})
            </button>
          </div>

          {/* Interactive Threshold Slider */}
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              Ambang Batas Sorot:
            </span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs min-w-[2.5rem]">
              ≥ {thresholdCutoff}%
            </span>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={thresholdCutoff}
              onChange={(e) => {
                setThresholdCutoff(parseInt(e.target.value));
                setHighlightOnlySaturated(true);
              }}
              className="w-24 sm:w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Main Map Canvas and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Vector Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
            {/* Map Top Floating Controls */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 text-white shadow-lg">
              <button
                onClick={() => setShowDensityHeatmap(!showDensityHeatmap)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                  showDensityHeatmap ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
                title="Tampilkan lapisan kepadatan timbulan sampah"
              >
                <Flame className="w-3 h-3" />
                Densitas Panas
              </button>
              <button
                onClick={() => setShowWaterways(!showWaterways)}
                className={`px-2 py-1 rounded-lg text-[10px] transition ${
                  showWaterways ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
                }`}
                title="Tampilkan Sungai Ciliwung & Banjir Kanal"
              >
                Sungai/Kanal
              </button>
              <button
                onClick={() => setShowCorridors(!showCorridors)}
                className={`px-2 py-1 rounded-lg text-[10px] transition ${
                  showCorridors ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-400 hover:text-white"
                }`}
                title="Tampilkan koridor arteri & tol lingkar luar"
              >
                Jalan Arteri
              </button>
            </div>

            {/* Map Top Right Zoom Controls */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 text-white shadow-lg">
              <button
                onClick={() => handleZoom(1.2)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
                title="Perbesar Peta"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(0.8)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
                title="Perkecil Peta"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
                title="Reset Posisi & Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive SVG Canvas */}
            <svg
              ref={svgRef}
              viewBox="0 0 900 640"
              className="w-full h-[440px] sm:h-[500px] select-none cursor-grab active:cursor-grabbing bg-slate-950"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <defs>
                {/* Coastal Sea Gradient at top */}
                <linearGradient id="sea-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#082f49" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
                </linearGradient>

                {/* Heatmap blur filter */}
                <filter id="heat-blur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="18" />
                </filter>

                {/* Hotspot High Density Gradient */}
                <radialGradient id="hotspot-high">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>

                {/* Hotspot Medium Density Gradient */}
                <radialGradient id="hotspot-med">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#eab308" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>

                {/* Glowing Marker Filters */}
                <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.8" />
                </filter>
                <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10b981" floodOpacity="0.7" />
                </filter>
              </defs>

              {/* Transformable Canvas Container for Pan & Zoom */}
              <g
                transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
                transform-origin="450 320"
              >
                {/* 1. Sea Water Basin at the top (Teluk Jakarta) */}
                <path
                  d="M 0,0 L 900,0 L 900,140 C 750,110 600,80 450,85 C 300,90 150,120 0,130 Z"
                  fill="url(#sea-gradient)"
                />
                <text x="450" y="50" textAnchor="middle" fill="#38bdf8" opacity="0.35" fontSize="12" fontWeight="700" letterSpacing="4">
                  TELUK JAKARTA (LAUT JAWA)
                </text>

                {/* 2. Municipal Boundaries (DKI Jakarta 5 Kotamadya) */}
                <g id="municipalities-layer">
                  {DKI_MUNICIPALITIES.map((mun) => {
                    const isSelected = selectedRegion === mun.id;
                    return (
                      <g key={mun.id} className="transition-all duration-300">
                        <path
                          d={mun.path}
                          fill={mun.color}
                          fillOpacity={isSelected ? 0.22 : 0.08}
                          stroke={mun.color}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          strokeDasharray={isSelected ? "none" : "3,3"}
                          className="hover:fill-opacity-20 cursor-pointer transition-all"
                          onClick={() => setSelectedRegion(mun.id)}
                        />
                        {showDistrictLabels && (
                          <g pointerEvents="none">
                            <text
                              x={mun.labelX}
                              y={mun.labelY}
                              textAnchor="middle"
                              fill="#94a3b8"
                              fontSize="11"
                              fontWeight="700"
                              letterSpacing="1"
                              opacity={isSelected ? 1 : 0.65}
                            >
                              {mun.name.toUpperCase()}
                            </text>
                            <text
                              x={mun.labelX}
                              y={mun.labelY + 14}
                              textAnchor="middle"
                              fill="#64748b"
                              fontSize="9"
                              opacity="0.8"
                            >
                              Avg Sat: {mun.avgSaturation}%
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 3. Waterways (Sungai Ciliwung, BKT, BKB) */}
                {showWaterways && (
                  <g id="waterways-layer" pointerEvents="none">
                    {DKI_MAP_WATERWAYS.map((water) => (
                      <path
                        key={water.id}
                        d={water.d}
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="2.5"
                        strokeOpacity="0.45"
                        strokeLinecap="round"
                      />
                    ))}
                  </g>
                )}

                {/* 4. Major Roads / Corridors */}
                {showCorridors && (
                  <g id="corridors-layer" pointerEvents="none">
                    {DKI_MAJOR_CORRIDORS.map((road) => (
                      <path
                        key={road.id}
                        d={road.d}
                        fill="none"
                        stroke={road.isToll ? "#a855f7" : "#475569"}
                        strokeWidth={road.isToll ? 2 : 1.5}
                        strokeDasharray={road.isToll ? "6,3" : "none"}
                        strokeOpacity={road.isToll ? 0.55 : 0.35}
                      />
                    ))}
                  </g>
                )}

                {/* 5. Waste Generation Density Heatmap Layer */}
                {showDensityHeatmap && (
                  <g id="waste-density-heatmap-layer" pointerEvents="none">
                    {DKI_WASTE_DENSITY_HOTSPOTS.map((hotspot) => {
                      const radius = hotspot.avgKgPerDay / 110;
                      const isHigh = hotspot.urgency === "HIGH";
                      return (
                        <g key={hotspot.id} filter="url(#heat-blur)">
                          <circle
                            cx={hotspot.x}
                            cy={hotspot.y}
                            r={radius}
                            fill={isHigh ? "url(#hotspot-high)" : "url(#hotspot-med)"}
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 6. Active Dynamic Reroute / Load-Balancing Flow Line */}
                {activeRerouteLine && (
                  <g id="dynamic-reroute-path">
                    <defs>
                      <marker
                        id="arrowhead-flow"
                        markerWidth="8"
                        markerHeight="8"
                        refX="6"
                        refY="4"
                        orient="auto"
                      >
                        <polygon points="0 0, 8 4, 0 8" fill="#10b981" />
                      </marker>
                    </defs>
                    {/* Pulsing connection line */}
                    <path
                      d={`M ${activeRerouteLine.from.x},${activeRerouteLine.from.y} Q ${
                        (activeRerouteLine.from.x + activeRerouteLine.to.x) / 2 + 20
                      },${(activeRerouteLine.from.y + activeRerouteLine.to.y) / 2 - 30} ${
                        activeRerouteLine.to.x
                      },${activeRerouteLine.to.y}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      className="animate-pulse"
                      markerEnd="url(#arrowhead-flow)"
                    />
                    {/* Tonnage transfer pill */}
                    <g
                      transform={`translate(${
                        (activeRerouteLine.from.x + activeRerouteLine.to.x) / 2
                      }, ${(activeRerouteLine.from.y + activeRerouteLine.to.y) / 2 - 25})`}
                    >
                      <rect
                        x="-50"
                        y="-12"
                        width="100"
                        height="24"
                        rx="12"
                        fill="#064e3b"
                        stroke="#10b981"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ecfdf5"
                        fontSize="10"
                        fontWeight="700"
                      >
                        -{activeRerouteLine.tonnage} Ton Reroute
                      </text>
                    </g>
                  </g>
                )}

                {/* 7. Facilities Layer (TPS3R Markers & High-Saturation Highlights) */}
                <g id="facilities-nodes-layer">
                  {filteredFacilities.map((fac) => {
                    const isSelected = selectedFacility?.id === fac.id;
                    const isCritical = fac.capacityPercent >= 80;
                    const isWarning = fac.capacityPercent >= 60 && fac.capacityPercent < 80;

                    // Color assignment based on saturation
                    const color = isCritical
                      ? "#f43f5e" // Rose/Red for high saturation
                      : isWarning
                      ? "#f59e0b" // Amber
                      : "#10b981"; // Emerald

                    return (
                      <g
                        key={fac.id}
                        transform={`translate(${fac.x}, ${fac.y})`}
                        onClick={() => {
                          setSelectedFacility(fac);
                          if (onFacilitySelect) onFacilitySelect(fac);
                        }}
                        className="cursor-pointer transition-transform duration-200"
                      >
                        {/* High Saturation Pulsing Radar Beacon */}
                        {isCritical && (
                          <g className="animate-ping" style={{ transformOrigin: "0px 0px" }}>
                            <circle
                              cx="0"
                              cy="0"
                              r="22"
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="2"
                              strokeOpacity="0.7"
                            />
                            <circle
                              cx="0"
                              cy="0"
                              r="15"
                              fill="#f43f5e"
                              fillOpacity="0.25"
                            />
                          </g>
                        )}

                        {/* Selected halo */}
                        {isSelected && (
                          <circle
                            cx="0"
                            cy="0"
                            r="20"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2.5"
                            strokeDasharray="4,2"
                          />
                        )}

                        {/* Outer circular badge */}
                        <circle
                          cx="0"
                          cy="0"
                          r="12"
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="2"
                          filter={isCritical ? "url(#glow-red)" : "url(#glow-emerald)"}
                        />

                        {/* Inner symbol / icon placeholder */}
                        <circle cx="0" cy="0" r="5" fill="#0f172a" />

                        {/* Saturation percentage label pill */}
                        <g transform="translate(0, -18)">
                          <rect
                            x="-18"
                            y="-9"
                            width="36"
                            height="15"
                            rx="7.5"
                            fill={isCritical ? "#e11d48" : isWarning ? "#d97706" : "#059669"}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="2.5"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="800"
                          >
                            {fac.capacityPercent}%
                          </text>
                        </g>

                        {/* Facility Name label */}
                        <text
                          x="0"
                          y="22"
                          textAnchor="middle"
                          fill={isSelected ? "#38bdf8" : "#e2e8f0"}
                          fontSize="9.5"
                          fontWeight={isSelected || isCritical ? "700" : "500"}
                          className="drop-shadow-md"
                        >
                          {fac.name.replace("TPS3R ", "")}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>

            {/* Map Bottom Legend */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-slate-400">Legenda:</span>
                <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                  Saturasi Tinggi (≥80%)
                </span>
                <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  Waspada (60-79%)
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Aman (&lt;60%)
                </span>
              </div>
              <div className="text-slate-400 text-[10px]">
                Klik titik TPS3R untuk membuka instrumen inspeksi dan kontrol dispatch armada
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Facility Telemetry & Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedFacility ? (
            <div
              id="selected-tps3r-inspector-card"
              className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                selectedFacility.capacityPercent >= 80
                  ? isDarkMode
                    ? "bg-rose-950/25 border-rose-800/60 text-slate-100"
                    : "bg-rose-50/70 border-rose-200 text-slate-900"
                  : cardBase
              }`}
            >
              {/* Facility Header */}
              <div className="flex items-start justify-between gap-2 border-b pb-3 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {selectedFacility.regionName}
                    </span>
                    {selectedFacility.verifiedByDlh && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        DLH Terverifikasi
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base mt-1 text-slate-900 dark:text-slate-100">
                    {selectedFacility.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedFacility.address}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    selectedFacility.capacityPercent >= 80
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <Building className="w-4 h-4" />
                </div>
              </div>

              {/* Saturation Gauge & Progress */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Saturasi Penampungan Sampah
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-black ${
                        selectedFacility.capacityPercent >= 80
                          ? "text-rose-600 dark:text-rose-400"
                          : selectedFacility.capacityPercent >= 60
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {selectedFacility.capacityPercent}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {selectedFacility.capacityPercent >= 80
                        ? "KRITIS"
                        : selectedFacility.capacityPercent >= 60
                        ? "WASPADA"
                        : "AMAN"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedFacility.capacityPercent >= 80
                        ? "bg-rose-500"
                        : selectedFacility.capacityPercent >= 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${selectedFacility.capacityPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Intake: {selectedFacility.currentIntakeTons} Ton/Hari</span>
                  <span>Kapasitas Maks: {selectedFacility.dailyCapacityTons} Ton/Hari</span>
                </div>

                {/* Headroom warning alert if high saturation */}
                {selectedFacility.capacityPercent >= 80 && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sisa Ruang Kapasitas: Hanya {(selectedFacility.dailyCapacityTons - selectedFacility.currentIntakeTons).toFixed(2)} Ton!</span>
                    </div>
                    <p className="text-[10px] leading-relaxed">
                      Fasilitas ini membutuhkan dispatch armada penyeimbang untuk mengalihkan sebagian sampah ke TPS3R lain sebelum penumpukan berlebih.
                    </p>
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-medium">Unit BSF Maggot</div>
                  <div className="font-bold text-sm mt-0.5 text-slate-800 dark:text-slate-100">
                    {selectedFacility.bsfMaggotUnits} Reaktor
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-medium">Rotary Composter</div>
                  <div className="font-bold text-sm mt-0.5 text-slate-800 dark:text-slate-100">
                    {selectedFacility.rotaryComposters} Drum
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-medium">Armada Terhubung</div>
                  <div className="font-bold text-sm mt-0.5 text-slate-800 dark:text-slate-100">
                    {selectedFacility.activeCollectionTrucks} Kendaraan
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-medium">Update Terakhir</div>
                  <div className="font-semibold text-xs mt-0.5 text-emerald-600 dark:text-emerald-400 truncate">
                    {selectedFacility.lastTelemetryUpdate}
                  </div>
                </div>
              </div>

              {/* Accepted Streams */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Aliran Sampah Terproses:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedFacility.accepts.map((stream, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {stream}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operational Metadata */}
              <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jam Operasional: {selectedFacility.operatingHours} ({selectedFacility.operatingDays})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Kontak Koordinator: {selectedFacility.contactPhone}</span>
                </div>
              </div>

              {/* Dispatch Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  id="dispatch-relief-fleet-btn"
                  onClick={() => handleDispatchRelief(selectedFacility)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                    selectedFacility.capacityPercent >= 80
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Dispatch Armada Penyeimbang Beban</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setDispatchNotice(
                        `Rute pengangkutan warga ke ${selectedFacility.name} berhasil disinkronkan ke seluruh aplikasi pemilah.`
                      );
                      setTimeout(() => setDispatchNotice(null), 4000);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    Sinkronkan Rute
                  </button>
                  <button
                    onClick={() => {
                      setDispatchNotice(
                        `Menghubungi koordinator lapangan ${selectedFacility.name} di ${selectedFacility.contactPhone}...`
                      );
                      setTimeout(() => setDispatchNotice(null), 4000);
                    }}
                    className="py-2 px-3 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                    title="Panggil koordinator via telepon"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border ${cardBase} text-center space-y-2 text-xs text-slate-400`}>
              <Info className="w-8 h-8 mx-auto text-slate-400" />
              <p>Pilih fasilitas TPS3R pada peta untuk melihat telemetri kapasitas dan tindakan dispatch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
