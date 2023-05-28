'use client'
import Profile from '@/components/Profile'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {}

const MyProfile = (props: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`)
      const data = await response.json()
      setPosts(data)
    }
    if (session?.user.id) fetchPosts()
  }, [session?.user.id])

  const handleEdit = (id: string) => {
    router.push(`/update-prompt?id=${id}`)
  }
  const handleDelete = async (id: string) => {
    const hasConfirmed = confirm(`Are you sure you want to delete this prompt?`)
    if (hasConfirmed) {
      try {
        await fetch(`api/prompt/${id}`, {
          method: 'DELETE',
        })

        const filteredPosts = posts.filter((post) => post._id !== id)
        setPosts(filteredPosts)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile
