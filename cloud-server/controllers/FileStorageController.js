import { validationResult } from 'express-validator'
import FileStorageService from '../service/FileStorageService.js'
import ApiError from '../exceptions/ApiError.js'

export default class FileStorageController {
  async list(req, res, next) {
    try {
      const userId = req.user.userId
      const parentId = req.query.parentId || null
      const items = await FileStorageService.list(userId, parentId)
      const used = await FileStorageService.getUsedSize(userId)
      return res.json({ items, used })
    } catch (error) {
      next(error)
    }
  }

  async createFolder(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      const userId = req.user.userId
      const { parentId, name } = req.body
      const folder = await FileStorageService.createFolder(userId, parentId || null, name)
      return res.status(201).json(folder)
    } catch (error) {
      next(error)
    }
  }

  async upload(req, res, next) {
    try {
      if (!req.file) return next(ApiError.BadRequest('Выберите файл для загрузки'))
      const userId = req.user.userId
      const parentId = req.body.parentId || null
      const file = await FileStorageService.uploadFile(userId, parentId || null, req.file)
      return res.status(201).json(file)
    } catch (error) {
      next(error)
    }
  }

  async move(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      const userId = req.user.userId
      const fileId = req.params.id
      const { parentId } = req.body
      const result = await FileStorageService.move(fileId, parentId ?? null, userId)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async download(req, res, next) {
    try {
      const userId = req.user.userId
      const fileId = req.params.id
      const file = await FileStorageService.getFileForDownload(fileId, userId)
      if (!file) return next(ApiError.BadRequest('Файл не найден'))
      return res.download(file.path, file.name)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.user.userId
      const fileId = req.params.id
      const result = await FileStorageService.remove(fileId, userId)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
