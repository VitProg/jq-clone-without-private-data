import { AppRouteKeys } from '../routing/types'
import { SetupPageMetadataConfig } from '../store/types'
import { useMemo } from 'react'
import { store } from '../store'


export const usePageMetadata = <R extends AppRouteKeys = AppRouteKeys> (config: SetupPageMetadataConfig<R>): void => {
  useMemo(
    () => {
      setTimeout(() => {
        console.log('setupPageMetadata', config)
        store.setupPageMetadata({
          ...config
        })
      })
    },
    [
      config.pageTitle,
      config.title,
      config.pagination?.currentPage,
      config.pagination?.totalPages,
    ]
  )
}
