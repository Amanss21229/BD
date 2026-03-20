import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rechargeRequestsTable = pgTable("recharge_requests", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull().unique(),
  referredBy: text("referred_by"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertRechargeRequestSchema = createInsertSchema(rechargeRequestsTable).omit({ id: true, submittedAt: true });
export type InsertRechargeRequest = z.infer<typeof insertRechargeRequestSchema>;
export type RechargeRequest = typeof rechargeRequestsTable.$inferSelect;
