/**
 * MaggoCity - Smart BSF Maggot Circular Economy Platform Data
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 * Biokonversi Sampah Organik Menjadi Protein Mandiri & Pupuk Kasgot Hayati
 */

export interface MaggoHubNode {
  id: string;
  name: string;
  location: string;
  cityDistrict: "Jakarta Selatan" | "Jakarta Timur" | "Jakarta Barat" | "Jakarta Utara" | "Jakarta Pusat";
  coordinates: { lat: number; lng: number };
  establishedYear: number;
  communityLead: string;
  contactPerson: string;
  phone: string;
  capacityKgPerWeek: number;
  currentIntakeKgPerWeek: number;
  bioreactorsCount: number;
  activeBatchesCount: number;
  feedstockSources: string[];
  primaryOfftakers: string[];
  telemetry: {
    avgTemperatureC: number;
    avgMoisturePercent: number;
    substratePh: number;
    ammoniaPpm: number;
    aerationLevel: "Optimal" | "Perlu Peningkatan" | "Cukup";
    healthScorePercent: number;
  };
  monthlyOutputs: {
    freshMaggotKg: number;
    driedMaggotKg: number;
    kasgotFertilizerKg: number;
    chitinExtractKg: number;
  };
  monthlyRevenueIdr: number;
  co2eDivertedKg: number;
  status: "ACTIVE" | "MAINTENANCE" | "EXPANDING";
}

export interface BsfLifecycleBatch {
  id: string;
  batchCode: string;
  hubId: string;
  hubName: string;
  stage: "EGG_INCUBATION" | "5_DOL_NURSERY" | "VORACIOUS_FEEDING" | "PREPUPAE_HARVEST" | "IMAGO_BREEDING";
  stageLabel: string;
  daysInCycle: number;
  totalCycleDays: number;
  substrateKgInitial: number;
  substrateConsumedKg: number;
  estimatedYieldKg: number;
  temperatureC: number;
  humidityPercent: number;
  fcrRatio: number; // Feed Conversion Ratio (e.g. 4.8 kg waste : 1 kg maggot)
  substrateType: string;
  nextAction: string;
  harvestTargetDate: string;
  qualityGrade: "Super Grade A (45% Protein)" | "Grade B (Standar Pakan)" | "Grade Pupa Indukan";
}

export interface MaggoMarketplaceItem {
  id: string;
  title: string;
  category: "Pakan Segar" | "Pakan Kering Oven" | "Pupuk Kasgot" | "Bibit & Starter" | "Peralatan Reaktor";
  producerHub: string;
  location: string;
  priceIdr: number;
  unit: string;
  minimumOrder: number;
  inStockQuantity: number;
  proteinContent?: string;
  npkContent?: string;
  description: string;
  targetBuyers: string[];
  rating: number;
  soldCount: number;
  imageUrl?: string;
}

export interface FeedFormulaNutrient {
  name: string;
  proportionPercent: number;
  carbonNitrogenRatio: string;
  moisturePercent: number;
  proteinYieldImpact: "Sangat Tinggi" | "Tinggi" | "Sedang";
  notes: string;
}

export interface FeedFormulaPreset {
  id: string;
  name: string;
  bestFor: string;
  expectedBioconversionRate: string;
  fcr: number;
  ingredients: FeedFormulaNutrient[];
  instructions: string[];
}

export interface CommunityEmpowermentStory {
  id: string;
  groupName: string;
  kelurahan: string;
  city: string;
  membersCount: number;
  monthlyIncomeIncrementIdr: number;
  story: string;
  lelePondCount?: number;
  poultryCount?: number;
  badge: string;
}

