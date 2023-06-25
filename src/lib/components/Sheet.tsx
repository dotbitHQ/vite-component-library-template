import { ReactNode, useEffect, useState } from 'react'
import { Mask } from './Mask'
import { Portal } from './Portal'
import clsx from 'clsx'

interface SheetProps {
  isOpen: boolean
  children?: ReactNode
  customRootId?: string
  zIndex?: string
}

export function Sheet({ isOpen, children, customRootId, zIndex = 'z-[3]' }: SheetProps) {
  const [removeDOM, setRemoveDOM] = useState(!isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setRemoveDOM(false)
    } else {
      setTimeout(() => {
        setRemoveDOM(true)
        document.body.style.overflow = 'auto'
      }, 150)
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return removeDOM ? null : (
    <Portal customRootId={customRootId}>
      <Mask zIndex={zIndex} isOpen={isOpen} />
      <div className={clsx('fixed left-0 top-0 flex h-full w-full items-end justify-center', zIndex)}>{children}</div>
    </Portal>
  )
}
