import Prompt from '@/models/prompt'
import { connectToDB } from '@/utils/database'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)

  try {
    await connectToDB()

    const prompts = await Prompt.find({}).populate('creator')
    return new Response(JSON.stringify(prompts), { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response('Failed to fetch prompts', { status: 500 })
  }
}
