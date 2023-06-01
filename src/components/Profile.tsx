import React, { useCallback } from 'react'
import PromptCard from './PromptCard'
import { useRouter } from 'next/navigation'

type Props = {
  name: string
  desc: string
  data: any[]
  handleEdit: Function
  handleDelete: Function
}

function Profile({ name, desc, data, handleEdit, handleDelete }: Props) {
  const router = useRouter()

  const extraActions = [
    {
      name: 'Edit',
      onClick: (id: string) => {
        handleEdit(id)
      },
      styles: 'font-inter text-sm green_gradient cursor-pointer',
    },
    {
      name: 'Delete',
      onClick: (id: string) => {
        handleDelete(id)
      },
      styles: 'font-inter text-sm orange_gradient cursor-pointer',
    },
  ]
  const handleTagClick = useCallback(
    (tag: string) => {
      const encodedTag = encodeURIComponent(tag)
      const updatedPath = `/?search=${encodedTag}`
      router.push(updatedPath)
    },
    [router]
  )

  const renderPrompts = () =>
    data.map((post) => (
      <PromptCard
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
        extraActions={extraActions}
      />
    ))
  return (
    <section className="w-full">
      <h1 className="head_text text_left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-10 prompt_layout">{renderPrompts()}</div>
    </section>
  )
}

export default Profile
