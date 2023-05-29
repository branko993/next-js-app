'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'

import Form from '@/components/Form'
import { promptSchema } from '@/models/schemas/prompt'
export type PostType = {
  prompt: string
  tag: string
}
type Props = {}

const CreatePrompt = (props: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const [post, setPost] = useState<PostType>({
    prompt: '',
    tag: '',
  })

  useEffect(() => {
    validatePosts()
  }, [post])

  const validatePosts = async () => {
    try {
      await promptSchema.validate(post, { abortEarly: false })
      // Validation successful, no errors
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

  const createPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const isFormValid = await validatePosts()

    if (isFormValid) {
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
    } else {
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
      formErrors={formErrors}
    />
  )
}

export default CreatePrompt
