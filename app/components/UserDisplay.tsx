'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  // ... other user properties
}

export default function UserDisplay({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/not-found')
            return
          }
          throw new Error(data.message || 'Error fetching user')
        }

        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchUser()
  }, [userId, router])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* Render other user properties */}
    </div>
  )
} 