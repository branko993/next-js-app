import Prompt from '@/models/prompt'
import { connectToDB } from '@/utils/database'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)

  try {
    await connectToDB()

    const prompt = await Prompt.findById(params.id).populate('creator')
    if (!prompt) return new Response('Prompt not found', { status: 404 })

    return new Response(JSON.stringify(prompt), { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response('Failed to fetch prompt', { status: 500 })
  }
}

export async function PATCH(
  request: any,
  { params }: { params: { id: string } }
): Promise<Response> {
  const { prompt, tag } = await request.json()

  try {
    await connectToDB()
    const existingPrompt = await Prompt.findById(params.id)
    if (!existingPrompt)
      return new Response('Prompt not found', { status: 404 })

    existingPrompt.prompt = prompt
    existingPrompt.tag = tag
    existingPrompt.save()
    return new Response(JSON.stringify(existingPrompt), { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response('Failed update prompt', { status: 500 })
  }
}

export async function DELETE(
  request: any,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectToDB()
    await Prompt.findByIdAndRemove(params.id)

    return new Response('Prompt deleted successfully', { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response('Failed delete prompt', { status: 500 })
  }
}
