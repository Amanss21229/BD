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

let nextId = 1;
const chatRequests: ChatRequest[] = [];

export const store = {
  getAll(): ChatRequest[] {
    return [...chatRequests].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  add(data: Omit<ChatRequest, "id" | "submittedAt">): ChatRequest {
    const entry: ChatRequest = {
      ...data,
      id: nextId++,
      submittedAt: new Date().toISOString(),
    };
    chatRequests.push(entry);
    return entry;
  },

  count(): number {
    return chatRequests.length;
  },
};
