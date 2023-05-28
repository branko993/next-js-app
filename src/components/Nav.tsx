'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  signIn,
  signOut,
  getProviders,
  ClientSafeProvider,
  useSession,
} from 'next-auth/react'

type Props = {}

interface ProviderData {
  [provider: string]: ClientSafeProvider
}

function Nav({}: Props) {
  const { data: session } = useSession()

  const [providers, setProviders] = useState<ProviderData | null>(null)
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false)

  useEffect(() => {
    const get = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    get()
  }, [])

  return (
    <div className="flex-between w-full  mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          width={30}
          height={30}
          src="/assets/images/logo.svg"
          alt="Logo"
          className="object-contain"
        />
        <p className="logo_text">Promptopia</p>
      </Link>
      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>
            <button
              type="button"
              className="outline_btn"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                width={37}
                height={37}
                src={session?.user.image!}
                alt="profile image"
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image!}
              className="rounded-full"
              width={37}
              height={37}
              onClick={() => {
                setToggleDropdown((prev) => !prev)
              }}
              alt="profile image"
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link href="/profile" onClick={() => setToggleDropdown(false)}>
                  My profile
                </Link>
                <Link
                  href="/create-prompt"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false)
                    signOut()
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Nav
