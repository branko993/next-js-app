import { PostType } from '@/app/create-prompt/page'
import Image from 'next/image'
import Link from 'next/link'
import React, { FormEventHandler } from 'react'

type Props = {
  type: string
  post: PostType
  setPost: Function
  submitting: boolean
  handleSubmit: FormEventHandler<HTMLFormElement>
  formErrors?: {
    [key: string]: string
  }
}

function Form({
  type,
  post,
  setPost,
  submitting,
  handleSubmit,
  formErrors = {},
}: Props) {
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your AI Prompt
          </span>
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your prompt here..."
            required
            className={`form_textarea ${
              formErrors.prompt ? 'border-2 border-red-500' : ''
            }`}
          />
          {formErrors.prompt && (
            <span className="text-red-500 text-xs">{formErrors.prompt}</span>
          )}
        </label>
        <label>
          <span className="group relative w-3/6 flex font-satoshi font-semibold text-base text-gray-700">
            <span>Tags</span>
            <span className="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
              Tags are used to categorize your prompt. Add spaces between tags.
            </span>
            <Image
              src="/assets/icons/info.svg"
              alt="info_icon"
              width={22}
              height={22}
              className="ml-2 cursor-pointer"
            />
          </span>
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            placeholder="#tags"
            required
            className={`form_input ${
              formErrors.tag ? 'border-2 border-red-500' : ''
            }`}
          />
          {formErrors.tag && (
            <span className="text-red-500 text-xs">{formErrors.tag}</span>
          )}
        </label>
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-1.5 text-sm rounded-full text-white bg-primary-orange disabled:bg-orange-300"
            disabled={submitting || Object.keys(formErrors).length !== 0}
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Form