// 6 Utama Hub Biokonversi Maggot BSF di 5 Wilayah DKI Jakarta
export const JAKARTA_MAGGO_HUBS: MaggoHubNode[] = [
  {
    id: "hub-pondok-labu",
    name: "Hub Biokonversi Maggot BSF Mandiri Pondok Labu",
    location: "Jl. Margasatwa No. 42, RT 06/RW 03, Pondok Labu, Cilandak",
    cityDistrict: "Jakarta Selatan",
    coordinates: { lat: -6.3152, lng: 106.7994 },
    establishedYear: 2022,
    communityLead: "Suryanto & KWT Cempaka Berseri",
    contactPerson: "Pak Suryanto (0812-9843-1120)",
    phone: "0812-9843-1120",
    capacityKgPerWeek: 12000,
    currentIntakeKgPerWeek: 10850,
    bioreactorsCount: 6,
    activeBatchesCount: 14,
    feedstockSources: ["Pasar Pondok Labu", "Katering Rumah Sakit Fatmawati", "8 RW Pilah Sampah Organik"],
    primaryOfftakers: ["Koperasi Pembudidaya Lele Ragunan", "Peternak Unggas Jagakarsa", "Taman Anggrek Ragunan"],
    telemetry: {
      avgTemperatureC: 30.4,
      avgMoisturePercent: 68.5,
      substratePh: 7.1,
      ammoniaPpm: 4.8,
      aerationLevel: "Optimal",
      healthScorePercent: 96,
    },
    monthlyOutputs: {
      freshMaggotKg: 8700,
      driedMaggotKg: 1250,
      kasgotFertilizerKg: 16400,
      chitinExtractKg: 42,
    },
    monthlyRevenueIdr: 48500000,
    co2eDivertedKg: 19800,
    status: "ACTIVE",
  },
  {
    id: "hub-kramat-jati",
    name: "Sentra Bio-Protein Pasar Induk Kramat Jati",
    location: "Kawasan Logistik Sampah Organik Blok B, Pasar Induk Kramat Jati",
    cityDistrict: "Jakarta Timur",
    coordinates: { lat: -6.2847, lng: 106.8716 },
    establishedYear: 2021,
    communityLead: "Koperasi Pedagang Hijau & Bank Sampah Induk",
    contactPerson: "Hj. Ratna Dewi (0813-8871-9902)",
    phone: "0813-8871-9902",
    capacityKgPerWeek: 28000,
    currentIntakeKgPerWeek: 26400,
    bioreactorsCount: 12,
    activeBatchesCount: 32,
    feedstockSources: ["Limbah Sayur & Buah Pasar Induk Kramat Jati", "Pasar Ciracas", "Kawasan Kuliner UKM Condet"],
    primaryOfftakers: ["Pabrik Pakan Apung Akuakultur Jabar", "Peternakan Puyuh Cibubur", "Pembibitan Tanaman Hias Cipayung"],
    telemetry: {
      avgTemperatureC: 31.2,
      avgMoisturePercent: 71.0,
      substratePh: 6.9,
      ammoniaPpm: 5.4,
      aerationLevel: "Optimal",
      healthScorePercent: 94,
    },
    monthlyOutputs: {
      freshMaggotKg: 21200,
      driedMaggotKg: 3800,
      kasgotFertilizerKg: 39500,
      chitinExtractKg: 110,
    },
    monthlyRevenueIdr: 118200000,
    co2eDivertedKg: 48900,
    status: "ACTIVE",
  },
  {
    id: "hub-tebet-eco",
    name: "Tebet Smart Eco-Maggot & Urban Agrotech",
    location: "Kawasan Edukasi Sirkular Tebet Timur Dalam Raya No. 18",
    cityDistrict: "Jakarta Selatan",
    coordinates: { lat: -6.2365, lng: 106.8528 },
    establishedYear: 2023,
    communityLead: "Faris Maulana & Karang Taruna Tebet Bersatu",
    contactPerson: "Faris Maulana (0818-0922-3411)",
    phone: "0818-0922-3411",
    capacityKgPerWeek: 6500,
    currentIntakeKgPerWeek: 5800,
    bioreactorsCount: 4,
    activeBatchesCount: 8,
    feedstockSources: ["Kafe & Restoran Tebet", "Food Court Tebet Eco Park", "Kompos Komunal 4 Kelurahan"],
    primaryOfftakers: ["Urban Farming Komunitas Tebet", "Pusat Riset Agrotek UI/IPB", "Penghobi Burung Kicau Jaksel"],
    telemetry: {
      avgTemperatureC: 29.8,
      avgMoisturePercent: 67.2,
      substratePh: 7.3,
      ammoniaPpm: 3.9,
      aerationLevel: "Optimal",
      healthScorePercent: 98,
    },
    monthlyOutputs: {
      freshMaggotKg: 4600,
      driedMaggotKg: 850,
      kasgotFertilizerKg: 8900,
      chitinExtractKg: 28,
    },
    monthlyRevenueIdr: 32400000,
    co2eDivertedKg: 11200,
    status: "ACTIVE",
  },
  {
    id: "hub-cengkareng-rawabuaya",
    name: "Cengkareng Bio-Circular Feed & Protein Lab",
    location: "Jl. Dharma Wanita IV, RT 02/RW 01, Rawa Buaya, Cengkareng",
    cityDistrict: "Jakarta Barat",
    coordinates: { lat: -6.1558, lng: 106.7212 },
    establishedYear: 2023,
    communityLead: "Bambang Triatmojo (Forum Warga Mandiri)",
    contactPerson: "Bambang Tri (0856-7788-1290)",
    phone: "0856-7788-1290",
    capacityKgPerWeek: 18000,
    currentIntakeKgPerWeek: 15900,
    bioreactorsCount: 8,
    activeBatchesCount: 22,
    feedstockSources: ["Pasar Ganefo Cengkareng", "Industri Pengolahan Tahu Tempe Rawa Buaya", "Sisa Dapur Rusunawa"],
    primaryOfftakers: ["Kelompok Pembudidaya Ikan (Pokdakan) Kalideres", "Peternak Ayam Kampung Kembangan"],
    telemetry: {
      avgTemperatureC: 30.8,
      avgMoisturePercent: 69.8,
      substratePh: 7.0,
      ammoniaPpm: 6.2,
      aerationLevel: "Optimal",
      healthScorePercent: 92,
    },
    monthlyOutputs: {
      freshMaggotKg: 12800,
      driedMaggotKg: 2100,
      kasgotFertilizerKg: 23800,
      chitinExtractKg: 65,
    },
    monthlyRevenueIdr: 72600000,
    co2eDivertedKg: 29600,
    status: "ACTIVE",
  },
  {
    id: "hub-muara-baru",
    name: "Muara Baru Maritim Bio-Feed Converter",
    location: "Kompleks Pelabuhan Perikanan Samudera Nizam Zachman",
    cityDistrict: "Jakarta Utara",
    coordinates: { lat: -6.1122, lng: 106.8048 },
    establishedYear: 2024,
    communityLead: "Kapten Rusdi Effendi & Paguyuban Nelayan Pantura",
    contactPerson: "Rusdi Effendi (0812-4411-9087)",
    phone: "0812-4411-9087",
    capacityKgPerWeek: 15000,
    currentIntakeKgPerWeek: 13400,
    bioreactorsCount: 7,
    activeBatchesCount: 18,
    feedstockSources: ["Limbah Organik Pelelangan Ikan", "Pasar Ikan Muara Baru", "Restoran Seafood Penjaringan"],
    primaryOfftakers: ["Tambak Ikan Bandeng Marunda & Muara Gembong", "Suplemen Pakan Kerapu Teluk Jakarta"],
    telemetry: {
      avgTemperatureC: 31.5,
      avgMoisturePercent: 72.4,
      substratePh: 6.8,
      ammoniaPpm: 6.8,
      aerationLevel: "Perlu Peningkatan",
      healthScorePercent: 89,
    },
    monthlyOutputs: {
      freshMaggotKg: 10900,
      driedMaggotKg: 1750,
      kasgotFertilizerKg: 19800,
      chitinExtractKg: 55,
    },
    monthlyRevenueIdr: 63100000,
    co2eDivertedKg: 24700,
    status: "EXPANDING",
  },
  {
    id: "hub-johar-baru",
    name: "Johar Baru Padat Karya Urban Maggot Micro-Unit",
    location: "Jl. Johar Baru V No. 29, Tanah Tinggi, Johar Baru",
    cityDistrict: "Jakarta Pusat",
    coordinates: { lat: -6.1852, lng: 106.8584 },
    establishedYear: 2024,
    communityLead: "Mbak Anisa Utami (KWT Melati Indah RW 04)",
    contactPerson: "Anisa Utami (0877-3321-8899)",
    phone: "0877-3321-8899",
    capacityKgPerWeek: 4200,
    currentIntakeKgPerWeek: 3950,
    bioreactorsCount: 3,
    activeBatchesCount: 6,
    feedstockSources: ["Bank Sampah Warga RW 01-05", "Pasar Johar Baru", "Warung Tegal & Nasi Padang Lokal"],
    primaryOfftakers: ["Komunitas Budidaya Lele Kolam Terpal Warga", "Penjual Pupuk Kasgot Pot Kemasan 1Kg"],
    telemetry: {
      avgTemperatureC: 30.1,
      avgMoisturePercent: 67.8,
      substratePh: 7.2,
      ammoniaPpm: 4.1,
      aerationLevel: "Optimal",
      healthScorePercent: 97,
    },
    monthlyOutputs: {
      freshMaggotKg: 3150,
      driedMaggotKg: 520,
      kasgotFertilizerKg: 5800,
      chitinExtractKg: 18,
    },
    monthlyRevenueIdr: 21500000,
    co2eDivertedKg: 7400,
    status: "ACTIVE",
  },
];

