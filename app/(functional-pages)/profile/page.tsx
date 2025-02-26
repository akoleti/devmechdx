'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Building, Calendar } from "lucide-react";
import Footer from '@/components/navigation/Footer';

export default function ProfilePage() {
  const { data: session } = useSession();
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/images/placeholder-user.jpg" alt="Profile" />
                <AvatarFallback>{session?.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
              <p className="text-gray-500 mb-4">{session?.user?.email || 'email@example.com'}</p>
              <div className="w-full mt-4">
                <Button className="w-full">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-md">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{session?.user?.name || 'User Name'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{session?.user?.email || 'email@example.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <Building className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Primary Organization</p>
                    <p className="font-medium">{session?.user?.currentOrganization?.name || 'No organization selected'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">January 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <Button variant="outline">Change Password</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
} 