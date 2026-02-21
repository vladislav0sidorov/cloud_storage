/** Элемент хранилища: файл или папка */
export interface IFileItem {
  id: string
  name: string
  size?: number
  isFolder: boolean
  parentId: string | null
  userId: string
  mimeType?: string
  createdAt: string
}

export interface IFileListResponse {
  items: IFileItem[]
  used: number
}
