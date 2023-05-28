'use client'
import { FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Form from '@/components/Form'
export type PostType = {
  prompt: string
  tag: string
}
type Props = {}

const CreatePrompt = (props: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [post, setPost] = useState<PostType>({
    prompt: '',
    tag: '',
  })

  const createPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/prompt/new', {
        method: 'POST',
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
        }),
      })

      if (response.ok) {
        router.push('/')
      }
    } catch (e) {
      console.log('error', e)
    }
    setSubmitting(false)
  }
  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  )
}

export default CreatePrompt
