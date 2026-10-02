import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(80).optional(),
  workspaceName: z.string().trim().min(1).max(100).optional()
});

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(128)
});

const jsonObject = z.record(z.string(), z.any()).nullable().optional();

export const brandBrainSchema = z.object({
  businessName: z.string().max(150).nullable().optional(),
  niche: z.string().max(200).nullable().optional(),
  audience: z.string().max(1000).nullable().optional(),
  positioning: z.string().max(1000).nullable().optional(),
  voice: z.string().max(1000).nullable().optional(),
  goals: z.array(z.string().max(200)).max(20).optional(),
  offers: z.array(z.string().max(200)).max(20).optional(),
  competitors: z.array(z.string().max(200)).max(20).optional(),
  contentPillars: z.array(z.string().max(200)).max(20).optional(),
  websiteUrl: z.string().url().max(500).nullable().optional(),
  context: jsonObject
});

export const contentCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  type: z.enum(["POST", "VIDEO", "SCRIPT", "CAPTION", "HOOK", "IDEA", "IMAGE", "UGC"]),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "OTHER"]).nullable().optional(),
  body: z.string().max(50000).nullable().optional(),
  hook: z.string().max(2000).nullable().optional(),
  caption: z.string().max(10000).nullable().optional(),
  mediaUrl: z.string().url().max(2000).nullable().optional(),
  metadata: jsonObject,
  scheduledAt: z.coerce.date().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional()
});

export const campaignSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  goal: z.string().max(1000).nullable().optional(),
  status: z.string().max(50).optional(),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional()
});
