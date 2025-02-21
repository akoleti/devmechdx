import { z } from "zod";
import { insertDemoSchema } from "@/lib/validators";




export type Demo = z.infer<typeof insertDemoSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type DemoInsert = Omit<Demo, "id" | "createdAt" | "updatedAt">;