// Active Lifecycle Batches in Jakarta Bioreactors
export const ACTIVE_BSF_BATCHES: BsfLifecycleBatch[] = [
  {
    id: "batch-pl-2026-042",
    batchCode: "PL-042-SUPER",
    hubId: "hub-pondok-labu",
    hubName: "Hub Pondok Labu",
    stage: "VORACIOUS_FEEDING",
    stageLabel: "Biokonversi Aktif (Fase Rakus)",
    daysInCycle: 13,
    totalCycleDays: 21,
    substrateKgInitial: 2400,
    substrateConsumedKg: 1850,
    estimatedYieldKg: 490,
    temperatureC: 30.5,
    humidityPercent: 69,
    fcrRatio: 4.9,
    substrateType: "Sisa Nasi Restoran + Limbah Sayuran Hijau (Rasio 40:60)",
    nextAction: "Pemberian Pakan Terakhir sebelum Migrasi Self-Harvest (18 Jam ke Depan)",
    harvestTargetDate: "3 Hari lagi (30 Okt 2026)",
    qualityGrade: "Super Grade A (45% Protein)",
  },
  {
    id: "batch-kj-2026-108",
    batchCode: "KJ-108-MEGA",
    hubId: "hub-kramat-jati",
    hubName: "Sentra Pasar Induk Kramat Jati",
    stage: "PREPUPAE_HARVEST",
    stageLabel: "Panen Prepupa & Pemisahan Otomatis",
    daysInCycle: 19,
    totalCycleDays: 20,
    substrateKgInitial: 4800,
    substrateConsumedKg: 4620,
    estimatedYieldKg: 1040,
    temperatureC: 31.0,
    humidityPercent: 66,
    fcrRatio: 4.6,
    substrateType: "Limbah Pepaya & Semangka Pasar Induk + Ampas Tahu Rawa Buaya",
    nextAction: "Pengaktifan Ramp Migrasi Mandiri & Sortir Ukuran Mesh 3mm",
    harvestTargetDate: "Hari Ini (27 Okt 2026)",
    qualityGrade: "Super Grade A (45% Protein)",
  },
  {
    id: "batch-tb-2026-015",
    batchCode: "TB-015-URBAN",
    hubId: "hub-tebet-eco",
    hubName: "Tebet Smart Eco-Maggot",
    stage: "5_DOL_NURSERY",
    stageLabel: "Pembesaran Larva Dini (5-DOL)",
    daysInCycle: 6,
    totalCycleDays: 20,
    substrateKgInitial: 800,
    substrateConsumedKg: 240,
    estimatedYieldKg: 165,
    temperatureC: 29.9,
    humidityPercent: 72,
    fcrRatio: 4.8,
    substrateType: "Bubur Sayur Halus + Bekatul Fermentasi EM4",
    nextAction: "Pemindahan ke Reaktor Biokonversi Utama Blok 2",
    harvestTargetDate: "14 Hari lagi (10 Nov 2026)",
    qualityGrade: "Grade B (Standar Pakan)",
  },
  {
    id: "batch-ck-2026-088",
    batchCode: "CK-088-PROTEIN",
    hubId: "hub-cengkareng-rawabuaya",
    hubName: "Cengkareng Bio-Circular",
    stage: "VORACIOUS_FEEDING",
    stageLabel: "Biokonversi Aktif (Fase Rakus)",
    daysInCycle: 11,
    totalCycleDays: 21,
    substrateKgInitial: 3200,
    substrateConsumedKg: 2100,
    estimatedYieldKg: 680,
    temperatureC: 30.7,
    humidityPercent: 70,
    fcrRatio: 4.7,
    substrateType: "Limbah Dapur Rusunawa + Sayuran Pasar Ganefo",
    nextAction: "Pengecekan Kelembapan Substrat & Pengadukan Manual Aerasi",
    harvestTargetDate: "9 Hari lagi (05 Nov 2026)",
    qualityGrade: "Super Grade A (45% Protein)",
  },
  {
    id: "batch-jb-2026-009",
    batchCode: "JB-009-COMMUNITY",
    hubId: "hub-johar-baru",
    hubName: "Johar Baru Padat Karya",
    stage: "IMAGO_BREEDING",
    stageLabel: "Love Cage & Pembibitan Indukan BSF",
    daysInCycle: 25,
    totalCycleDays: 30,
    substrateKgInitial: 350,
    substrateConsumedKg: 350,
    estimatedYieldKg: 75,
    temperatureC: 30.2,
    humidityPercent: 68,
    fcrRatio: 4.7,
    substrateType: "Substrat Khusus Indukan (Pupa Terpilih)",
    nextAction: "Pemanenan Kluster Telur di Plank Kayu Pinus untuk Inkubasi",
    harvestTargetDate: "Siklus Bertelur Aktif",
    qualityGrade: "Grade Pupa Indukan",
  },
];

