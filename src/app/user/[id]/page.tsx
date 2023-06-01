'use client'
import Profile from '@/components/Profile'
import { useEffect, useState } from 'react'

type Props = {
  params: {
    id: string
  }
}

const UserProfile = ({ params }: Props) => {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params.id}/posts`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    }
    if (params.id) fetchPosts()
  }, [params.id])

  return <Profile name="User" desc="Welcome to profile page" data={posts} />
}

export default UserProfile
