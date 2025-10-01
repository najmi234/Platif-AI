"use client"

import { withRole } from "@/lib/authguard";
import React, { useState, useEffect } from "react"
import {
  User,
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

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"

interface UserData {
  no: number
  id: string
  name: string
  email: string
  role: string
  isApproved: boolean
  createdAt: string
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

type SortField = keyof UserData
type SortDirection = 'asc' | 'desc'

function Akun() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [data, setData] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const [sortField, setSortField] = useState<SortField>('no')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  const sidebarItems: SidebarItem[] = [
    { icon: FileText, label: "Penjualan", href: "/penjualan" },
    { icon: Grid3X3, label: "Penerima", href: "/penerima" },
    { icon: User, label: "Kelola Akun", href: "/akun" },
    { icon: MoreHorizontal, label: "Others", href: "/others" },
  ];

  // Fetch data dari Firebase users
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "https://platif-ai-default-rtdb.asia-southeast1.firebasedatabase.app/users.json"
      )
      const firebaseData = await response.json()

      if (firebaseData) {
        const dataArray: UserData[] = Object.keys(firebaseData).map(
          (key, index) => ({
            no: index + 1,
            id: key,
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

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    router.push("/login");
  };

  // Sort function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter & sort data
  const getFilteredAndSortedData = () => {
    let filtered = data.filter((item) => {
      return (
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return 0
    })

    return filtered
  }

  const filteredData = getFilteredAndSortedData()
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const handleEdit = (id: string) => {
    console.log("Edit:", id)
  }

  const handleDelete = (id: string) => {
    console.log("Delete:", id)
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
      <div className="w-64 min-h-screen flex flex-col justify-between py-7 px-6">
        <img src="/Platif-AI.png" alt="Logo PLatif-AI" className="h-12 w-auto object-contain mb-15" />
        <div className="flex-1 space-y-3 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href} // ⬅️ ini jalan di Link
                className={`w-full flex items-center space-x-3 px-8 py-4 rounded-full transition-all ${
                  pathname === item.href
                    ? "bg-white/80 text-blue-600 shadow-lg border border-white/40"
                    : "text-gray-600 hover:bg-white/40"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center mt-auto">
          <img src="/vectt.png" alt='"Designed by macrovector / Freepik"http://www.freepik.com"' className="w-full h-auto" />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <nav className="px-10 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Kelola Akun
          </h1>
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
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 h-full shadow-lg">
            {/* Search */}
            <div className="flex items-center justify-between mb-2">
              <div className="relative rounded-full shadow-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari akun..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
              </div>
            </div>

            {/* Table akun */}
            <div className="bg-white rounded-2xl border border-white/40 overflow-hidden shadow-md px-5">
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
                        <SortableHeader field="name">Nama</SortableHeader>
                        <SortableHeader field="email">Email</SortableHeader>
                        <SortableHeader field="role">Role</SortableHeader>
                        <SortableHeader field="isApproved">Approved</SortableHeader>
                        <SortableHeader field="createdAt">Dibuat</SortableHeader>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.no}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell>
                            {item.isApproved ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Yes</span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">No</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item.id)}
                                className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
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
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            Tidak ada akun yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRole(Akun, ["admin"]);
