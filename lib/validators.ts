import { z } from "zod";

// schema for inserting a demo
export const insertDemoSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    numberOfEmployees: z.number().min(1, { message: "Number of employees must be at least 1" }),
    organizationName: z.string().min(1, { message: "Organization name is required" }),
});

// schema for inserting a user
export const signInFormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