// Circular Marketplace Listings for BSF Products in Jakarta
export const MAGGO_MARKETPLACE_LISTINGS: MaggoMarketplaceItem[] = [
  {
    id: "prod-fresh-larvae",
    title: "Maggot BSF Segar Hidup Super (Pakan Lele, Nila & Arwana)",
    category: "Pakan Segar",
    producerHub: "Hub Pondok Labu (Jakarta Selatan)",
    location: "Pondok Labu, Cilandak",
    priceIdr: 8000,
    unit: "Kg",
    minimumOrder: 5,
    inStockQuantity: 1450,
    proteinContent: "42% - 44% Protein Alami & Asam Amino Esensial",
    description: "Larva BSF segar siap pakan berprotein tinggi, aktif bergerak, meningkatkan nafsu makan ikan dan mempercepat pembesaran tanpa mencemari kolam.",
    targetBuyers: ["Pembudidaya Lele", "Peternak Ikan Nila", "Penghobi Ikan Predator/Arwana"],
    rating: 4.9,
    soldCount: 3840,
  },
  {
    id: "prod-dried-maggot",
    title: "Dried Maggot BSF Oven Super Crispy (Premium Feed Unggas & Kicau)",
    category: "Pakan Kering Oven",
    producerHub: "Sentra Pasar Induk Kramat Jati",
    location: "Kramat Jati, Jakarta Timur",
    priceIdr: 55000,
    unit: "Kg (Kemasan Kedap Udara)",
    minimumOrder: 1,
    inStockQuantity: 420,
    proteinContent: "45.5% Crude Protein, 28% Fat, Kaya Asam Laurat",
    description: "Maggot BSF kering higienis dipanggang suhu 70°C stabil, renyah, tahan simpan 12 bulan. Booster pembentukan telur ayam, bulu burung kicau, & daya tahan ternak.",
    targetBuyers: ["Peternak Ayam Petelur & Unggas", "Komunitas Burung Kicau Jabodetabek", "Pemilik Sugar Glider/Reptil"],
    rating: 4.95,
    soldCount: 1680,
  },
  {
    id: "prod-kasgot-granul",
    title: "Kasgot Hayati Super Organik (Frass Pupuk NPK Alami + Kitin)",
    category: "Pupuk Kasgot",
    producerHub: "Tebet Smart Eco-Maggot",
    location: "Tebet, Jakarta Selatan",
    priceIdr: 4000,
    unit: "Kg (Tersedia Karung 25Kg Rp 85.000)",
    minimumOrder: 5,
    inStockQuantity: 3200,
    npkContent: "N: 3.2%, P2O5: 4.1%, K2O: 2.8%, C-Organik: 34%, Kaya Senyawa Kitin Alami",
    description: "Residu dekomposisi maggot (bekas maggot / frass) terfermentasi sempurna tanpa bau. Meningkatkan imunitas perakaran tanaman, anti-jamur Fusarium, dan mempercepat pembungaan.",
    targetBuyers: ["Penggiat Urban Farming Jakarta", "Kolektor Aglonema & Tanaman Hias", "Kelompok Wanita Tani (KWT)"],
    rating: 4.88,
    soldCount: 5210,
  },
  {
    id: "prod-starter-eggs",
    title: "Kluster Telur BSF Super Viabel + Starter Box 5-DOL",
    category: "Bibit & Starter",
    producerHub: "Cengkareng Bio-Circular Hub",
    location: "Rawa Buaya, Jakarta Barat",
    priceIdr: 25000,
    unit: "Gram (1 gram = ~35.000 bibit larva)",
    minimumOrder: 5,
    inStockQuantity: 85,
    description: "Telur BSF bibit galur unggul toleran iklim tropis perkotaan Jakarta. Daya tetas >92%, dilengkapi media attractant organik ramah lingkungan dan panduan tetas 4 hari.",
    targetBuyers: ["Warga Perintis Budidaya Maggot RW", "Sekolah Adiwiyata", "Pegiat Zero-Waste Komunitas"],
    rating: 4.92,
    soldCount: 460,
  },
  {
    id: "prod-maggobox-rw",
    title: "MaggoBox Komunal RW - Reaktor Biokonversi Anti-Bau Otomatis",
    category: "Peralatan Reaktor",
    producerHub: "Johar Baru Padat Karya Unit",
    location: "Johar Baru, Jakarta Pusat",
    priceIdr: 1250000,
    unit: "Unit Lengkap (Kapasitas 30kg Sampah/Minggu)",
    minimumOrder: 1,
    inStockQuantity: 18,
    description: "Inovasi reaktor biokonversi modular untuk pemukiman padat. Dilengkapi saringan lindi bawah tanah, ventilasi kasa anti-escape, dan ramp migrasi prepupa self-harvesting tanpa disentuh tangan.",
    targetBuyers: ["Pengurus RW DKI Jakarta", "Restoran/Kafe Peduli Lingkungan", "Kantor Swasta Ramah Lingkungan"],
    rating: 4.97,
    soldCount: 94,
  },
];

