import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MapPin, CheckCircle2, X, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { femaleProfiles, maleProfiles, type Profile } from "@/data/profiles";
import { indiaFemaleProfiles } from "@/data/profiles-india";

type Step = "age" | "gender" | "feed";
type UserGender = "male" | "female";

interface ChatModalState {
  profile: Profile;
}

interface SuccessState {
  profile: Profile;
}

interface ApiProfile {
  id: number;
  name: string;
  age: number;
  city: string;
  gender: "male" | "female";
  bio: string;
  photos: string[];
}

export default function Home() {
  const [step, setStep] = useState<Step>("age");
  const [userGender, setUserGender] = useState<UserGender | null>(null);
  const [chatModal, setChatModal] = useState<ChatModalState | null>(null);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactType, setContactType] = useState<"whatsapp" | "mobile">("whatsapp");
  const [error, setError] = useState("");
  const [photoIndexes, setPhotoIndexes] = useState<Record<number, number>>({});
  const [customProfiles, setCustomProfiles] = useState<Profile[]>([]);
  const sessionId = useRef<string>(Math.random().toString(36).slice(2) + Date.now().toString(36));

  const allFemaleProfiles: Profile[] = [...femaleProfiles, ...indiaFemaleProfiles];
  const allMaleProfiles: Profile[] = [...maleProfiles];

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.ok ? r.json() : { profiles: [] })
      .then((data) => {
        if (Array.isArray(data.profiles)) {
          setCustomProfiles(data.profiles.map((p: ApiProfile) => ({
            id: p.id,
            name: p.name,
            age: p.age,
            city: p.city,
            gender: p.gender,
            bio: p.bio,
            photos: p.photos,
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (step !== "feed" || !userGender) return;
    const ping = () => {
      fetch("/api/stats/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, gender: userGender }),
      }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 30_000);
    return () => clearInterval(interval);
  }, [step, userGender]);

  const adminFemale = customProfiles.filter((p) => p.gender === "female");
  const adminMale = customProfiles.filter((p) => p.gender === "male");

  const profiles =
    userGender === "male"
      ? [...adminFemale, ...allFemaleProfiles]
      : [...adminMale, ...allMaleProfiles];

  const handleAgeConfirm = () => setStep("gender");
  const handleAgeDecline = () => {
    window.location.href = "https://google.com";
  };

  const handleGenderSelect = (g: UserGender) => {
    setUserGender(g);
    setStep("feed");
  };

  const openChatModal = (profile: Profile) => {
    setChatModal({ profile });
    setWhatsappNumber("");
    setMobileNumber("");
    setError("");
    setContactType("whatsapp");
  };

  const closeChatModal = () => {
    setChatModal(null);
    setError("");
  };

  const handleSubmitRequest = async () => {
    const num = contactType === "whatsapp" ? whatsappNumber : mobileNumber;
    if (!/^[6-9]\d{9}$/.test(num)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!chatModal || !userGender) return;

    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/chat-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: chatModal.profile.id,
          profileName: chatModal.profile.name,
          profileGender: chatModal.profile.gender,
          userGender,
          whatsappNumber: contactType === "whatsapp" ? num : null,
          mobileNumber: contactType === "mobile" ? num : null,
        }),
      });
      if (!res.ok) {
        let errorMsg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // server returned non-JSON
        }
        throw new Error(errorMsg);
      }
      setSuccessState({ profile: chatModal.profile });
      setChatModal(null);
    } catch (err: any) {
      setError(err.message || "Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `💕 Meet amazing people near you! Join this dating app and find your perfect match.\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const nextPhoto = (profileId: number, total: number) => {
    setPhotoIndexes(prev => ({ ...prev, [profileId]: ((prev[profileId] ?? 0) + 1) % total }));
  };
  const prevPhoto = (profileId: number, total: number) => {
    setPhotoIndexes(prev => ({ ...prev, [profileId]: ((prev[profileId] ?? 0) - 1 + total) % total }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <AnimatePresence mode="wait">
        {step === "age" && (
          <motion.div
            key="age"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-sm w-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-pink-500/40"
              >
                <Heart className="w-12 h-12 text-white fill-white" />
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome</h1>
                <p className="text-gray-500 text-lg mb-2">Find your perfect match ❤️</p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
                  <p className="text-amber-800 font-semibold text-lg">Age Verification</p>
                  <p className="text-amber-700 mt-1">This platform is for adults only. Please confirm you are 18 years or older.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAgeConfirm}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Yes, I am 18+ ✓
                  </button>
                  <button
                    onClick={handleAgeDecline}
                    className="w-full py-4 bg-gray-100 text-gray-500 font-semibold text-lg rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    No, I am under 18
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === "gender" && (
          <motion.div
            key="gender"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-sm w-full text-center">
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">I am a...</h2>
                <p className="text-gray-500 mb-10">Select your gender to see matching profiles</p>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  onClick={() => handleGenderSelect("male")}
                  className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl border-2 border-blue-100 shadow-lg hover:border-blue-400 hover:shadow-blue-200 hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 group"
                >
                  <span className="text-6xl">👨</span>
                  <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Man</span>
                  <span className="text-xs text-gray-400">See Girls</span>
                </motion.button>
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                  onClick={() => handleGenderSelect("female")}
                  className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl border-2 border-pink-100 shadow-lg hover:border-pink-400 hover:shadow-pink-200 hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 group"
                >
                  <span className="text-6xl">👩</span>
                  <span className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">Woman</span>
                  <span className="text-xs text-gray-400">See Boys</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "feed" && (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="bg-white/80 backdrop-blur-lg border-b border-pink-100 sticky top-0 z-20">
              <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span className="text-xl font-bold text-gray-900">DilMil</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {profiles.length} profiles online
                </div>
              </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {userGender === "male" ? "Girls near you 💕" : "Boys near you 💙"}
                </h2>
                <p className="text-gray-500 text-sm">Scroll to explore profiles</p>
              </div>

              <div className="grid gap-5">
                {profiles.map((profile, idx) => {
                  const photoIdx = photoIndexes[profile.id] ?? 0;
                  return (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
                    >
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src={profile.photos[photoIdx]}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {profile.photos.length > 1 && (
                          <>
                            <button
                              onClick={() => prevPhoto(profile.id, profile.photos.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => nextPhoto(profile.id, profile.photos.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {profile.photos.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all ${i === photoIdx ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
                              ))}
                            </div>
                          </>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">Online</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{profile.name}, {profile.age}</h3>
                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {profile.city}
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-2xl shrink-0">
                            {profile.gender === "female" ? "👩" : "👨"}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{profile.bio}</p>
                        <button
                          onClick={() => openChatModal(profile)}
                          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Send Chat Request
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeChatModal(); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative">
                <button onClick={closeChatModal} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4">
                  <img src={chatModal.profile.photos[0]} alt={chatModal.profile.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/40" />
                  <div>
                    <h3 className="text-xl font-bold">{chatModal.profile.name}</h3>
                    <p className="text-pink-100 text-sm">{chatModal.profile.city} · Age {chatModal.profile.age}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 font-medium mb-5">Enter your contact so <span className="text-pink-600 font-bold">{chatModal.profile.name.split(" ")[0]}</span> can reach you:</p>

                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setContactType("whatsapp")}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border-2 transition-all ${contactType === "whatsapp" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    <span>📱</span> WhatsApp
                  </button>
                  <button
                    onClick={() => setContactType("mobile")}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border-2 transition-all ${contactType === "mobile" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    <Phone className="w-4 h-4" /> Calling
                  </button>
                </div>

                {contactType === "whatsapp" ? (
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Your WhatsApp Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={whatsappNumber}
                      onChange={(e) => { setWhatsappNumber(e.target.value.replace(/\D/g, "")); setError(""); }}
                      placeholder="10-digit WhatsApp number"
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg font-semibold placeholder:text-gray-400 placeholder:font-normal focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all outline-none"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Your Mobile Number for Calling</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => { setMobileNumber(e.target.value.replace(/\D/g, "")); setError(""); }}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg font-semibold placeholder:text-gray-400 placeholder:font-normal focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 transition-all outline-none"
                    />
                  </div>
                )}

                {error && <p className="text-red-500 text-sm mb-3 font-medium">{error}</p>}

                <button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-pink-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none transition-all"
                >
                  {isSubmitting ? "Sending..." : "Send Request 💌"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-center"
            >
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl"
                >
                  <CheckCircle2 className="w-10 h-10 text-pink-500" />
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Request Sent! 🎉</h3>
                <p className="text-gray-500 mb-6">
                  Your chat request to <span className="font-bold text-gray-800">{successState.profile.name.split(" ")[0]}</span> has been sent successfully!
                </p>

                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-5 mb-6 border border-pink-100 text-left space-y-3">
                  <p className="font-bold text-gray-800 text-center mb-2">Get a faster reply! ⚡</p>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔔</span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-bold text-pink-600">Share with 3 friends</span> to get a reply within <span className="font-bold">12 hours</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-bold text-rose-600">Share with 5 friends</span> to get a reply within <span className="font-bold">6 hours</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="w-full py-4 bg-[#25D366] text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all mb-3"
                >
                  <Share2 className="w-5 h-5" />
                  Share on WhatsApp
                </button>
                <button
                  onClick={() => setSuccessState(null)}
                  className="w-full py-3.5 bg-gray-100 text-gray-600 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Continue Exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
