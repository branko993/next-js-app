'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as yup from 'yup'

import Form from '@/components/Form'
import { promptSchema } from '@/models/schemas/prompt'
import { useSkipFirstRenderEffect } from '@/utils/custom-hooks'
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`)
      const data = await response.json()
      setPost({
        prompt: data.prompt,
        tag: data.tag,
      })
    }
    getPromptDetails()
  }, [promptId])

  useSkipFirstRenderEffect(() => {
    validatePosts()
  }, [post])

  const validatePosts = async () => {
    try {
      await promptSchema.validate(post, { abortEarly: false })
      setFormErrors({})
      return true
    } catch (validationError: any) {
      if (yup.ValidationError.isError(validationError)) {
        const errors: { [key: string]: string } = {}
        validationError.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message
          }
        })
        setFormErrors(errors)
      }

      return false
    }
  }

  const UpdatePrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    if (!promptId) return alert('Prompt ID not found')
    const isFormValid = await validatePosts()

    if (isFormValid) {
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
      formErrors={formErrors}
    />
  )
}

export default UpdatePrompt
