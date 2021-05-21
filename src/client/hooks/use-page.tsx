import { useEffect, useState, Dispatch, SetStateAction } from 'react'


export const usePage = (propsPage?: number): [page: number, setPage: Dispatch<SetStateAction<number>>] => {
  const routePage = propsPage ?? 1

  const [page, setPage] = useState(routePage)

  useEffect(() => {
    setPage(routePage)
  }, [routePage])

  return [page, setPage]
}
