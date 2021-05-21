

export const mute = (promise: Promise<any>): void => {
  promise.catch(e => console.warn(e))
}
