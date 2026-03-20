// In-memory data store — no database required
// All data lives here while the server is running

export interface RechargeRequest {
  id: number;
  mobileNumber: string;
  referredBy: string | null;
  submittedAt: string;
}

let nextId = 1;
const requests: RechargeRequest[] = [];

export const store = {
  getAll(): RechargeRequest[] {
    return [...requests].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  findByNumber(mobileNumber: string): RechargeRequest | undefined {
    return requests.find((r) => r.mobileNumber === mobileNumber);
  },

  add(mobileNumber: string, referredBy?: string): RechargeRequest {
    const entry: RechargeRequest = {
      id: nextId++,
      mobileNumber,
      referredBy: referredBy ?? null,
      submittedAt: new Date().toISOString(),
    };
    requests.push(entry);
    return entry;
  },

  count(): number {
    return requests.length;
  },
};