// Preset Formulasi Nutrisi & Pakan AI untuk Larva BSF Maksimal
export const FEED_FORMULA_PRESETS: FeedFormulaPreset[] = [
  {
    id: "formula-high-protein",
    name: "Formulasi Pakan Booster Protein Tinggi (Target Pakan Lele & Unggas)",
    bestFor: "Larva siap panen untuk pakan ikan lele, nila, & unggas petelur",
    expectedBioconversionRate: "22% - 24% dari berat basah pakan",
    fcr: 4.3,
    ingredients: [
      {
        name: "Limbah Sisa Nasi & Karbohidrat Dapur",
        proportionPercent: 30,
        carbonNitrogenRatio: "35:1",
        moisturePercent: 65,
        proteinYieldImpact: "Tinggi",
        notes: "Menyediakan sumber energi kalori instan untuk pertumbuhan larva cepat.",
      },
      {
        name: "Ampas Tahu / Limbah Pabrik Kedelai",
        proportionPercent: 35,
        carbonNitrogenRatio: "12:1",
        moisturePercent: 75,
        proteinYieldImpact: "Sangat Tinggi",
        notes: "Kaya protein nabati dan asam amino pembentuk biomassa tebal.",
      },
      {
        name: "Sayuran Hijau Pasar (Sawi, Bayam, Kubis)",
        proportionPercent: 25,
        carbonNitrogenRatio: "18:1",
        moisturePercent: 88,
        proteinYieldImpact: "Sedang",
        notes: "Menjaga kadar air alami dan menyediakan mikronutrien mineral.",
      },
      {
        name: "Limbah Buah Non-Asam (Pepaya, Melon, Pisang)",
        proportionPercent: 10,
        carbonNitrogenRatio: "45:1",
        moisturePercent: 85,
        proteinYieldImpact: "Tinggi",
        notes: "Mengandung enzim alami pengurai serat untuk pencernaan larva.",
      },
    ],
    instructions: [
      "Campurkan seluruh bahan dan giling/cacah kasar hingga ukuran partikel < 5mm.",
      "Peras atau tambahkan bekatul jika kadar air > 75% untuk mencegah kondisi anaerobik berbau.",
      "Tebarkan tipis secara berkala 2 hari sekali pada bioreaktor pembesaran larva.",
    ],
  },
  {
    id: "formula-market-bulk",
    name: "Formulasi Limbah Pasar Induk (Sayur-Buah Ekonomis Massal)",
    bestFor: "Pengolahan sampah organik skala masif TPS3R & Pasar Tradisional",
    expectedBioconversionRate: "18% - 20% dari berat basah sampah",
    fcr: 5.1,
    ingredients: [
      {
        name: "Limbah Sayuran Kol & Sawi Hijau Pasar",
        proportionPercent: 45,
        carbonNitrogenRatio: "19:1",
        moisturePercent: 90,
        proteinYieldImpact: "Sedang",
        notes: "Timbulan terbanyak di pasar, memerlukan aerasi baik.",
      },
      {
        name: "Limbah Buah Manis (Kulit Pisang, Semangka, Pepaya)",
        proportionPercent: 35,
        carbonNitrogenRatio: "40:1",
        moisturePercent: 85,
        proteinYieldImpact: "Sedang",
        notes: "Disukai maggot, hindari buah citrus/jeruk berlebih karena asam.",
      },
      {
        name: "Bekatul / Dedak Padi Kering (Absorber Kelembapan)",
        proportionPercent: 20,
        carbonNitrogenRatio: "25:1",
        moisturePercent: 12,
        proteinYieldImpact: "Tinggi",
        notes: "Menyerap kelebihan air lindi dan menyuplai vitamin B kompleks.",
      },
    ],
    instructions: [
      "Sortir dan buang plastik serta buah busuk yang terlalu asam (jeruk/lemon).",
      "Gunakan bio-chopper mesin pencacah untuk melumatkan serat sayuran.",
      "Biarkan aerasi terbuka 2 jam sebelum ditebarkan ke biopond.",
    ],
  },
  {
    id: "formula-kasgot-booster",
    name: "Formulasi Khusus Kasgot Organik Super (Target Pupuk Premium)",
    bestFor: "Menghasilkan pupuk hayati dengan rasio C/N optimal dan kitin tinggi",
    expectedBioconversionRate: "19% larva + 45% Kasgot Pupuk Kering",
    fcr: 4.8,
    ingredients: [
      {
        name: "Limbah Daun & Pangkasan Tanaman Kota",
        proportionPercent: 25,
        carbonNitrogenRatio: "60:1",
        moisturePercent: 40,
        proteinYieldImpact: "Sedang",
        notes: "Sumber lignoselulosa alami yang diurai bersama feses maggot.",
      },
      {
        name: "Sisa Dapur & Kulit Telur Halus",
        proportionPercent: 30,
        carbonNitrogenRatio: "15:1",
        moisturePercent: 60,
        proteinYieldImpact: "Tinggi",
        notes: "Kulit telur menyuplai kalsium alami (CaCO3) peningkat pH tanah.",
      },
      {
        name: "Ampas Kopi & Sisa Teh Kafe Jakarta",
        proportionPercent: 20,
        carbonNitrogenRatio: "20:1",
        moisturePercent: 50,
        proteinYieldImpact: "Sedang",
        notes: "Mengandung mineral nitrogen slow-release dan aroma penawar bau.",
      },
      {
        name: "Limbah Sayuran & Buah Campur",
        proportionPercent: 25,
        carbonNitrogenRatio: "25:1",
        moisturePercent: 80,
        proteinYieldImpact: "Tinggi",
        notes: "Mempertahankan kelembapan ideal kerja mikroba pendamping.",
      },
    ],
    instructions: [
      "Pastikan kulit telur ditumbuk halus sebelum dicampurkan.",
      "Setelah fase prepupa bermigrasi, ayak residu kasgot menggunakan saringan mesh 4mm.",
      "Angin-anginkan kasgot 24 jam untuk menurunkan kelembapan menjadi < 15% sebelum dikemas.",
    ],
  },
];

// Kisah Pemberdayaan Warga & Dampak Nyata di DKI Jakarta
export const COMMUNITY_EMPOWERMENT_STORIES: CommunityEmpowermentStory[] = [
  {
    id: "story-1",
    groupName: "KWT Cempaka Berseri (Ibu-Ibu RW 03 Pondok Labu)",
    kelurahan: "Pondok Labu",
    city: "Jakarta Selatan",
    membersCount: 24,
    monthlyIncomeIncrementIdr: 4200000,
    story: "Mengolah 1,5 ton sampah sisa dapur bulanan warga menjadi Maggot segar untuk 6 kolam lele bioflok warga dan pupuk Kasgot untuk 200 polybag sayuran selada & cabai. Kini kas RT surplus dan warga tidak lagi bayar iuran kebersihan.",
    lelePondCount: 6,
    badge: "Pelopor Zero-Waste RW 2026",
  },
  {
    id: "story-2",
    groupName: "Karang Taruna Tebet Eco-Champions",
    kelurahan: "Tebet Timur",
    city: "Jakarta Selatan",
    membersCount: 18,
    monthlyIncomeIncrementIdr: 6800000,
    story: "Anak muda Karang Taruna mengoperasikan 4 bioreaktor pintar terintegrasi IoT sensor. Menjemput sisa makanan dari 14 kafe di Tebet Raya setiap malam, menghasilkan dried maggot kemasan pouch yang laris dijual ke pecinta burung kicau se-DKI.",
    poultryCount: 120,
    badge: "Inovator Agrotek Muda DKI",
  },
  {
    id: "story-3",
    groupName: "Pokdakan Tirta Mandiri Kalideres",
    kelurahan: "Kalideres",
    city: "Jakarta Barat",
    membersCount: 31,
    monthlyIncomeIncrementIdr: 8900000,
    story: "Mengganti 60% pakan pelet komersial pabrikan yang mahal dengan maggot BSF segar hasil olahan sampah pasar sayur Ganefo. FCR kolam lele turun dari 1.2 menjadi 0.85, margin keuntungan panen lele naik dua kali lipat.",
    lelePondCount: 18,
    badge: "Kemandirian Pakan Mandiri",
  },
];

// Metrik Agregat Ekosistem MaggoCity DKI Jakarta
export const MAGGOCITY_CITYWIDE_STATS = {
  totalOrganicWasteProcessedTonsMonthly: 462.8,
  totalFreshMaggotHarvestedKgMonthly: 61350,
  totalDriedMaggotProducedKgMonthly: 10270,
  totalKasgotFertilizerKgMonthly: 114200,
  totalCo2eEmissionsAvertedKgMonthly: 141600,
  totalEconomicCirculationIdrMonthly: 356800000,
  totalActiveCommunityMembers: 412,
  totalAquaculturePondsEmpowered: 148,
  totalUrbanFarmingPlotsNourished: 86,
  methaneAversionFactor: 0.32, // 1 kg organic waste in BSF saves 0.32 kg CO2e vs anaerobic open dumping
};

// ==========================================
// 4 PILAR BUDIDAYA MAGGOT CERDAS & BERDAYA
// ==========================================
export interface MaggotPillar {
  id: string;
  pillarNumber: number;
  title: string;
  subtitle: string;
  coreConcept: string;
  keyBenefits: string[];
  operationalProtocols: {
    title: string;
    description: string;
    parameters?: string;
  }[];
  practicalTips: string[];
  icon: string;
}

