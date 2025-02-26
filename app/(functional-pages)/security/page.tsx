'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, ShieldCheck, KeyRound, Smartphone } from "lucide-react";
import Footer from '@/components/navigation/Footer';

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Security Settings</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Password Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <CardTitle>Password</CardTitle>
              </div>
              <CardDescription>Manage your password settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Change Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Require a verification code when logging in
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Biometric Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Use fingerprint or face recognition on supported devices
                    </p>
                  </div>
                  <Switch
                    checked={biometricEnabled}
                    onCheckedChange={setBiometricEnabled}
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!twoFactorEnabled}
                  >
                    Setup Two-Factor Authentication
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Login History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Account Activity</CardTitle>
              </div>
              <CardDescription>Recent login activity on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left font-medium">Device</th>
                        <th className="px-4 py-3 text-left font-medium">Location</th>
                        <th className="px-4 py-3 text-left font-medium">IP Address</th>
                        <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3">Chrome on MacOS</td>
                        <td className="px-4 py-3">San Francisco, USA</td>
                        <td className="px-4 py-3">192.168.1.1</td>
                        <td className="px-4 py-3">Today, 2:30 PM</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Safari on iPhone</td>
                        <td className="px-4 py-3">San Francisco, USA</td>
                        <td className="px-4 py-3">192.168.1.2</td>
                        <td className="px-4 py-3">Yesterday, 4:15 PM</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Firefox on Windows</td>
                        <td className="px-4 py-3">New York, USA</td>
                        <td className="px-4 py-3">192.168.1.3</td>
                        <td className="px-4 py-3">July 21, 2023, 9:40 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="link" className="px-0">View All Activity</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
} 