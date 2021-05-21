import { IConfigStore } from './types'
import { store } from './index'
import { IUser } from '../../common/forum/forum.base.interfaces'
import { makeAutoObservable, runInAction } from 'mobx'
import { intValue, stringValue } from '../../common/utils/env'
import { IUserEx } from '../../common/forum/forum.ex.interfaces'


export class ConfigStore implements IConfigStore {
  isDevelopment: boolean = false
  forumAvatarBaseUrl: string = ''
  forumGalleryBaseUrl: string = ''
  forumAttachmentsBaseUrl: string = ''
  seoBaseTitle: string | undefined
  seoBaseDescription: string | undefined
  seoBaseKeywords: string[] = []
  forumMessagePageSize: number = 10
  forumMessageLatestMaxPages: number = 10
  forumTopicPageSize: number = 10
  forumUserPageSize: number = 10

  constructor () {
    runInAction(() => {
      this.isDevelopment = process.env.NODE_ENV !== 'production'
      this.forumAvatarBaseUrl = stringValue(process.env.FORUM_AVATAR_BASE_URL, '/static/avatars/default.jpg')
      this.forumGalleryBaseUrl = stringValue(process.env.FORUM_GALLERY_BASE_URL, '/static/gallery/')
      this.forumAttachmentsBaseUrl = stringValue(process.env.FORUM_ATTACHMENTS_BASE_URL, '/static/attachments/')
      this.seoBaseTitle = stringValue(process.env.SEO_BASE_TITLE)
      this.seoBaseDescription = stringValue(process.env.SEO_BASE_DESCRIPTION)
      this.seoBaseKeywords = stringValue(process.env.SEO_BASE_KEYWORDS, '').split(', ')
      this.forumMessagePageSize = intValue(process.env.FORUM_MESSAGE_PAGE_SIZE, 10)
      this.forumMessageLatestMaxPages = intValue(process.env.FORUM_MESSAGE_LATEST_MAX_PAGES, 10)
      this.forumTopicPageSize = intValue(process.env.FORUM_TOPIC_PAGE_SIZE, 25)
      this.forumUserPageSize = intValue(process.env.FORUM_USER_PAGE_SIZE, 20)
    })

    makeAutoObservable(this, {})
  }

  getAvatarUrl (avatar?: string ): string | undefined {
    return avatar ? store.configStore.forumAvatarBaseUrl + avatar : undefined
  }

}