export const FOUR_PILLARS_BSF_DATA: MaggotPillar[] = [
  {
    id: "pilar-1-zero-cost-feed",
    pillarNumber: 1,
    title: "Manajemen Pakan Berdaya (Zero-Cost Feed)",
    subtitle: "Mengolah Limbah Organik Gratis Menjadi Komoditas Berprotein Tinggi",
    coreConcept: "Memanfaatkan limbah organik bebas biaya (sampah pasar sayur/buah, sisa katering/restoran, dan ampas tahu) dengan perlakuan fermentasi mikroorganisme (EM4 & molase) agar kaya nutrisi, cepat dicerna, dan 100% bebas bau busuk.",
    keyBenefits: [
      "Biaya pakan Rp0 (Zero-Cost Feed) memangkas pengeluaran pakan hingga 100%",
      "Fermentasi EM4 menaikkan kadar protein media dan menekan timbulan amonia <5 ppm",
      "Mencegah perkembangbiakan lalat hijau rumah (Musca domestica) pembawa bakteri",
      "Mempercepat waktu pembesaran larva dari 21 hari menjadi 14-16 hari"
    ],
    operationalProtocols: [
      {
        title: "Pemilahan & Pencacahan Bahan Baku",
        description: "Sampah pasar sayur, buah, sisa nasi/lauk katering dicacah menjadi partikel ukuran 0.5 - 1.5 cm agar mudah diserap mulut larva instar 3-5.",
        parameters: "Ukuran partikel: 5-15 mm"
      },
      {
        title: "Formula Fermentasi Mikroorganisme Aktif",
        description: "Campurkan larutan EM4 Pertanian/Peternakan + Tetes Tebu (Molase) + air bersih, disemprotkan merata ke tumpukan limbah organik.",
        parameters: "Rasio: 100 kg sampah + 200 ml EM4 + 200 ml Molase + air secukupnya"
      },
      {
        title: "Pemeraman Anaerobik Terkontrol",
        description: "Tutup media dalam tong tertutup atau terpal rapat selama 24-48 jam hingga timbul aroma tape harum fermentasi segar (bukan bau bangkai/asam menyengat).",
        parameters: "Waktu inkubasi: 24 - 48 jam, pH ideal: 5.5 - 6.8"
      }
    ],
    practicalTips: [
      "Jalin MoU resmi dengan koordinator pasar tradisional atau paguyuban resto agar pasokan rutin tiap pagi.",
      "Hindari sampah kulit jeruk/nanas dalam jumlah masif karena asam sitrat berlebih menekan selera makan larva.",
      "Selalu gunakan ampas tahu sebagai buffer kelembapan dan booster protein bila sampah pasar terlalu berair."
    ],
    icon: "Leaf"
  },
  {
    id: "pilar-2-smart-housing",
    pillarNumber: 2,
    title: "Kandang Otomatisasi & Teratur (Smart Housing)",
    subtitle: "Kandang Atraktan BSF & Biopond Miring 30° Self-Harvesting",
    coreConcept: "Arsitektur kandang yang memisahkan fase kawin (love cage) dan fase biokonversi dengan inovasi ramp miring 30° di sisi biopond agar prepupa bermigrasi panen sendiri ke wadah penampung tanpa tenaga sortir manual.",
    keyBenefits: [
      "Self-Harvesting 30° ramp memotong 80% biaya tenaga kerja pemilahan manual",
      "Pemanfaatan insting fotofobik & geotropik negatif prepupa bermigrasi ke tempat kering",
      "Kandang lalat atraktan memaksimalkan intensitas kawin dan produktivitas telur",
      "Desain biopond modular bertingkat hemat lahan perkotaan DKI Jakarta"
    ],
    operationalProtocols: [
      {
        title: "Kandang Atraktan BSF (Indukan / Love Cage)",
        description: "Ruangan jaring mesh 30-40 dengan ventilasi udara dan pencahayaan matahari alami (atau bantuan lampu UV 365 nm bila cuaca mendung) untuk proses kawin lalat dewasa.",
        parameters: "Suhu: 28-34°C, Kelembapan: 60-80%, Sinar: 6-8 jam/hari"
      },
      {
        title: "Media Eggies & Atraktan Bertelur",
        description: "Susunan bilah kayu/papan selip (eggies) digantung 5-10 cm di atas baskom atraktan (fermentasi ampas tahu/buah busuk) agar lalat bertelur di celah kering bersih.",
        parameters: "Celah kayu: 1-1.5 mm, Bobot cluster: 500-900 telur/klaster"
      },
      {
        title: "Biopond Miring (Self-Harvesting Biopond ~30°)",
        description: "Salah satu dinding biopond dibuat miring dengan sudut ~30-35 derajat dilapisi permukaan sedikit bertekstur. Prepupa yang siap panen akan merayap sendiri mendaki bibir ramp dan jatuh ke pipa/ember pipa penampung.",
        parameters: "Kemiringan ramp: 30° - 35°, Bahan: Semen plester halus atau talang PVC"
      }
    ],
    practicalTips: [
      "Beri sedikit serbuk gergaji atau dedak kering di wadah ember penampungan panen agar prepupa tetap bersih dan tidak basah.",
      "Pasang jaring insect-screen di sekeliling area biopond agar lalat rumah dan burung pemangsa tidak masuk.",
      "Kandang indukan sebaiknya menghadap timur untuk mendapatkan paparan sinar matahari pagi yang membangkitkan libido lalat BSF."
    ],
    icon: "Box"
  },
  {
    id: "pilar-3-multi-stream-income",
    pillarNumber: 3,
    title: "Diversifikasi Produk Penjualan (Multi-Stream Income)",
    subtitle: "Maksimalkan Nilai Tambah: Telur BSF, Maggot Segar, Dried Maggot, & Kasgot",
    coreConcept: "Tidak hanya menjual maggot segar kiloan, model cerdas mendiversifikasi menjadi 4 produk bernilai ekonomi tinggi untuk menyerap segmen hobi burung kicau, peternak komersial, pembudidaya ikan, hingga pekebun organik.",
    keyBenefits: [
      "Mengurangi risiko fluktuasi harga komoditas tunggal",
      "Maggot Kering (Dried) memiliki margin laba per kilogram hingga 7x lipat",
      "Telur BSF memberikan omzet per gram tinggi untuk permodalan awal",
      "Pupuk Kasgot menghasilkan pendapatan sirkular 100% dari residu sisa cerna"
    ],
    operationalProtocols: [
      {
        title: "Telur BSF (Bibit Starter)",
        description: "Dipanen setiap pagi dari media eggies kayu menggunakan silet/spatula, dikemas dalam cawan petri beralas tisu steril untuk dikirim ke peternak baru.",
        parameters: "Harga: Rp5.000 - Rp8.000 / gram (1 gram = 35.000 - 40.000 butir)"
      },
      {
        title: "Maggot Segar (Fresh Larvae)",
        description: "Larva instar 4-5 dipanen saat kandungan protein & lemak optimal. Dicuci bersih dan ditiriskan untuk pakan langsung lele, patin, nila, ayam, dan bebek.",
        parameters: "Harga: Rp6.000 - Rp8.000 / kg (Protein: 40-44%, Air: 65%)"
      },
      {
        title: "Maggot Kering Oven/Sangrai (Dried Maggot)",
        description: "Larva di-blanching air panas 80°C kemudian disangrai atau di-oven microwave/dehidrator hingga kadar air <8%. Daya simpan hingga 12 bulan.",
        parameters: "Harga: Rp60.000 - Rp75.000 / kg (Protein: 48-52%, Kemasan pouch)"
      },
      {
        title: "Pupuk Kasgot Organik (Frass Fertilizer)",
        description: "Residu bekas kotoran maggot dan sisa fermentasi diayak halus (mesh 10) lalu dikeringkan. Kaya unsur N-P-K organik dan mikoriza penyubur tanah.",
        parameters: "Harga: Rp1.000 - Rp3.500 / kg (Kaya N: 2.8%, P: 1.9%, K: 2.4%)"
      }
    ],
    practicalTips: [
      "Kemas dried maggot dalam standing pouch ziplock dengan silica gel untuk pasar toko pakan burung & ikan hias.",
      "Jual pupuk kasgot ke komunitas urban farming, RPTRA, dan pecinta tanaman hias perkotaan dalam kemasan 1 kg, 5 kg, atau 25 kg karung.",
      "Tawarkan paket 'Starter Kit BSF Warga' yang berisi 10 gram telur BSF + eggies + wadah penetasan mini."
    ],
    icon: "Coins"
  },
  {
    id: "pilar-4-integrated-farming",
    pillarNumber: 4,
    title: "Integrasi Terpadu (Integrated Farming)",
    subtitle: "Simbiosis Maggot dengan Kolam Lele/Nila & Unggas (Pangkas 50-70% Biaya Pakan)",
    coreConcept: "Menghubungkan biopond maggot langsung berdampingan dengan kolam ikan bioflok atau peternakan ayam/bebek. Pakan berprotein tinggi diproduksi mandiri di lokasi tanpa ketergantungan pabrik pakan komersial.",
    keyBenefits: [
      "Menghemat biaya belanja pakan pelet komersial pabrikan sebesar 50% hingga 70%",
      "Kotoran ayam/unggas dapat difermentasi kembali menjadi pakan larva (Closed-Loop)",
      "Meningkatkan imunitas ikan dan unggas terhadap penyakit berkat kandungan asam laurat",
      "Mempercepat masa panen ikan lele dari 90 hari menjadi 65-70 hari dengan FCR optimal"
    ],
    operationalProtocols: [
      {
        title: "Integrasi Kolam Bioflok Lele & Nila",
        description: "Maggot segar diberikan pada jadwal pakan sore dan malam menggantikan 50-60% porsi pelet apung komersial. Protein tinggi memacu pertumbuhan daging ikan lebih padat.",
        parameters: "Substitusi pelet: 50% - 70%, FCR turun dari 1.2 menjadi 0.8"
      },
      {
        title: "Integrasi Kandang Ayam Petelur & Bebek",
        description: "Larva hidup maupun prepupa kaya kalsium (Ca: 5-8%) diberikan langsung. Memperbaiki kualitas kuning telur (warna oranye pekat) dan ketebalan cangkang telur.",
        parameters: "Rasio ransum: 20-30% dari total pakan harian unggas"
      },
      {
        title: "Sirkularitas Zero-Waste Farm",
        description: "Sisa air kurasan kolam lele yang kaya amonia digunakan menyiram tanaman sayur hidroponik/polybag yang telah dicampur pupuk kasgot.",
        parameters: "Efisiensi sirkular: 96% nutrisi terserap siklus tertutup"
      }
    ],
    practicalTips: [
      "Untuk bibit ikan di bawah 5 cm, cincang maggot segar atau berikan larva fase kecil (instar 3).",
      "Lakukan puasa maggot 1 hari sebelum ikan dipanen agar lambung ikan bersih saat diolah konsumen.",
      "Kombinasikan daun azolla atau kangkung air di atas kolam untuk pakan serat tambahan lele."
    ],
    icon: "Fish"
  }
];

