import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Heart, Download, RefreshCw, LogOut, Loader2, MessageCircle } from "lucide-react";

interface ChatRequest {
  id: number;
  profileName: string;
  profileGender: string;
  userGender: string;
  whatsappNumber: string | null;
  mobileNumber: string | null;
  submittedAt: string;
}

interface RequestsData {
  requests: ChatRequest[];
  total: number;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authedPassword, setAuthedPassword] = useState<string | null>(null);
  const [data, setData] = useState<RequestsData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = async (pw: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/chat-requests?password=${encodeURIComponent(pw)}`);
      if (!res.ok) throw new Error("Unauthorized");
      const json = await res.json();
      setData(json);
    } catch {
      setData({ requests: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }
      setAuthedPassword(password);
      await fetchRequests(password);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setAuthedPassword(null);
    setPassword("");
    setData(null);
    setError("");
  };

  const handleDownload = () => {
    if (!authedPassword) return;
    const url = `/api/admin/chat-requests/download?password=${encodeURIComponent(authedPassword)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-requests-${Date.now()}.csv`;
    a.click();
  };

  if (!authedPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-pink-100 w-full max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-center text-gray-500 mb-8">Enter your password to access chat request data</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !password}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none flex justify-center items-center gap-2"
            >
              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            DilMil Admin
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-pink-500" />
              Chat Requests
            </h1>
            <p className="text-gray-500 mt-1">Total: {data?.total ?? 0} requests</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => authedPassword && fetchRequests(authedPassword)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleDownload}
              disabled={!data?.requests?.length}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-pink-500/20 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
            <p>Loading records...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Profile</th>
                    <th className="px-6 py-4">Viewer Gender</th>
                    <th className="px-6 py-4">WhatsApp</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.requests?.length ? (
                    data.requests.map((req, i) => (
                      <tr key={req.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-medium text-sm">#{(data?.total ?? 0) - i}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{req.profileName}</span>
                          <span className="ml-2 text-xs text-gray-400">({req.profileGender})</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.userGender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                            {req.userGender === "male" ? "👨 Male" : "👩 Female"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {req.whatsappNumber ? (
                            <span className="text-green-600 font-semibold">{req.whatsappNumber}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {req.mobileNumber ? (
                            <span className="text-blue-600 font-semibold">{req.mobileNumber}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                          {new Date(req.submittedAt).toLocaleString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No chat requests yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
