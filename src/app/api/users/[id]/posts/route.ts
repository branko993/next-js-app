import Prompt from '@/models/prompt'
import { connectToDB } from '@/utils/database'

export const revalidate = 5

export async function GET(
  request: any,
  { params }: { params: { id: string } }
): Promise<Response> {
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
