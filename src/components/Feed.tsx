'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import PromptCard from './PromptCard'
import { debounce } from 'lodash'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {}

function Feed({}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = decodeURIComponent(searchParams.get('search') || '')
  console.log(search)
  const [searchText, setSearchText] = useState<string>(search)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetchPosts(search)
  }, [search])

  const fetchPosts = async (searchTerm?: string) => {
    const encodedSearchTerm = encodeURIComponent(searchTerm || '')

    const response = await fetch(
      `/api/prompt${encodedSearchTerm ? `?search=${encodedSearchTerm}` : ''}`
    )
    if (response.ok) {
      const data = await response.json()
      setPosts(data)
    }
  }

  const debouncedSearch = useCallback(
    debounce(
      (searchTerm: string) => {
        updatePath(searchTerm)
      },
      750,
      { trailing: true }
    ),
    []
  )

  const updatePath = useCallback(
    (searchTerm: string) => {
      const encodedSearchTerm = encodeURIComponent(searchTerm)
      const updatedPath = encodedSearchTerm
        ? `/?search=${encodedSearchTerm}`
        : '/'
      router.replace(updatedPath)
    },
    [router]
  )

  const handleSearchChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setSearchText(target.value)
      debouncedSearch(target.value)
    },
    [debouncedSearch]
  )

  const handleTagClick = useCallback(
    (tag: string) => {
      setSearchText(tag)
      updatePath(tag)
    },
    [updatePath]
  )

  const renderPrompts = () =>
    posts.map((post) => (
      <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
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
