import { useEffect, useRef } from 'react'

export const useSkipFirstRenderEffect = (
  effect: Function,
  dependencies: any
) => {
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    return effect()
  }, dependencies)
}
