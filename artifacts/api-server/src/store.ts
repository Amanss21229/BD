export interface ChatRequest {
  id: number;
  profileId: number;
  profileName: string;
  profileGender: "male" | "female";
  userGender: "male" | "female";
  whatsappNumber: string | null;
  mobileNumber: string | null;
  submittedAt: string;
}

export interface CustomProfile {
  id: number;
  name: string;
  age: number;
  city: string;
  gender: "male" | "female";
  bio: string;
  photos: string[];
  addedAt: string;
}

interface LiveSession {
  gender: "male" | "female";
  lastSeen: number;
}

interface DailyCount {
  male: number;
  female: number;
}

let nextChatId = 1;
const chatRequests: ChatRequest[] = [];

let nextProfileId = 201;
const customProfiles: CustomProfile[] = [];

// sessionId -> LiveSession (heartbeat-based presence tracking)
const liveSessions = new Map<string, LiveSession>();

// "YYYY-MM-DD" -> { male, female } visit counts
const dailyVisits = new Map<string, DailyCount>();

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export const store = {
  getAll(): ChatRequest[] {
    return [...chatRequests].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  add(data: Omit<ChatRequest, "id" | "submittedAt">): ChatRequest {
    const entry: ChatRequest = {
      ...data,
      id: nextChatId++,
      submittedAt: new Date().toISOString(),
    };
    chatRequests.push(entry);
    return entry;
  },

  count(): number {
    return chatRequests.length;
  },
};

export const profileStore = {
  getAll(): CustomProfile[] {
    return [...customProfiles];
  },

  add(data: Omit<CustomProfile, "id" | "addedAt">): CustomProfile {
    const entry: CustomProfile = {
      ...data,
      id: nextProfileId++,
      addedAt: new Date().toISOString(),
    };
    customProfiles.push(entry);
    return entry;
  },
};

// Sessions are considered "live" if heartbeat was within last 90 seconds
const LIVE_TIMEOUT_MS = 90_000;

export const statsStore = {
  heartbeat(sessionId: string, gender: "male" | "female"): void {
    const isNew = !liveSessions.has(sessionId);
    liveSessions.set(sessionId, { gender, lastSeen: Date.now() });

    if (isNew) {
      const key = todayKey();
      const day = dailyVisits.get(key) ?? { male: 0, female: 0 };
      if (gender === "male") day.male++;
      else day.female++;
      dailyVisits.set(key, day);
    }
  },

  getLive(): { male: number; female: number; total: number } {
    const cutoff = Date.now() - LIVE_TIMEOUT_MS;
    let male = 0;
    let female = 0;
    for (const [, session] of liveSessions) {
      if (session.lastSeen >= cutoff) {
        if (session.gender === "male") male++;
        else female++;
      }
    }
    return { male, female, total: male + female };
  },

  getDailyVisits(): Array<{ date: string; male: number; female: number; total: number }> {
    const rows: Array<{ date: string; male: number; female: number; total: number }> = [];
    for (const [date, counts] of dailyVisits) {
      rows.push({ date, male: counts.male, female: counts.female, total: counts.male + counts.female });
    }
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  },
};
