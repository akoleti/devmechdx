'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

type InvitationStatus = 'loading' | 'valid' | 'invalid' | 'expired' | 'accepted' | 'error';

export default function InvitationPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { data: session, status: sessionStatus, update } = useSession();
  const { toast } = useToast();
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus>('loading');
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  // Check the invitation when the page loads
  useEffect(() => {
    const checkInvitation = async () => {
      try {
        console.log(`Checking invitation with token: ${params.token}`);
        const response = await fetch(`/api/invitations/${params.token}`);
        const data = await response.json();

        console.log('Invitation check response:', data);

        if (!response.ok) {
          setInvitationStatus(data.error === 'Invitation expired' ? 'expired' : 'invalid');
          setError(data.error || 'Invalid invitation');
          return;
        }

        setInvitation(data.invitation);
        setInvitationStatus('valid');
      } catch (error) {
        console.error('Error checking invitation:', error);
        setInvitationStatus('error');
        setError('An unexpected error occurred while verifying the invitation. Please try again.');
      }
    };

    if (params.token) {
      checkInvitation();
    }
  }, [params.token]);

  // Handle invitation acceptance
  const acceptInvitation = async () => {
    try {
      // Check if logged in
      if (sessionStatus !== 'authenticated') {
        console.log('User not authenticated, redirecting to login');
        // Save the token in localStorage and redirect to login
        localStorage.setItem('pendingInvitation', params.token);
        router.push(`/login?callbackUrl=/invitations/${params.token}`);
        return;
      }

      setIsAccepting(true);
      console.log(`Accepting invitation with token: ${params.token}`);

      const response = await fetch(`/api/invitations/${params.token}/accept`, {
        method: 'POST',
      });

      const data = await response.json();
      console.log('Invitation acceptance response:', data);

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation.');
        setIsAccepting(false);
        return;
      }

      // Update session with new organization if needed
      console.log('Invitation acceptance response data:', data);
      
      if (!data.organization || !data.role) {
        console.error('Missing organization or role data in response:', data);
        setError('The server response is missing required data. Please contact support.');
        setIsAccepting(false);
        return;
      }
      
      console.log('Updating session with organization:', data.organization, 'and role:', data.role);
      
      try {
        // Ensure we're passing a valid object to the update function
        const updatePayload = {
          currentOrganization: {
            id: data.organization.id,
            name: data.organization.name
          },
          currentRole: data.role
        };
        
        console.log('Session update payload:', updatePayload);
        await update(updatePayload);
        console.log('Session updated successfully');
      } catch (updateError) {
        console.error('Error updating session:', updateError);
        // Continue with acceptance even if session update fails
        // The user can manually switch to the organization later
      }

      setInvitationStatus('accepted');
      
      // Show a success message
      toast({
        title: "Success!",
        description: `You have successfully joined ${data.organization.name}.`,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      // Redirect to dashboard after a short delay
      console.log('Redirecting to dashboard in 2 seconds');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      let errorMessage = 'An unexpected error occurred while accepting the invitation.';
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      setError(errorMessage);
      setIsAccepting(false);
    }
  };

  // Decline the invitation
  const declineInvitation = async () => {
    try {
      await fetch(`/api/invitations/${params.token}/decline`, {
        method: 'POST',
      });
      router.push('/');
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  if (invitationStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl font-medium">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {invitationStatus === 'valid' && "Organization Invitation"}
            {invitationStatus === 'invalid' && "Invalid Invitation"}
            {invitationStatus === 'expired' && "Expired Invitation"}
            {invitationStatus === 'accepted' && "Invitation Accepted"}
            {invitationStatus === 'error' && "Error"}
          </CardTitle>
          <CardDescription>
            {invitationStatus === 'valid' && invitation && (
              <>You've been invited to join {invitation.organization?.name}</>
            )}
            {invitationStatus === 'invalid' && "This invitation link is invalid or has already been used."}
            {invitationStatus === 'expired' && "This invitation has expired."}
            {invitationStatus === 'accepted' && "You have successfully joined the organization."}
            {invitationStatus === 'error' && "There was an error processing your invitation."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {invitationStatus === 'valid' && invitation && (
            <div>
              <p className="mb-4">
                <strong>{invitation.invitedBy?.name || 'A team member'}</strong> has invited you to join their organization.
              </p>
              
              {invitation.message && (
                <div className="bg-muted/40 p-4 rounded-md mb-4">
                  <p className="text-sm italic">&quot;{invitation.message}&quot;</p>
                </div>
              )}
              
              <p className="mb-4">
                You'll be given the role of <strong>{invitation.role.toLowerCase()}</strong> in this organization.
              </p>
              
              {sessionStatus !== 'authenticated' && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    You need to sign in or create an account to accept this invitation.
                    You'll be redirected to the login page when you click "Accept".
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {(invitationStatus === 'invalid' || invitationStatus === 'expired' || invitationStatus === 'error') && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {invitationStatus === 'invalid' && "Invalid Invitation"}
                {invitationStatus === 'expired' && "Expired Invitation"}
                {invitationStatus === 'error' && "Error"}
              </AlertTitle>
              <AlertDescription>
                {error || "This invitation link is no longer valid. Please contact the organization administrator for a new invitation."}
              </AlertDescription>
            </Alert>
          )}
          
          {invitationStatus === 'accepted' && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                You have successfully joined the organization. Redirecting you to the dashboard...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          {invitationStatus === 'valid' && (
            <>
              <Button 
                variant="outline" 
                onClick={declineInvitation}
                disabled={isAccepting}
              >
                Decline
              </Button>
              <Button 
                onClick={acceptInvitation}
                disabled={isAccepting}
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </Button>
            </>
          )}
          
          {(invitationStatus === 'invalid' || invitationStatus === 'expired' || invitationStatus === 'error') && (
            <Button onClick={() => router.push('/')}>
              Return to Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 