import { CancelablePromise, CancelablePromiseType } from 'cancelable-promise'


export const abortedRequestPromise = <T>(promise: Promise<T>, abortController: AbortController): CancelablePromiseType<T> => {
  return new CancelablePromise<T>(
    (resolve, reject, onCancel) => {
      onCancel(() => abortController.abort())

      return promise
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            resolve(err)
          }
        })
    }
  )
}

//todo
export const asCancelablePromise = <T>(promise: Promise<T>): CancelablePromiseType<T> => promise as any
