import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { FileModel } from '../models/fileModel.js'
import ApiError from '../exceptions/ApiError.js'
import { STORAGE_LIMIT_BYTES } from '../constants/storage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

class FileStorageService {
  async getUsedSize(userId) {
    const userObjectId = userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId)
    const result = await FileModel.aggregate([
      { $match: { userId: userObjectId, isFolder: false } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ])
    return result[0]?.total ?? 0
  }

  async list(userId, parentId = null) {
    const query = { userId, parentId: parentId || null }
    const items = await FileModel.find(query).sort({ isFolder: -1, name: 1 }).lean()
    const mapped = items.map(({ _id, name, path: filePath, size, isFolder, parentId, userId: uid, mimeType, createdAt }) => ({
      id: _id.toString(),
      name,
      path: filePath,
      size,
      isFolder,
      parentId: parentId?.toString() ?? null,
      userId: uid.toString(),
      mimeType,
      createdAt
    }))
    // для папок подставляем рекурсивный размер содержимого
    const withFolderSizes = await Promise.all(
      mapped.map(async (item) => {
        if (item.isFolder) {
          const folderSize = await this.getFolderSize(item.id)
          return { ...item, size: folderSize }
        }
        return item
      })
    )
    return withFolderSizes
  }

  async createFolder(userId, parentId, name) {
    const trimmedName = name?.trim()
    if (!trimmedName) throw ApiError.BadRequest('Укажите имя папки')

    if (parentId) {
      const parent = await FileModel.findOne({ _id: parentId, userId })
      if (!parent) throw ApiError.BadRequest('Родительская папка не найдена')
      if (!parent.isFolder) throw ApiError.BadRequest('Родитель должен быть папкой')
    }

    const exists = await FileModel.findOne({ userId, parentId: parentId || null, name: trimmedName, isFolder: true })
    if (exists) throw ApiError.BadRequest('Папка с таким именем уже существует')

    const doc = await FileModel.create({
      name: trimmedName,
      isFolder: true,
      parentId: parentId || null,
      userId
    })

    return {
      id: doc._id.toString(),
      name: doc.name,
      isFolder: true,
      parentId: (doc.parentId && doc.parentId.toString()) ?? null,
      userId: doc.userId.toString(),
      createdAt: doc.createdAt
    }
  }

  async uploadFile(userId, parentId, file) {
    if (!file?.path) throw ApiError.BadRequest('Файл не загружен')

    if (parentId) {
      const parent = await FileModel.findOne({ _id: parentId, userId })
      if (!parent) throw ApiError.BadRequest('Папка не найдена')
      if (!parent.isFolder) throw ApiError.BadRequest('Родитель должен быть папкой')
    }

    const used = await this.getUsedSize(userId)
    const newTotal = used + file.size
    if (newTotal > STORAGE_LIMIT_BYTES) {
      await fs.unlink(file.path).catch(() => {})
      throw ApiError.BadRequest(
        `Превышен лимит хранилища (1 ГБ). Занято: ${this._formatBytes(used)}, загрузка: ${this._formatBytes(file.size)}`
      )
    }

    const userDir = path.join(UPLOADS_DIR, userId.toString())
    await fs.mkdir(userDir, { recursive: true })

    const ext = path.extname(file.originalname) || ''
    const baseName = path.basename(file.originalname, ext)
    const safeName = `${baseName}${ext}`.replace(/[^a-zA-Z0-9._-]/g, '_') || 'file'
    const destFileName = `${Date.now()}_${safeName}`
    const destPath = path.join(userDir, destFileName)

    await fs.rename(file.path, destPath)

    const doc = await FileModel.create({
      name: file.originalname,
      path: destPath,
      size: file.size,
      isFolder: false,
      parentId: parentId || null,
      userId,
      mimeType: file.mimetype
    })

    return {
      id: doc._id.toString(),
      name: doc.name,
      path: doc.path,
      size: doc.size,
      isFolder: false,
      parentId: (doc.parentId && doc.parentId.toString()) ?? null,
      userId: doc.userId.toString(),
      mimeType: doc.mimeType,
      createdAt: doc.createdAt
    }
  }

