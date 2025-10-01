"use client"

import React, { useState, useEffect } from 'react';
import { Camera, Database, CheckCircle, Zap, Menu, X, ArrowRight, Star } from 'lucide-react';

const PlatifAILanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Camera className="w-12 h-12 text-white" />,
      title: "Validasi Kendaraan Otomatis",
      description: "Sistem membaca plat nomor kendaraan dengan AI secara Real-time",
      color: "from-emerald-400 to-teal-600"
    },
    {
      icon: <Database className="w-12 h-12 text-white" />,
      title: "Terintegrasi Database Nasional",
      description: "Data kendaraan tersinkronisasi dengan basis data penerima subsidi",
      color: "from-blue-400 to-indigo-600"
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-white" />,
      title: "Akurat & Transparan",
      description: "Memastikan hanya kendaraan berhak yang dapat mengakses BBM bersubsidi",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: <Zap className="w-12 h-12 text-white" />,
      title: "Efisiensi Operasional SPBU",
      description: "Mempercepat layanan tanpa pencatatan manual oleh petugas",
      color: "from-yellow-400 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-600 to-teal-800 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/Platif-AI-white.png" alt="Logo Platif-AI" className="w-auto h-12" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-emerald-300 transition-colors duration-300 text-xl font-medium">Home</a>
            <a href="#" className="hover:text-emerald-300 transition-colors duration-300 text-xl font-medium">About</a>
            <a href="/login" className="bg-white text-slate-900 px-6 pt-1 pb-2 rounded-full font-semibold text-xl hover:bg-emerald-300 transform transition-all duration-300">
              Login
            </a>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 p-6">
            <div className="flex flex-col space-y-4">
              <a href="#" className="hover:text-emerald-300 transition-colors duration-300">Home</a>
              <a href="#" className="hover:text-emerald-300 transition-colors duration-300">About</a>
              <button className="bg-white text-slate-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 w-fit">
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">
                  Solusi Cerdas
                </span>
                <br />
                <span className=" text-white">
                  Validasi Kendaraan
                </span>
                <br />
                <span className="text-white">
                  BBM Bersubsidi
                </span>
              </h1>
              
              <p className="text-xl text-white font-medium leading-relaxed">
                Validasi kendaraan penerima BBM bersubsidi dengan teknologi AI yang dapat menegenali plat nomor kendaraan secara otomatis, akurat, dan real-time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Button Utama */}
              <button className="group bg-gradient-to-r from-emerald-400 to-teal-400 px-8 py-4 rounded-full font-semibold text-lg text-slate-900 hover:from-emerald-500 hover:to-teal-500 transform hover:scale-103 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg">
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Button Sekunder */}
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-300 hover:text-slate-900 transition-all duration-300">
                Lihat Demo
              </button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white font-medium">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span>99.9% Akurasi</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Real-time Processing</span>
              </div>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="relative">
            <img src="/vectt.png" alt='"Designed by macrovector / Freepik"http://www.freepik.com"' className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-10 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                Fitur Unggulan
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Teknologi terdepan untuk validasi kendaraan yang efisien dan akurat
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-teal-400 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-10 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                Siap Mengoptimalkan SPBU Anda?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bergabunglah dengan ratusan SPBU yang telah merasakan efisiensi dan akurasi validasi kendaraan dengan Platif-AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-teal-600 to-teal-800 px-8 py-4 rounded-full font-semibold text-lg text-white hover:from-teal-700 hover:to-teal-900 transform hover:scale-105 transition-all duration-300">
                Mulai Sekarang
              </button>
              
              <button className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-600 hover:text-white transition-all duration-300">
                Konsultasi Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img src="/Platif-AI-white.png" alt="Logo Platif-AI" className="w-auto h-8" />
          </div>
          
          <p className="mb-6">
            Validasi kendaraan penerima BBM bersubsidi dengan teknologi AI yang dapat menegenali plat nomor kendaraan secara otomatis, akurat, dan real-time.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Contact</a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-sm">
            © 2025 Platif-AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlatifAILanding;