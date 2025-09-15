"use client"

import React, { useState, useEffect } from "react"
import {
  Upload,
  Search,
  Grid3X3,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react"

// ✅ pakai komponen Table dari shadcn
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface Penerima {
  no: number
  platN: string
  Pemilik: string
  kuotaH: number
  sisaK: number
  jenisB: string
  jenisK: string
  merekK: string
  warnaK: string
  tahunR: string
}

type SortField = keyof Penerima
type SortDirection = 'asc' | 'desc'

export default function Penerima() {
  const [activeSection, setActiveSection] = useState("Penjualan")
  const [data, setData] = useState<Penerima[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting states
  const [sortField, setSortField] = useState<SortField>('no')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    jenisB: '',
    jenisK: '',
    merekK: '',
    warnaK: ''
  })

  const sidebarItems = [
    { icon: Grid3X3, label: "Penerima" },
    { icon: FileText, label: "Penjualan" },
    { icon: MoreHorizontal, label: "Others" },
  ]

  // Fetch data dari Firebase
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/Penerima.json"
      )
      const firebaseData = await response.json()

      if (firebaseData) {
        const dataArray: Penerima[] = Object.keys(firebaseData).map(
          (key, index) => ({
            no: index + 1,
            ...firebaseData[key],
          })
        )
        setData(dataArray)
      } else {
        setData([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Sort function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort data
  const getFilteredAndSortedData = () => {
    let filtered = data.filter((item) => {
      const matchesSearch = 
        item.Pemilik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.platN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisB?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisK?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merekK?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warnaK?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilters = 
        (!filters.jenisB || item.jenisB?.toLowerCase().includes(filters.jenisB.toLowerCase())) &&
        (!filters.jenisK || item.jenisK?.toLowerCase().includes(filters.jenisK.toLowerCase())) &&
        (!filters.merekK || item.merekK?.toLowerCase().includes(filters.merekK.toLowerCase())) &&
        (!filters.warnaK || item.warnaK?.toLowerCase().includes(filters.warnaK.toLowerCase()))
      
      return matchesSearch && matchesFilters
    })

    // Sort data
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      // Handle numeric fields
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      // Handle string fields
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal)
      }
      
      return 0
    })

    return filtered
  }

  const filteredData = getFilteredAndSortedData()
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortField, sortDirection])

  const handleEdit = (platN: string) => {
    console.log("Edit:", platN)
  }

  const handleDelete = (platN: string) => {
    console.log("Delete:", platN)
  }

  const handleDownload = () => {
    if (!filteredData.length) return

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "No,Plat,Nama,Kuota,Sisa Kuota,Jenis BBM,Kendaraan,Merek,Warna,Tahun\n" +
      filteredData
        .map(
          (row) =>
            `${row.no},${row.platN},${row.Pemilik},${row.kuotaH},${row.sisaK},${row.jenisB},${row.jenisK},${row.merekK},${row.warnaK},${row.tahunR}`
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "penerima_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFilters = () => {
    setFilters({
      jenisB: '',
      jenisK: '',
      merekK: '',
      warnaK: ''
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
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
  )

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen flex flex-col justify-between py-7 px-6">
        <img src="/Platif-AI.png" alt="Logo 1" className="h-12 w-auto object-contain mb-15" />
        <div className="space-y-3">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => setActiveSection(item.label)}
                className={`w-full flex items-center space-x-3 px-8 py-4 rounded-full transition-all ${
                  item.label === activeSection
                    ? "bg-white/80 text-blue-600 shadow-lg border border-white/40"
                    : "text-gray-600 hover:bg-white/40 hover:border hover:border-white/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex justify-center p-5 mt-auto">
          <img
            src="/vect.png"
            alt="Vector Illustration"
            className="w-full max-w-xs h-auto object-contain rounded-2xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Penerima BBM Bersubsidi
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                N
              </div>
              <span className="text-gray-700 font-medium">Najmi Umar Fauzi</span>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 h-full shadow-lg">
            {/* Search, Filter & Download */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <div className="relative rounded-full shadow-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all shadow-md ${
                    showFilters ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white/60 text-gray-700 hover:bg-gray-200/60'
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

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
                </span>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md"
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
              <div className="bg-white/40 rounded-2xl p-4 mb-2 border border-white/30">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis BBM</label>
                    <input
                      type="text"
                      placeholder="Filter jenis BBM..."
                      value={filters.jenisB}
                      onChange={(e) => setFilters({ ...filters, jenisB: e.target.value })}
                      className="w-full px-3 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kendaraan</label>
                    <input
                      type="text"
                      placeholder="Filter jenis kendaraan..."
                      value={filters.jenisK}
                      onChange={(e) => setFilters({ ...filters, jenisK: e.target.value })}
                      className="w-full px-3 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
                    <input
                      type="text"
                      placeholder="Filter merek..."
                      value={filters.merekK}
                      onChange={(e) => setFilters({ ...filters, merekK: e.target.value })}
                      className="w-full px-3 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                    <input
                      type="text"
                      placeholder="Filter warna..."
                      value={filters.warnaK}
                      onChange={(e) => setFilters({ ...filters, warnaK: e.target.value })}
                      className="w-full px-3 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white/ mt-6 rounded-2xl border border-white/40 overflow-hidden shadow-md px-5">
              {loading ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Loading data...
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader field="no">No</SortableHeader>
                        <SortableHeader field="platN">Plat</SortableHeader>
                        <SortableHeader field="Pemilik">Nama Pemilik</SortableHeader>
                        <SortableHeader field="kuotaH">Kuota</SortableHeader>
                        <SortableHeader field="sisaK">Sisa Kuota</SortableHeader>
                        <SortableHeader field="jenisB">Jenis BBM</SortableHeader>
                        <SortableHeader field="jenisK">Kendaraan</SortableHeader>
                        <SortableHeader field="merekK">Merek</SortableHeader>
                        <SortableHeader field="warnaK">Warna</SortableHeader>
                        <SortableHeader field="tahunR">Tahun</SortableHeader>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((item) => (
                        <TableRow key={item.platN}>
                          <TableCell>{item.no}</TableCell>
                          <TableCell className="font-medium">
                            {item.platN}
                          </TableCell>
                          <TableCell>{item.Pemilik}</TableCell>
                          <TableCell>{item.kuotaH} L</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.sisaK > item.kuotaH * 0.5 
                                ? 'bg-green-100 text-green-800' 
                                : item.sisaK > item.kuotaH * 0.2
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.sisaK} L
                            </span>
                          </TableCell>
                          <TableCell>{item.jenisB}</TableCell>
                          <TableCell>{item.jenisK}</TableCell>
                          <TableCell>{item.merekK}</TableCell>
                          <TableCell>{item.warnaK}</TableCell>
                          <TableCell>{item.tahunR}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item.platN)}
                                className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.platN)}
                                className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                            Tidak ada data yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {filteredData.length > 0 && (
                    <div className="px-6 py-4 bg-white/30 border-t border-white/30 flex items-center justify-between">
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
                                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                                  currentPage === pageNumber
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
  )
}