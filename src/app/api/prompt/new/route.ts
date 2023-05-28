import Prompt from '@/models/prompt'
import { connectToDB } from '@/utils/database'

export async function POST(request: any): Promise<Response> {
  const { userId, prompt, tag } = await request.json()
  try {
    await connectToDB()
    const newPrompt = new Prompt({ creator: userId, prompt, tag })

    await newPrompt.save()
    return new Response(JSON.stringify(newPrompt), { status: 201 })
  } catch (err) {
    console.log(err)
    return new Response('Failed to create a new prompt', { status: 500 })
  }
}
