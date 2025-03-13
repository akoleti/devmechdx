'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function InvitationDebugPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [message, setMessage] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [endpoint, setEndpoint] = useState('/api/organizations/{id}/invite');

  const testDebugEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role, message }),
      });

      const data = await response.json();
      setResult({
        ...data,
        status: response.status,
        statusText: response.statusText,
        endpoint: '/api/debug/invitation',
      });
      
      toast({
        title: 'Debug request sent',
        description: `Status: ${response.status} ${response.statusText}`,
      });
    } catch (error: any) {
      setResult({
        error: error.message,
        endpoint: '/api/debug/invitation',
      });
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testInviteEndpoint = async () => {
    if (!organizationId) {
      toast({
        title: 'Error',
        description: 'Organization ID is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Choose which endpoint to use
      const actualEndpoint = endpoint.replace('{id}', organizationId);
      const response = await fetch(actualEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role, message }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Failed to parse response as JSON' };
      }

      setResult({
        ...data,
        status: response.status,
        statusText: response.statusText,
        endpoint: actualEndpoint,
      });
      
      if (response.ok) {
        toast({
          title: 'Invitation sent',
          description: `Status: ${response.status} ${response.statusText}`,
        });
      } else {
        toast({
          title: 'Error',
          description: `Status: ${response.status} ${data.error || response.statusText}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setResult({
        error: error.message,
        endpoint: endpoint.replace('{id}', organizationId),
      });
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Invitation API Debug Tool</CardTitle>
          <CardDescription>
            Use this page to test the invitation API endpoints and diagnose issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Select
              value={endpoint}
              onValueChange={setEndpoint}
            >
              <SelectTrigger id="endpoint">
                <SelectValue placeholder="Select Endpoint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/api/organizations/{id}/invite">Old: /api/organizations/&#123;id&#125;/invite</SelectItem>
                <SelectItem value="/api/organizations/{id}/invitations">New: /api/organizations/&#123;id&#125;/invitations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="organizationId">Organization ID</Label>
            <Input
              id="organizationId"
              placeholder="Enter organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={setRole}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Enter optional message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={testDebugEndpoint} disabled={loading}>
            Test Debug Endpoint
          </Button>
          <Button onClick={testInviteEndpoint} disabled={loading}>
            Test Invitation Endpoint
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Result</CardTitle>
            <CardDescription>
              Endpoint: {result.endpoint}<br />
              Status: {result.status} {result.statusText}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 