import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import Prompt from '@/models/prompt'
import { connectToDB } from '@/utils/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)
  try {
    await connectToDB()

    const prompts = await Prompt.find({ creator: params.id }).populate(
      'creator'
    )
    return new Response(JSON.stringify(prompts), { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response('Failed to fetch prompts', { status: 500 })
  }
}