// ==========================================
// SIMULASI ANALISIS USAHA & BEP (SKALA MENENGAH ±600 KG/BULAN)
// ==========================================
export interface BepCostItem {
  id: string;
  name: string;
  category: "capex" | "opex";
  amountIdr: number;
  description: string;
}

export interface BepRevenueItem {
  id: string;
  name: string;
  unit: string;
  productionQty: number;
  pricePerUnitIdr: number;
  totalRevenueIdr: number;
  description: string;
}

export interface BepAnalysisSimulation {
  scaleLabel: string;
  targetHarvestFreshKgMonthly: number;
  capexItems: BepCostItem[];
  opexItems: BepCostItem[];
  revenueItems: BepRevenueItem[];
  totalCapexIdr: number;
  totalOpexMonthlyIdr: number;
  totalRevenueMonthlyIdr: number;
  netProfitMonthlyIdr: number;
  bepProductionKgMonthly: number; // OpEx / Selling Price Fresh Maggot
  paybackPeriodMonths: number; // CapEx / Net Profit
  bepRevenueBreakEvenIdr: number;
}

export const DEFAULT_BEP_SIMULATION_DATA: BepAnalysisSimulation = {
  scaleLabel: "Skala Menengah Komunal (Target ±600 kg Maggot Segar/Bulan)",
  targetHarvestFreshKgMonthly: 600,
  capexItems: [
    {
      id: "capex-1",
      name: "Konstruksi Kandang Lalat BSF + Biopond",
      category: "capex",
      amountIdr: 2500000,
      description: "Rangka baja ringan/bambu, jaring insect screen tahan UV, atap transparan, dan dinding biopond semen miring 30°."
    },
    {
      id: "capex-2",
      name: "Rak & Wadah Tray/Biopond Plastik",
      category: "capex",
      amountIdr: 1500000,
      description: "Rak bertingkat hollow galvanis + 30-40 tray plastik pembesaran dan wadah penetasan telur."
    },
    {
      id: "capex-3",
      name: "Mesin Sangrai / Oven Maggot (Opsional)",
      category: "capex",
      amountIdr: 1500000,
      description: "Wajan sangrai putar manual/semi-otomatis atau oven dehidrator untuk produksi dried maggot berdaya simpan lama."
    },
    {
      id: "capex-4",
      name: "Peralatan Panen, Timbangan, & Saringan",
      category: "capex",
      amountIdr: 500000,
      description: "Ayakan kawat vibrasi/manual, timbangan digital duduk 50 kg, baskom, sekop, sprayer, dan eggies kayu."
    }
  ],
  opexItems: [
    {
      id: "opex-1",
      name: "Bibit/Telur BSF (Awal)",
      category: "opex",
      amountIdr: 300000,
      description: "Pembelian telur indukan BSF 50-60 gram starter (hanya di awal; setelahnya mandiri dari love cage indukan)."
    },
    {
      id: "opex-2",
      name: "Transportasi Pengambilan Sampah",
      category: "opex",
      amountIdr: 600000,
      description: "Bensin motor gerobak / bensin operasional jemput sampah organik pasar & resto 3-4 kali seminggu."
    },
    {
      id: "opex-3",
      name: "Bahan Fermentasi (EM4, Molase)",
      category: "opex",
      amountIdr: 150000,
      description: "2 botol EM4 pertanian/peternakan (1 liter) + jeriken molase tetes tebu murni."
    },
    {
      id: "opex-4",
      name: "Kemasan & Kemudahan Pemasaran",
      category: "opex",
      amountIdr: 250000,
      description: "Pouch standing zipper dried maggot, stiker label merek MaggoCity, dan karung sablon kasgot."
    },
    {
      id: "opex-5",
      name: "Operasional Listrik & Air",
      category: "opex",
      amountIdr: 200000,
      description: "Listrik pompa air cuci maggot, lampu UV kandang kawin, dan air PDAM/sumur."
    }
  ],
  revenueItems: [
    {
      id: "rev-1",
      name: "Maggot Segar",
      unit: "kg",
      productionQty: 500,
      pricePerUnitIdr: 8000,
      totalRevenueIdr: 4000000,
      description: "500 kg x Rp8.000 dialokasikan untuk peternak lele bioflok & ayam lokal DKI."
    },
    {
      id: "rev-2",
      name: "Maggot Kering (Dried Maggot)",
      unit: "kg",
      productionQty: 20,
      pricePerUnitIdr: 65000,
      totalRevenueIdr: 1300000,
      description: "20 kg x Rp65.000 hasil dehidrasi 80-90 kg maggot basah untuk pakan burung & ikan hias predator."
    },
    {
      id: "rev-3",
      name: "Pupuk Kasgot",
      unit: "kg",
      productionQty: 600,
      pricePerUnitIdr: 1000,
      totalRevenueIdr: 600000,
      description: "600 kg x Rp1.000 pupuk organik sisa pencernaan maggot untuk urban farming sayur DKI."
    }
  ],
  totalCapexIdr: 6000000,
  totalOpexMonthlyIdr: 1500000,
  totalRevenueMonthlyIdr: 5900000,
  netProfitMonthlyIdr: 4400000,
  bepProductionKgMonthly: 187.5, // 1.500.000 / 8.000
  paybackPeriodMonths: 1.36, // 6.000.000 / 4.400.000 ≈ 1.3 - 3 bulan
  bepRevenueBreakEvenIdr: 1500000
};

