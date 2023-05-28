'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@/components/Form'
export type PostType = {
  prompt: string
  tag: string
}
type Props = {}

const UpdatePrompt = (props: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promptId = searchParams.get('id')

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [post, setPost] = useState<PostType>({
    prompt: '',
    tag: '',
  })

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`, {
        next: { revalidate: 10 },
      })
      const data = await response.json()
      setPost({
        prompt: data.prompt,
        tag: data.tag,
      })
    }
    getPromptDetails()
  }, [promptId])

  const UpdatePrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    if (!promptId) return alert('Prompt ID not found')

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          prompt: post.prompt,
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
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={UpdatePrompt}
    />
  )
}

export default UpdatePrompt
