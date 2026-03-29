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

let nextChatId = 1;
const chatRequests: ChatRequest[] = [];

let nextProfileId = 201;
const customProfiles: CustomProfile[] = [];

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
