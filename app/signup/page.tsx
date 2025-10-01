"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, set, get, child, query, orderByChild, equalTo } from "firebase/database";
import { app } from "@/lib/firebase";
import { Eye, EyeOff, ArrowLeft, User, Shield, Mail, Lock } from "lucide-react";
import { withoutAuth } from "@/lib/authguard";

const db = getDatabase(app);

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "operator" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    // Validasi form
    if (!selectedRole) {
      setError("Silakan pilih peran Anda terlebih dahulu");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Nama lengkap harus diisi");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      // SIGN UP: cek apakah email sudah terdaftar
      const dbRef = ref(db);
      const snapshot = await get(
        query(child(dbRef, "users"), orderByChild("email"), equalTo(email))
      );

      if (snapshot.exists()) {
        setError("Email sudah terdaftar. Gunakan email lain.");
        return;
      }

      // Simpan user baru dengan status belum di-approve
      const newUserId = crypto.randomUUID();
      await set(ref(db, "users/" + newUserId), {
        name: name.trim(),
        email,
        password,
        role: selectedRole,
        isApproved: false,
        createdAt: new Date().toISOString(),
      });

      setError("Registrasi berhasil! Tunggu persetujuan admin sebelum dapat login.");
      
      // Reset form setelah berhasil
      setTimeout(() => {
        setName("");
        setEmail("");
        setPassword("");
        setSelectedRole(null);
        setError(null);
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <img src="/Platif-AI-white.png" alt="Logo Platif-AI" className="w-auto h-12" />
          </div>
          
          <h2 className="text-5xl font-bold mb-4">For Fuel Subsidy</h2>
          <p className="text-xl text-teal-100 leading-relaxed">
            Platify menghadirkan solusi cerdas berbasis IoT dan Computer Vision 
            untuk memvalidasi kendaraan penerima BBM bersubsidi secara 
            otomatis, akurat, dan real-time di SPBU
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-teal-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-2">Sign Up</h3>
            <p className="text-gray-500 text-center mb-8">Daftar akun baru</p>

            {/* Role Selection */}
            <div className="mb-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                    selectedRole === "admin"
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                      selectedRole === "admin" ? "bg-teal-100" : "bg-gray-100"
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <span className="font-medium">ADMIN</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("operator")}
                  className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                    selectedRole === "operator"
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                      selectedRole === "operator" ? "bg-teal-100" : "bg-gray-100"
                    }`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <span className="font-medium">OPERATOR</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap:
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Masukkan Nama Lengkap"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email:
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Masukkan Email Anda"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password:
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan Password (min. 6 karakter)"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  error.includes("berhasil") 
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={loading || !selectedRole}
                onClick={handleSubmit}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Loading..." : "DAFTAR"}
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => router.push("/login")}
                className="text-gray-500 hover:text-teal-600 text-sm"
              >
                Sudah punya akun? Masuk di sini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withoutAuth(SignUpPage);