import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // SMTP Configuration
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().transform((val) => parseInt(val, 10)),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM_EMAIL: z.string().email(),
    SMTP_FROM_NAME: z.string().min(1),
    
    // Demo request notification
    DEMO_REQUEST_EMAIL: z.string().email(),
    
    // Keep AWS configuration for backward compatibility
    AWS_REGION: z.string().min(1).optional(),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_SES_FROM_EMAIL: z.string().email().optional(),
  },
  client: {},
  runtimeEnv: {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
    
    DEMO_REQUEST_EMAIL: process.env.DEMO_REQUEST_EMAIL,
    
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SES_FROM_EMAIL: process.env.AWS_SES_FROM_EMAIL,
  },
}); 