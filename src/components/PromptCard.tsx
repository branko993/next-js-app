'use client'

import Image from 'next/image'
import { MouseEventHandler, useState } from 'react'

type Props = {
  post: {
    _id: string
    creator: any
    prompt: string
    tag: string
  }
  handleTagClick: Function
  extraActions?: {
    name: string
    onClick: Function
    styles: string
  }[]
}

function PromptCard({ post, handleTagClick, extraActions }: Props) {
  const [copied, setCopied] = useState<string>('')

  const handleCopy = () => {
    setCopied(post.prompt)
    navigator.clipboard.writeText(post.prompt)
    setTimeout(() => setCopied(''), 3000)
  }

  const renderExtraActions = () =>
    extraActions &&
    extraActions.map((action) => (
      <p
        className={action.styles}
        onClick={(e) => {
          action.onClick(post._id)
        }}
        key={action.name}
      >
        {action.name}
      </p>
    ))

  const renderTags = () =>
    post.tag.split(' ').map((tag, index) => (
      <span
        key={index}
        className="font-inter text-sm blue_gradient cursor-pointer mr-2"
        onClick={() => {}}
      >
        {tag}
      </span>
    ))

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Image
            src={post.creator.image}
            alt="user_image"
            className="rounded-full object-contain"
            width={30}
            height={30}
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>
        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? '/assets/icons/tick.svg'
                : '/assets/icons/copy.svg'
            }
            alt="copy_button"
            width={12}
            height={12}
          />
        </div>
      </div>
      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      {renderTags()}
      <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
        {renderExtraActions()}
      </div>
    </div>
  )
}

export default PromptCard
