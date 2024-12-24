'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';
import { cn } from "@/lib/utils";

const accountSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name is required'),
  companySize: z.string().min(1, 'Please select company size'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501+ employees'
];

interface AccountFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function AccountForm({ onSubmit, initialData }: AccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      acceptTerms: false,
      ...initialData
    }
  });

  const password = watch('password');

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            {...register('firstName')}
            className={cn(
              "mt-1",
              errors.firstName && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-destructive">{errors.firstName?.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            {...register('lastName')}
            className={cn(
              "mt-1",
              errors.lastName && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-destructive">{errors.lastName?.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Work Email</Label>
        <Input 
          {...register('email')}
          type="email"
          className={cn(
            "mt-1",
            errors.email && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="company">Company Name</Label>
        <Input 
          {...register('company')}
          className={cn(
            "mt-1",
            errors.company && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-destructive">{errors.company.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="companySize">Company Size</Label>
        <Select 
          onValueChange={(value) => setValue('companySize', value)}
          defaultValue=""
        >
          <SelectTrigger 
            className={cn(
              "mt-1",
              errors.companySize && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_SIZES.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.companySize && (
          <p className="mt-1 text-sm text-destructive">{errors.companySize.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={cn(
                "mt-1 pr-10",
                errors.password && "border-destructive focus-visible:ring-destructive"
              )}
              onChange={(e) => {
                register('password').onChange(e);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
          <Progress value={passwordStrength} className="mt-2 h-2" />
          <p className="mt-1 text-sm text-muted-foreground">
            Password strength: {passwordStrength === 100 ? 'Strong' : passwordStrength >= 60 ? 'Medium' : 'Weak'}
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input 
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              className={cn(
                "mt-1 pr-10",
                errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="acceptTerms"
          checked={watch('acceptTerms')}
          onCheckedChange={(checked) => {
            setValue('acceptTerms', checked as true, {
              shouldValidate: true
            });
          }}
          className={cn(errors.acceptTerms && "border-destructive")}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="acceptTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Continue
      </Button>
    </form>
  );
} 