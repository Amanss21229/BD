import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Share2, Smartphone, Gift, CheckCircle2, ChevronRight } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { useSubmitRechargeRequest } from "@workspace/api-client-react";

export default function Home() {
  const [shareCount, setShareCount] = useLocalStorage("biharDiwasShareCount", 0);
  const [hasClaimed, setHasClaimed] = useLocalStorage("biharDiwasClaimed", false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [refCode, setRefCode] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get("ref");
    if (ref) setRefCode(ref);
  }, []);

  const { mutate: submitRecharge, isPending } = useSubmitRechargeRequest({
    mutation: {
      onSuccess: () => {
        setHasClaimed(true);
        triggerConfetti();
        toast({
          title: "Success! / सफलता!",
          description: "Your recharge request has been submitted successfully.",
        });
      },
      onError: (err: any) => {
        toast({
          title: "Submission Failed",
          description: err?.error || "Could not process request. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF671F', '#046A38', '#FFFFFF', '#0F3CC9']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF671F', '#046A38', '#FFFFFF', '#0F3CC9']
      });
    }, 250);
  };

  const handleShare = () => {
    const siteUrl = `${window.location.origin}${window.location.pathname}?ref=${mobileNumber || 'diwas_offer'}`;
    const text = `🎉 Happy Bihar Diwas! 🎉\n\nइस संदेश को WhatsApp पर 3 अलग-अलग दोस्तों के साथ साझा करें और ₹349 का फ्री Jio मोबाइल रिचार्ज पाएं! यह ऑफ़र केवल भारत के उपयोगकर्ताओं के लिए है, विशेषकर जियो यूज़र्स।\n\nClaim here: ${siteUrl}`;
    
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");

    setTimeout(() => {
      if (shareCount < 3 && !hasClaimed) {
        setShareCount(prev => prev + 1);
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }
    submitRecharge({
      data: {
        mobileNumber,
        referredBy: refCode || undefined
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center pt-8 pb-16 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
        <img 
          src={`${import.meta.env.BASE_URL}images/festive-bg.png`} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Brand Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-primary text-primary-foreground font-bold text-3xl px-8 py-3 rounded-full shadow-xl shadow-primary/30 mb-8 border-4 border-white"
        >
          Jio
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 w-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary via-secondary/90 to-primary/90 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800&q=80')] opacity-10 bg-cover mix-blend-overlay"></div>
            <h1 className="text-4xl md:text-5xl font-display mb-3 drop-shadow-md">
              Happy Bihar Diwas!
            </h1>
            <h2 className="text-2xl md:text-3xl font-display opacity-90 drop-shadow-sm">
              बिहार दिवस की शुभकामनाएं!
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {hasClaimed ? (
                /* SUCCESS STATE */
                <motion.div 
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Request Successful!</h3>
                  <div className="space-y-4 text-muted-foreground bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="font-medium text-gray-900">
                      Thank you! If Your Referral are real and genuine, Your ₹349 recharge will be activated within 24 hours.
                    </p>
                    <div className="h-px w-16 bg-gray-200 mx-auto" />
                    <p className="text-sm font-medium">
                      धन्यवाद!अगर आपका रेफरल (Referral) असली और जेन्युइन (Real & Genuine) होगा, तो आपका ₹349 का रिचार्ज 24 घंटे के भीतर सक्रिय कर दिया जाएगा।
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* OFFER STATE */
                <motion.div 
                  key="offer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-4 mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <Gift className="w-10 h-10 text-secondary shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">
                        Share with 3 unique friends on WhatsApp and get <span className="text-secondary text-lg">₹349</span> free recharge!
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Only for Indian users, especially Jio Users.</p>
                    </div>
                  </div>
                  
                  <div className="mb-8 p-4 bg-green-50 rounded-2xl border border-green-100 text-sm">
                    <p className="font-semibold text-green-900 leading-tight mb-1">
                      इस संदेश को WhatsApp पर 3 अलग-अलग दोस्तों के साथ साझा करें और ₹349 का फ्री मोबाइल रिचार्ज पाएं!
                    </p>
                    <p className="text-green-800">यह ऑफ़र केवल भारत के उपयोगकर्ताओं के लिए है, विशेषकर जियो यूज़र्स।</p>
                  </div>

                  {shareCount < 3 ? (
                    /* SHARE ACTION */
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                          <span>Progress / प्रगति</span>
                          <span className="text-secondary font-bold">{shareCount} / 3 Shared</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-secondary to-yellow-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(shareCount / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleShare}
                        className="w-full relative group overflow-hidden rounded-2xl bg-[#25D366] text-white font-bold text-lg py-4 px-6 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgb(37,211,102,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <Share2 className="w-6 h-6 relative z-10" />
                        <span className="relative z-10">Share on WhatsApp</span>
                      </button>
                      
                      <p className="text-center text-xs text-muted-foreground font-medium">
                        Click the button above to share. Form will unlock after 3 shares.
                      </p>
                    </div>
                  ) : (
                    /* FORM ACTION */
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center font-medium border border-green-200 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Target Reached! Claim below.
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 block">
                            Mobile Number / मोबाइल नंबर
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Smartphone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              required
                              pattern="[6-9][0-9]{9}"
                              maxLength={10}
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                              className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-lg font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                              placeholder="Enter 10-digit number"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isPending || mobileNumber.length !== 10}
                          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
                        >
                          {isPending ? "Processing..." : "Get Free Recharge / फ्री रिचार्ज पाएं"}
                          {!isPending && <ChevronRight className="w-5 h-5" />}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-gray-500 font-medium">
          <p>T&C Apply. Promotional offer for Bihar Diwas.</p>
          <p className="mt-1 opacity-70">Secured via Jio Reliance </p>
        </div>
      </div>
    </div>
  );
}
