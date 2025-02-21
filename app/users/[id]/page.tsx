import UserDisplay from '@/components/UserDisplay'

export default function UserPage({ params }: { params: { id: string } }) {
  return <UserDisplay userId={params.id} />
} 