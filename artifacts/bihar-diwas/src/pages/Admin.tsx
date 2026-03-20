import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Users, Copy, Check, LogOut, Loader2 } from "lucide-react";
import { useAdminVerify, useAdminGetRechargeRequests } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { mutate: verifyAdmin, isPending: isVerifying } = useAdminVerify({
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          setToken(password);
          toast({ title: "Welcome back", description: "Admin access granted." });
        }
      },
      onError: (err: any) => {
        toast({
          title: "Access Denied",
          description: err?.error || "Incorrect password.",
          variant: "destructive"
        });
      }
    }
  });

  const { data, isLoading, refetch } = useAdminGetRechargeRequests(
    { password: token || "" },
    { query: { enabled: !!token, retry: false } }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    verifyAdmin({ data: { password } });
  };

  const handleCopy = () => {
    if (!data?.requests) return;
    const numbers = data.requests.map(r => r.mobileNumber).join(", ");
    navigator.clipboard.writeText(numbers).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: `${data.requests.length} numbers copied to clipboard.` });
    });
  };

  const handleLogout = () => {
    setToken(null);
    setPassword("");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Secure Login</h1>
          <p className="text-center text-gray-500 mb-8 font-medium">
            Enter password to access submissions
            <br/>
            <span className="text-sm">प्रवेश के लिए पासवर्ड दर्ज करें</span>
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Password / पासवर्ड</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isVerifying || !password}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login / लॉग इन"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Shield className="w-6 h-6" />
            Bihar Diwas Admin
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
              <Users className="w-6 h-6 text-primary" />
              Recharge Requests
            </h1>
            <p className="text-gray-500 mt-1">Total Submissions: {data?.total || 0}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Refresh
            </button>
            <button
              onClick={handleCopy}
              disabled={!data?.requests?.length}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy All Numbers"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading records...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Sr No</th>
                    <th className="px-6 py-4">Mobile Number</th>
                    <th className="px-6 py-4">Referred By</th>
                    <th className="px-6 py-4">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.requests?.length ? (
                    data.requests.map((req, i) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-medium">#{data.total - i}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{req.mobileNumber}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {req.referredBy ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {req.referredBy}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(req.submittedAt).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No submissions found yet.
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
