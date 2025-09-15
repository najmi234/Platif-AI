"use client";

import React, { useState } from 'react';
import { Upload, Search, Grid3X3, Image, Video, FileText, MoreHorizontal, ChevronUp, Grid2X2 } from 'lucide-react';

const StorageDashboard = () => {
  const [activeSection, setActiveSection] = useState('Penjualan');

  const sidebarItems = [
    { icon: Grid3X3, label: 'Penerima', active: true },
    { icon: FileText, label: 'Penjualan', active: false },
    { icon: MoreHorizontal, label: 'Others', active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex">
      {/* Sidebar - Full height sampai atas */}
      <div className="w-64 min-h-screen flex flex-col justify-between py-7 px-6">
        <img src="/Platif-AI.png" alt="Logo 1" className="h-12 w-auto object-contain mb-15" />
        {/* Menu Items */}
        <div className="space-y-3">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveSection(item.label)}
                className={`w-full flex items-center space-x-3 px-8 py-4 rounded-full transition-all ${
                  item.label === activeSection
                    ? 'bg-white/80 backdrop-blur-md text-blue-600 shadow-lg border border-white/40'
                    : 'text-gray-600 hover:bg-white/40 hover:backdrop-blur-md hover:border hover:border-white/30 rounded-full'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Vector Image - Selalu di bawah */}
        <div className="flex justify-center p-2 mt-auto">
          <img 
            src="/vect.png" 
            alt="Vector Illustration" 
            className="w-full max-w-xs h-auto object-contain rounded-2xl"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar - Tidak full width, mulai setelah sidebar */}
        <nav className="px-10 py-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Text Documents di navbar paling kiri (mepet sidebar) */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Penerima BBM bersubsidi</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:shadow-lg transition-all">
              <Upload className="w-4 h-8" />
              <span>Upload</span>
            </button>

            {/* Nama dan Avatar */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                N
              </div>
              <span className="text-gray-700 font-medium">Najmi Umar Fauzi</span>
            </div>
          </div>
        </nav>

        {/* Main Content - Glass effect */}
        <div className="flex-1 px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 h-full">
            {/* Header dengan Search, Sinkron, dan Download */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari data..."
                  className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/80 transition-all border border-white/30 w-80"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sinkron</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Tabel */}
            <div className="bg-white/50 rounded-2xl border border-white/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/70">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kuota</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Kuota</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis BBM</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kendaraan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merek</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warna</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/30">
                    <tr className="hover:bg-white/30 transition-all">
                      <td className="px-4 py-3 text-sm text-gray-700">1</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">B 1234 ABC</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Ahmad Rizki</td>
                      <td className="px-4 py-3 text-sm text-gray-700">50 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">35 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Pertalite</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Motor</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Honda</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Merah</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2020</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/30 transition-all">
                      <td className="px-4 py-3 text-sm text-gray-700">2</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">B 5678 DEF</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Siti Nurhaliza</td>
                      <td className="px-4 py-3 text-sm text-gray-700">40 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">28 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Pertamax</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Mobil</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Toyota</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Putih</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2019</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/30 transition-all">
                      <td className="px-4 py-3 text-sm text-gray-700">3</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">B 9012 GHI</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Budi Santoso</td>
                      <td className="px-4 py-3 text-sm text-gray-700">60 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">45 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Solar</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Truk</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Mitsubishi</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Biru</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2018</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/30 transition-all">
                      <td className="px-4 py-3 text-sm text-gray-700">4</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">B 3456 JKL</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Maya Sari</td>
                      <td className="px-4 py-3 text-sm text-gray-700">45 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">30 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Pertalite</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Motor</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Yamaha</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Hitam</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2021</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/30 transition-all">
                      <td className="px-4 py-3 text-sm text-gray-700">5</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">B 7890 MNO</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Dedi Kusuma</td>
                      <td className="px-4 py-3 text-sm text-gray-700">55 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">40 L</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Pertamax</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Mobil</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Honda</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Silver</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2022</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageDashboard;