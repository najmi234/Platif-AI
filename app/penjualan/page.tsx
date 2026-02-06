
"use client"

import { withRole } from "@/lib/authguard";
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  User,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Fuel,
  Search,
  Grid3X3,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"

// ====== INTERFACES ======
interface Penjualan {
  no: number;
  idPembelian: string;
  plat: string;
  jenisBBM: string;
  liter: number;
  nominal: number;
  waktu: string;
}

interface ChartData {
  date: string;
  pertalite: number;
  solar: number;
}

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "purple" | "orange";
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
}

type SortField = keyof Penjualan;
type SortDirection = 'asc' | 'desc';
type ColorType = "blue" | "green" | "purple" | "orange";

// ====== DATA DUMMY UNTUK CHART (UNTUK DEMO) ======
const mockChartData: ChartData[] = [
  { date: '2026-01-01', pertalite: 320000, solar: 185000 },
  { date: '2026-01-02', pertalite: 245000, solar: 142200 },
  { date: '2026-01-03', pertalite: 180000, solar: 95000 },
  { date: '2026-01-04', pertalite: 410000, solar: 213000 },
  { date: '2026-01-05', pertalite: 225700, solar: 90000 },
  { date: '2026-01-06', pertalite: 260600, solar: 70000 },
  { date: '2026-01-07', pertalite: 335000, solar: 84000 },
  { date: '2026-01-08', pertalite: 342400, solar: 80000 },
  { date: '2026-01-09', pertalite: 205200, solar: 90000 },
  { date: '2026-01-10', pertalite: 385000, solar: 191000 },
  { date: '2026-01-11', pertalite: 285800, solar: 86000 },
  { date: '2026-01-12', pertalite: 180000, solar: 87000 },
  { date: '2026-01-13', pertalite: 405000, solar: 186000 },
  { date: '2026-01-14', pertalite: 268200, solar: 75000 },
  { date: '2026-01-15', pertalite: 235200, solar: 81000 }
];

