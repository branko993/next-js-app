'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import PromptCard from './PromptCard'
import { debounce } from 'lodash'

type Props = {}

function Feed({}: Props) {
  const [searchText, setSearchText] = useState<string>('')
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    }
    fetchPosts()
  }, [])

  const debouncedSearch = useCallback(
    debounce(
      (searchTerm: string) => {
        // Perform your search operation or any other action here
        console.log(`Searching for: ${searchTerm}`)
      },
      750,
      { trailing: true }
    ),
    []
  )

  const handleSearchChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setSearchText(target.value)
      debouncedSearch(target.value)
    },
    [debouncedSearch]
  )

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
