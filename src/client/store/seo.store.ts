import { IConfigStore, IRootStore, ISeoStore } from './types'
import { action, autorun, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import { store } from './index'


const joinTitle = (...titles: (string | undefined | null)[]) => titles.filter(Boolean).join(' | ')
const joinKeywords = (...keyword: (string | undefined | null)[]) => keyword.filter(Boolean).join(', ')

export class SeoStore implements ISeoStore {
  constructor (readonly configStore: IConfigStore) {
    makeObservable(this)

    autorun(() => {
      if (!this.initialized) {
        this.init()
      }

      this.elTitle!.innerText = joinTitle(this.baseTitle, ...this.title)
      this.elMetaDescription!.content = (this.baseDescription ? this.baseDescription + '. ' : '') + this.description
      this.elMetaKeywords!.content = joinKeywords(...(this.baseKeywords ? this.baseKeywords : []), ...this.keywords)
      console.log('update seo')
    }, {
      delay: 200
    })

    setTimeout(() => runInAction(() => this.setBase({
      title: store.configStore.seoBaseTitle,
      description: store.configStore.seoBaseDescription,
      keywords: store.configStore.seoBaseKeywords,
    })))
  }

  private elTitle: HTMLTitleElement | undefined
  private elMetaKeywords: HTMLMetaElement | undefined
  private elMetaDescription: HTMLMetaElement | undefined

  @observable private initialized = false

  @action.bound
  private init() {
    this.initialized = true

    const elTitle = document.head.querySelector('title')
    if (elTitle) {
      this.elTitle = elTitle
    } else {
      this.elTitle = document.createElement('title')
      document.head.appendChild(this.elTitle)
    }

    const elMetaKeywords = document.head.querySelector<HTMLMetaElement>('meta[name="keywords"]')
    if (elMetaKeywords) {
      this.elMetaKeywords = elMetaKeywords
    } else {
      this.elMetaKeywords = document.createElement('meta')
      this.elMetaKeywords.name = 'keywords'
      this.elMetaKeywords.content = ''
      document.head.appendChild(this.elMetaKeywords)
    }

    const elMetaDescription = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (elMetaDescription) {
      this.elMetaDescription = elMetaDescription
    } else {
      this.elMetaDescription = document.createElement('meta')
      this.elMetaDescription.name = 'description'
      this.elMetaDescription.content = ''
      document.head.appendChild(this.elMetaDescription)
    }
  }

  @observable baseTitle: string | undefined
  @observable baseKeywords: string[] | undefined = undefined
  @observable baseDescription: string | undefined = undefined

  @observable title: string[] = []
  @observable keywords: string[] = []
  @observable description: string = ''

  @action.bound
  setBase (data: { title?: string; keywords?: string[]; description?: string }): void {
    this.baseTitle = data.title
    this.baseKeywords = data.keywords
    this.baseDescription = data.description ?? ''
  }

  @action.bound
  setTitle(...titles: (string | undefined | null)[]): void {
    this.title = [...titles].filter(Boolean) as string[]
  }

  @action.bound
  setKeywords(...keywords: (string | undefined | null)[]): void {
    this.keywords = [...keywords].filter(Boolean) as string[]
  }

  @action.bound
  setDescription(description: string | undefined | null): void {
    this.description = description ?? ''
  }

  @action.bound
  setPageSeo (data: { title?: string[]; keywords?: string[]; description?: string }): void {
    if (data.title) {
      this.setTitle(...data.title)
    }

    if (data.keywords) {
      this.setKeywords(...data.keywords)
    }

    if (data.description) {
      this.setDescription(data.description)
    }
  }

  @action.bound
  addKeyword(...keywords: (string | undefined | null)[]): void {
    this.keywords = [...this.keywords, ...keywords].filter(Boolean) as string[]
  }

  @action.bound
  addTitle(...titles: (string | undefined | null)[]): void {
    this.title = [...this.title, ...titles].filter(Boolean) as string[]
  }

  @action.bound
  clear(): void {
    this.title = []
    this.description = ''
    this.keywords = []
  }


}
