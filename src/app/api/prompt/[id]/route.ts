import Prompt from '@/models/prompt'
import { handleApiError } from '@/utils/api-errors'
import { connectToDB } from '@/utils/database'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import * as yup from 'yup'

const patchSchema = yup.object().shape({
  prompt: yup.string().required(),
  tag: yup.string().required(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)

  try {
    await connectToDB()

    const prompt = await Prompt.findById(params.id).populate('creator')
    if (!prompt)
      return NextResponse.json({ message: 'Prompt not found' }, { status: 404 })

    return NextResponse.json(prompt, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: 'Failed to fetch prompt' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const { prompt, tag } = await patchSchema.validate(body, {
      abortEarly: false,
    })

    await connectToDB()
    const existingPrompt = await Prompt.findById(params.id)
    if (!existingPrompt)
      return NextResponse.json(
        {
          message: 'Prompt not found',
        },
        { status: 404 }
      )

    existingPrompt.prompt = prompt
    existingPrompt.tag = tag
    existingPrompt.save()
    return NextResponse.json(
      {
        _id: existingPrompt._id,
        prompt: existingPrompt.prompt,
        tag: existingPrompt.tag,
      },
      { status: 200 }
    )
  } catch (e) {
    return handleApiError(e, 'Failed to update prompt')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    await Prompt.findByIdAndRemove(params.id)

    return NextResponse.json('Prompt deleted successfully', { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json('Failed delete prompt', { status: 500 })
  }
}
