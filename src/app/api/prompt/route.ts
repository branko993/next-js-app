import Prompt from '@/models/prompt'
import User from '@/models/user'
import { connectToDB } from '@/utils/database'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)
  try {
    const {
      nextUrl: { search },
    } = request
    const urlSearchParams = new URLSearchParams(search)
    const searchParam = urlSearchParams.get('search') || ''

    await connectToDB()
    const prompts = await searchPrompts(searchParam)

    return NextResponse.json(prompts, { status: 200 })
  } catch (e) {
    console.log(e)
    return new NextResponse('Failed to fetch prompts', { status: 500 })
  }
}

async function searchPrompts(searchParam: string) {
  const regex = new RegExp(searchParam, 'i')
  let query = {}
  let prompts = []

  if (searchParam) {
    const users = await User.find({ username: { $regex: regex } }).select('_id')
    query = {
      $or: [
        { tag: { $regex: regex } },
        { creator: { $in: users.map((user) => user._id) } },
      ],
    }
  }

  prompts = await Prompt.find(query).populate('creator')

  return prompts
}
