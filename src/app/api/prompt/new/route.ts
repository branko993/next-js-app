import Prompt from '@/models/prompt'
import { handleApiError } from '@/utils/api-errors'
import { connectToDB } from '@/utils/database'
import { NextRequest, NextResponse } from 'next/server'
import * as yup from 'yup'

const postSchema = yup.object().shape({
  userId: yup.string().required(),
  prompt: yup.string().required(),
  tag: yup.string().required(),
})
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, prompt, tag } = await postSchema.validate(body, {
      abortEarly: false,
    })

    await connectToDB()
    const newPrompt = new Prompt({ creator: userId, prompt, tag })

    await newPrompt.save()
    return NextResponse.json(
      {
        _id: newPrompt._id,
        prompt: newPrompt.prompt,
        tag: newPrompt.tag,
        creator: newPrompt.creator,
      },
      { status: 201 }
    )
  } catch (err) {
    return handleApiError(err, 'Failed to create a new prompt')
  }
}
