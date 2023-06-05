import { NextResponse } from 'next/server'
import * as yup from 'yup'

export const handleApiError = (
  e: any,
  defaultMessage: string = 'An unexpected error occurred. Please try again later.'
) => {
  console.log('error occurred: ', e)

  if (e instanceof yup.ValidationError) {
    const errors: { [key: string]: string } = {}
    e.inner.forEach((error) => {
      if (error.path) {
        errors[error.path] = error.message
      }
    })

    return NextResponse.json(
      {
        errors,
      },
      { status: 400 }
    )
  } else if (e instanceof SyntaxError) {
    return NextResponse.json(
      {
        message: 'Invalid JSON',
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      message: defaultMessage,
    },
    { status: 400 }
  )
}
