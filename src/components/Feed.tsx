'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import PromptCard from './PromptCard'

type Props = {}

function Feed({}: Props) {
  const [searchText, setSearchText] = useState<string>('')
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
  }

  const renderPrompts = () =>
    posts.map((post) => (
      <PromptCard key={post._id} post={post} handleTagClick={() => {}} />
    ))
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <div className="mt-16 prompt_layout">{renderPrompts()}</div>
    </section>
  )
}
export default Feed
