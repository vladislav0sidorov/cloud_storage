import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { body } from 'express-validator'
import authMiddleware from '../middlewares/authMiddleware.js'
import FileStorageController from '../controllers/FileStorageController.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads', 'tmp'),
  limits: { fileSize: 500 * 1024 * 1024 }
})

const fileStorageController = new FileStorageController()

const router = Router()

router.get('/', authMiddleware, fileStorageController.list)

router.post('/folder', authMiddleware, body('name').trim().notEmpty().withMessage('Укажите имя папки'), fileStorageController.createFolder)

router.post('/upload', authMiddleware, upload.single('file'), fileStorageController.upload)

router.patch('/:id/move', authMiddleware, fileStorageController.move)

router.get('/:id/download', authMiddleware, fileStorageController.download)

router.delete('/:id', authMiddleware, fileStorageController.remove)

export default router