  _formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} Б`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
  }

  async move(fileId, newParentId, userId) {
    const file = await FileModel.findOne({ _id: fileId, userId })
    if (!file) throw ApiError.BadRequest('Файл или папка не найдены')

    const targetParentId = newParentId || null

    if (targetParentId) {
      const target = await FileModel.findOne({ _id: targetParentId, userId })
      if (!target) throw ApiError.BadRequest('Целевая папка не найдена')
      if (!target.isFolder) throw ApiError.BadRequest('Цель должна быть папкой')
      if (file.isFolder && target._id.equals(file._id)) throw ApiError.BadRequest('Нельзя переместить папку в саму себя')
      if (file.isFolder) {
        const isDescendant = await this._isDescendant(targetParentId, fileId)
        if (isDescendant) throw ApiError.BadRequest('Нельзя переместить папку в свою подпапку')
      }
    }

    const sameName = await FileModel.findOne({
      userId,
      parentId: targetParentId,
      name: file.name,
      isFolder: file.isFolder
    })
    if (sameName && !sameName._id.equals(file._id)) {
      throw ApiError.BadRequest(`В целевой папке уже есть элемент с именем "${file.name}"`)
    }

    file.parentId = targetParentId
    await file.save()

    return {
      id: file._id.toString(),
      name: file.name,
      parentId: (file.parentId && file.parentId.toString()) ?? null
    }
  }

  async _isDescendant(ancestorId, nodeId) {
    let current = await FileModel.findById(nodeId)
    while (current?.parentId) {
      if (current.parentId.toString() === ancestorId) return true
      current = await FileModel.findById(current.parentId)
    }
    return false
  }

  async getFileForDownload(fileId, userId) {
    const file = await FileModel.findOne({ _id: fileId, userId })
    if (!file) return null
    if (file.isFolder) return null
    return file
  }

  /**
   * Возвращает суммарный размер всех файлов внутри папки (рекурсивно).
   */
  async getFolderSize(folderId) {
    const id = folderId instanceof mongoose.Types.ObjectId ? folderId : new mongoose.Types.ObjectId(folderId)
    const descendantIds = await this._collectDescendantIds(id)
    if (descendantIds.length === 0) return 0
    const result = await FileModel.aggregate([
      { $match: { _id: { $in: descendantIds }, isFolder: false } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ])
    return result[0]?.total ?? 0
  }

  /**
   * Рекурсивно собирает id всех потомков (файлы и папки) для данной папки.
   */
  async _collectDescendantIds(folderId) {
    const ids = []
    let currentLevel = [folderId]
    while (currentLevel.length > 0) {
      const children = await FileModel.find({ parentId: { $in: currentLevel } }).select('_id isFolder').lean()
      const childIds = children.map((c) => c._id)
      ids.push(...childIds)
      currentLevel = childIds
    }
    return ids
  }

  /**
   * Удаляет файл или папку. Для папки рекурсивно удаляет всё содержимое (файлы с диска, записи в БД).
   */
  async remove(fileId, userId) {
    const item = await FileModel.findOne({ _id: fileId, userId })
    if (!item) throw ApiError.BadRequest('Файл или папка не найдены')

    if (item.isFolder) {
      const descendantIds = await this._collectDescendantIds(item._id)
      const allIds = [item._id, ...descendantIds]
      const filesToUnlink = await FileModel.find({ _id: { $in: allIds }, isFolder: false }).select('path').lean()
      for (const f of filesToUnlink) {
        if (f.path) await fs.unlink(f.path).catch(() => {})
      }
      await FileModel.deleteMany({ _id: { $in: allIds } })
    } else {
      if (item.path) await fs.unlink(item.path).catch(() => {})
      await FileModel.deleteOne({ _id: fileId, userId })
    }

    return { message: item.isFolder ? 'Папка и всё содержимое удалены' : 'Файл удалён' }
  }
}

export default new FileStorageService()
