import Prompt from '@/models/prompt'
import { connectToDB } from '@/utils/database'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)
  try {
    await connectToDB()
    const prompts = await Prompt.find({}).populate('creator')
    return NextResponse.json(prompts, { status: 200 })
  } catch (e) {
    console.log(e)
    return new NextResponse('Failed to fetch prompts', { status: 500 })
  }
}
