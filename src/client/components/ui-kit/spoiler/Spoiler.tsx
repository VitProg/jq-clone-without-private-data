import { FC, useState, ReactNode } from 'react'

interface Props {
  title?: string
  components: ReactNode[]
}


export const Spoiler: FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const title = props.title ?? 'Спойлер...'

  const onClick = () => {
    setOpen(!open)
  }

  return (
    <div>
      <div onClick={onClick}>{open ? '[-]' : '[+]'} {title}</div>
      {open && props.components}
    </div>
  )
}
