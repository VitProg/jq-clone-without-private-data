import { Dispatch, SetStateAction, useState } from 'react'


export function useStateRecord<K extends keyof any, V>
(
  initialState?: Record<K, V> | (() => Record<K, V>)
): [
  state: Record<K, V>,
  setState: Dispatch<SetStateAction<Record<K, V>>>,
  updateState: (partial?: Partial<Record<K, V>>) => void,
  patchState: (key: K, value: V) => void,
] {
  const [state, setState] = useState<Record<K, V>>(initialState ?? {} as Record<K, V>)

  const patchState = (key: K, value: V) => (
    setState((state: Record<K, V>) => ({
        ...state,
        [key]: value,
      })
    ))

  const updateState = (partial?: Partial<Record<K, V>>) => (
    partial && setState((state: Record<K, V>) => ({
        ...state,
        ...partial,
      })
    ))

  return [state, setState, updateState, patchState]
}