function Penjualan() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [activeSection, setActiveSection] = useState<string>("Penjualan");
  const [data, setData] = useState<Penjualan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('no');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    jenisBBM: '',
    plat: ''
  });

  // Chart filter state
  const [timeRange, setTimeRange] = useState<string>('30d');

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });

  const sidebarItems: SidebarItem[] = [
    { icon: FileText, label: "Penjualan", href: "/penjualan" },
    { icon: Grid3X3, label: "Penerima", href: "/penerima" },
    { icon: User, label: "Kelola Akun", href: "/akun" },
    { icon: MoreHorizontal, label: "Others", href: "/others" },
  ];

  // ====== UTILITY FUNCTIONS ======
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatChartDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric'
    });
  };

  // ====== COMPONENTS ======
  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = "blue" }) => {
    const isPositive = change >= 0;

    const colorClasses: Record<ColorType, string> = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600"
    };

    const backgroundClr: Record<ColorType, string> = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      purple: "bg-purple-50",
      orange: "bg-orange-50"
    };

    const backgroundClasses: Record<ColorType, string> = {
      blue: "bg-blue-100",
      green: "bg-green-100",
      purple: "bg-purple-100",
      orange: "bg-orange-100"
    };

    const strip: Record<ColorType, string> = {
      blue: "bg-blue-600 shadow-blue-500/50",
      green: "bg-green-600 shadow-green-500/50",
      purple: "bg-purple-600 shadow-purple-500/50",
      orange: "bg-orange-600 shadow-orange-500/50"
    };

    return (
      <Card className={`relative overflow-hidden border-0 shadow-md py-0 ${backgroundClr[color]}`}>
        {/* Garis aksen dengan shadow */}
        <div className={`absolute left-0 top-1/4 h-2/5 w-1 rounded-full shadow-md ${strip[color]}`} />

        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-normal text-gray-500">{title}</p>
              <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${backgroundClasses[color]}`}>
              <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
            </div>
          </div>
          <div className="flex items-center mt-2 space-x-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-500">Since last week</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SortableHeader: React.FC<SortableHeaderProps> = ({ field, children }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-between">
        {children}
        <div className="flex flex-col ml-1">
          <ChevronUp
            className={`w-3 h-3 ${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <ChevronDown
            className={`w-3 h-3 -mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
        </div>
      </div>
    </TableHead>
  );

  // ====== DATA FETCHING ======
  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/rwytSPBU1.json"
      );
      const firebaseData = await response.json();

      if (firebaseData) {
        const dataArray: Penjualan[] = [];
        let counter = 1;

        // Parse nested structure
        Object.keys(firebaseData).forEach((jenisBBM) => {
          const bbmData = firebaseData[jenisBBM];
          Object.keys(bbmData).forEach((transactionId) => {
            const transaction = bbmData[transactionId];
            dataArray.push({
              no: counter++,
              idPembelian: transaction.idPembelian,
              plat: transaction.plat,
              jenisBBM: transaction.jenisBBM,
              liter: transaction.liter,
              nominal: transaction.nominal,
              waktu: transaction.waktu
            });
          });
        });

        // Sort by waktu (newest first)
        dataArray.sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());

        // Re-number after sorting
        dataArray.forEach((item, index) => {
          item.no = index + 1;
        });

        setData(dataArray);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    router.push("/login");
  };

  // ====== SORTING & FILTERING ======
  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFilteredAndSortedData = (): Penjualan[] => {
    let filtered = data.filter((item) => {
      const itemDate = new Date(item.waktu);

      const matchesSearch =
        item.idPembelian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisBBM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.waktu?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.jenisBBM || item.jenisBBM?.toLowerCase().includes(filters.jenisBBM.toLowerCase())) &&
        (!filters.plat || item.plat?.toLowerCase().includes(filters.plat.toLowerCase()));

      const matchesDate =
        (!dateRange?.from || itemDate >= dateRange.from) &&
        (!dateRange?.to || itemDate <= dateRange.to);

      return matchesSearch && matchesFilters && matchesDate;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (sortField === 'waktu') {
        const dateA = new Date(aVal as string).getTime();
        const dateB = new Date(bVal as string).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return filtered;
  };

  const filteredData = getFilteredAndSortedData();

  // ====== PREPARE CHART DATA ======
  const chartData = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return mockChartData
      .filter(item => new Date(item.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeRange]);

  // ====== STATISTICS ======
  const stats = useMemo(() => {
    const totalTransactions = filteredData.length;
    const totalLiters = filteredData.reduce((sum, item) => sum + item.liter, 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.nominal, 0);
    const uniqueFuelTypes = new Set(filteredData.map(item => item.jenisBBM)).size;

    return { totalTransactions, totalLiters, totalRevenue, uniqueFuelTypes };
  }, [filteredData]);

  // ====== PAGINATION ======
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortField, sortDirection]);

  // ====== UTILITY FUNCTIONS ======
  const handleDownload = (): void => {
    if (!filteredData.length) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "No,ID Pembelian,Plat Nomor,Jenis BBM,Liter,Nominal,Waktu Pembelian\n" +
      filteredData
        .map(
          (row) =>
            `${row.no},${row.idPembelian},${row.plat},${row.jenisBBM},${row.liter},${row.nominal},"${row.waktu}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "penjualan_bbm.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = (): void => {
    setFilters({
      jenisBBM: '',
      plat: ''
    });
    setSearchTerm('');
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  // ====== TOOLTIP CONTENT ======
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{formatChartDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-2">
              {/* kotak warna sesuai legend */}
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-gray-700 font-medium">
                {entry.name}: <span className="text-blue-600">{formatRupiah(entry.value)}</span>
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getInitial = (name: string | undefined) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed left-0 top-0 flex flex-col py-7 px-6 z-10">
        <img src="/Platif-AI.png" alt="Logo Platif-AI" className="h-12 w-auto object-contain mb-15" />

        <div className="flex-1 space-y-3 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href} // ⬅️ ini jalan di Link
                className={`w-full flex items-center space-x-3 px-8 py-4 rounded-full transition-all ${pathname === item.href
                    ? "bg-white/80 text-blue-600 shadow-lg border border-white/40"
                    : "text-gray-600 hover:bg-white/60"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center">
          <img src="/vectt.png" alt='"Designed by macrovector / Freepik"http://www.freepik.com"' className="w-full h-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <nav className="px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Data Penjualan BBM Bersubsidi
            </h1>
          </div>

          {/* Akun */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInitial(user?.name)}
                </div>
                <span className="text-black font-medium">
                  {user?.name || "Guest"}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-black transition-transform ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 px-6 pb-6">

          {/* Stats Cards Container */}
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-xl font-bold text-gray-800">
                  My Analytics Overview
                </CardTitle>
              </div>
              <Select
                value={filters.jenisBBM || "all"}
                onValueChange={(value) => setFilters({ ...filters, jenisBBM: value === "all" ? "" : value })}
              >
                <SelectTrigger className="w-[160px] rounded-lg">
                  <SelectValue placeholder="All Fuel Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">All Fuel Types</SelectItem>
                  <SelectItem value="Pertalite" className="rounded-lg">Pertalite</SelectItem>
                  <SelectItem value="Solar" className="rounded-lg">Solar</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Transaksi"
                  value={stats.totalTransactions.toString()}
                  change={6.5}
                  icon={FileText}
                  color="blue"
                />
                <StatCard
                  title="Total Liter"
                  value={`${stats.totalLiters.toFixed(2)} L`}
                  change={-0.10}
                  icon={Fuel}
                  color="green"
                />
                <StatCard
                  title="Total Revenue"
                  value={formatRupiah(stats.totalRevenue)}
                  change={-0.2}
                  icon={DollarSign}
                  color="purple"
                />
                <StatCard
                  title="Total Pembeli BBM Subsidi"
                  value={stats.uniqueFuelTypes.toString()}
                  change={11.5}
                  icon={Users}
                  color="orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* Area Chart */}
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Sales Analytics
                </CardTitle>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] rounded-lg">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
                  <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                  <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="aspect-auto h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPertalite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8EC5FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8EC5FF" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2B7FFF" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#2B7FFF" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={formatChartDate}
                      className="text-xs text-gray-500"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => formatRupiah(value)}
                      className="text-xs text-gray-500"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '10px', color: '#000' }}
                      iconType="circle" // kotaknya jadi rounded (pakai circle)
                      iconSize={12}     // biar ukurannya pas
                    />
                    <Area
                      type="natural"
                      dataKey="pertalite"
                      stackId="1"
                      stroke="#8EC5FF"
                      strokeWidth={2}
                      fill="url(#colorPertalite)"
                      fillOpacity={1}
                      name="Pertalite"
                    />
                    <Area
                      type="natural"
                      dataKey="solar"
                      stackId="2"
                      stroke="#2B7FFF"
                      strokeWidth={2}
                      fill="url(#colorSolar)"
                      fillOpacity={1}
                      name="Solar"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Table Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-lg max-w-full overflow-hidden">
            {/* Search, Filter & Download */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                <div className="relative rounded-full shadow-md w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari data penjualan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 lg:w-80"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all shadow-md ${showFilters ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white/60 text-gray-700 hover:bg-gray-200/60'
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>

                  <button
                    onClick={resetFilters}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/60 text-gray-700 rounded-full hover:bg-gray-200/60 transition-all shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
                </span>

                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white/40 rounded-2xl p-4 mb-4 border border-white/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Filter Jenis BBM */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis BBM
                    </label>
                    <input
                      type="text"
                      placeholder="Filter jenis BBM..."
                      value={filters.jenisBBM}
                      onChange={(e) =>
                        setFilters({ ...filters, jenisBBM: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>

                  {/* Filter Plat Nomor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plat Nomor
                    </label>
                    <input
                      type="text"
                      placeholder="Filter plat nomor..."
                      value={filters.plat}
                      onChange={(e) =>
                        setFilters({ ...filters, plat: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>

                  {/* Filter Tanggal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter Tanggal
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                                {format(dateRange.to, "dd/MM/yyyy")}
                              </>
                            ) : (
                              format(dateRange.from, "dd/MM/yyyy")
                            )
                          ) : (
                            <span>Pilih rentang tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) =>
                            setDateRange(range ?? { from: undefined, to: undefined })
                          }
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {/* Table Container with Horizontal Scroll */}
            <div className="w-full overflow-hidden">
              <div className="bg-white/20 rounded-2xl border border-white/40 shadow-md">
                {loading ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    Loading data...
                  </div>
                ) : (
                  <>
                    {/* Table with horizontal scroll on mobile */}
                    <div className="overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <SortableHeader field="no">No</SortableHeader>
                            <SortableHeader field="idPembelian">ID Pembelian</SortableHeader>
                            <SortableHeader field="plat">Plat Nomor</SortableHeader>
                            <SortableHeader field="jenisBBM">Jenis BBM</SortableHeader>
                            <SortableHeader field="liter">Liter</SortableHeader>
                            <SortableHeader field="nominal">Nominal</SortableHeader>
                            <SortableHeader field="waktu">Waktu Pembelian</SortableHeader>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedData.map((item) => (
                            <TableRow key={item.idPembelian}>
                              <TableCell className="whitespace-nowrap">{item.no}</TableCell>
                              <TableCell className="font-medium text-blue-600 whitespace-nowrap">
                                {item.idPembelian}
                              </TableCell>
                              <TableCell className="font-medium whitespace-nowrap">
                                {item.plat}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.jenisBBM === 'Pertalite'
                                    ? 'bg-green-100 text-green-800'
                                    : item.jenisBBM === 'Solar'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {item.jenisBBM}
                                </span>
                              </TableCell>
                              <TableCell className="font-medium whitespace-nowrap">
                                {item.liter.toFixed(2)} L
                              </TableCell>
                              <TableCell className="font-medium text-green-600 whitespace-nowrap">
                                {formatRupiah(item.nominal)}
                              </TableCell>
                              <TableCell className="text-medium whitespace-nowrap">
                                {formatDate(item.waktu)}
                              </TableCell>
                            </TableRow>
                          ))}
                          {paginatedData.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                Tidak ada data yang ditemukan
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                      <div className="px-6 py-4 bg-white/30 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Tampilkan</span>
                          <select
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value))
                              setCurrentPage(1)
                            }}
                            className="px-2 py-1 bg-white/60 rounded border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <span className="text-sm text-gray-600">per halaman</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white/60 text-gray-600 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <div className="flex space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNumber
                              if (totalPages <= 5) {
                                pageNumber = i + 1
                              } else if (currentPage <= 3) {
                                pageNumber = i + 1
                              } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i
                              } else {
                                pageNumber = currentPage - 2 + i
                              }

                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                  className={`px-3 py-1 rounded-lg text-sm transition-all ${currentPage === pageNumber
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-white/60 text-gray-600 hover:bg-white/80'
                                    }`}
                                >
                                  {pageNumber}
                                </button>
                              )
                            })}
                          </div>

                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white/60 text-gray-600 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRole(Penjualan, ["admin"]);