// ==========================================
// KUNCI SUKSES MEMPERCEPAT BEP
// ==========================================
export interface BepSuccessKey {
  id: string;
  title: string;
  coreRule: string;
  impactOnBep: string;
  actionItems: string[];
  warningNote: string;
}

export const BEP_SUCCESS_KEYS_DATA: BepSuccessKey[] = [
  {
    id: "key-1-feedstock-stability",
    title: "1. Pasokan Sampah Organik Stabil & Terjadwal",
    coreRule: "Menjamin ketersediaan pakan gratis kontinu setiap hari dengan kemitraan resmi.",
    impactOnBep: "Memastikan siklus biokonversi tidak terputus sehingga target panen 600 kg tercapai stabil tanpa biaya beli pakan tambahan.",
    actionItems: [
      "Bekerja sama dengan pengelola pasar lokal (sayur/buah) atau pabrik olahan pangan",
      "Bermitra dengan rumah makan Padang, katering kantor, atau pengrajin tahu tempe terdekat",
      "Sediakan wadah drum khusus bertanda di lokasi mitra agar sampah tidak tercampur plastik atau detergen"
    ],
    warningNote: "Keterlambatan pakan lebih dari 3 hari membuat larva kanibal atau mengalami dormansi yang memperpanjang siklus panen."
  },
  {
    id: "key-2-moisture-control",
    title: "2. Kunci Kontrol Kelembaban Substrat (60–70%)",
    coreRule: "Menjaga kelembaban media pakan pada tingkat 60–70% agar larva tumbuh optimal.",
    impactOnBep: "Mencegah timbulnya belatung lalat hijau rumah dan bau menyengat, serta menjamin larva makan secara rakus.",
    actionItems: [
      "Gunakan uji kepal: substrat dikepal menggumpal basah tetapi tidak meneteskan air berlebih",
      "Tambahkan ampas tahu peras atau dedak kering jika media sampah pasar terlalu berair",
      "Lakukan pengadukan substrat berkala untuk meratakan aerasi dan melepas hawa panas fermentasi berlebih"
    ],
    warningNote: "Substrat terlalu basah (>80%) menyebabkan kondisi anaerobik berbau busuk tajam dan larva berusaha kabur dari biopond."
  },
  {
    id: "key-3-offtaker-partnerships",
    title: "3. Kemitraan Pasar & Kontrak Off-Taker Sejak Dini",
    coreRule: "Kunci utama percepatan BEP adalah langsung mengamankan kontrak pasokan dengan peternak lele/ayam lokal sebelum kapasitas produksi ditingkatkan.",
    impactOnBep: "Menghindari penumpukan stok maggot segar yang cepat bermutasi menjadi prepupa, serta mempercepat perputaran arus kas likuid mingguan.",
    actionItems: [
      "Ikat kesepakatan pasokan mingguan dengan pembudidaya lele/nila dan peternak ayam lokal",
      "Titipkan kemasan dried maggot di toko pakan burung kicau dan ikan hias predator",
      "Salurkan pupuk kasgot ke komunitas urban farming RW, kebun bibit bibit hidroponik, dan toko tanaman hias"
    ],
    warningNote: "Maggot segar idealnya langsung diserap dalam waktu 24-48 jam pasca panen agar bobot dan kadar air tidak susut."
  }
];

