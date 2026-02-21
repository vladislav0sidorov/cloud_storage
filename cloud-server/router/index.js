import { Router } from 'express'
import UserController from '../controllers/UserController.js'
import { body } from 'express-validator'
import authMiddleware from '../middlewares/authMiddleware.js'
import fileStorageRouter from './fileStorageRouter.js'

const router = Router()
const userControllerInstance = new UserController()

router.use('/files', fileStorageRouter)

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 6, max: 32 }), userControllerInstance.register)

router.post('/login', userControllerInstance.login)

router.post('/logout', userControllerInstance.logout)

router.get('/refresh', userControllerInstance.refresh)

router.get('/activate/:link', userControllerInstance.activate)

router.get('/users', authMiddleware, userControllerInstance.getUsers)

router.patch(
  '/user/password',
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('Введите текущий пароль'),
  body('newPassword').isLength({ min: 6, max: 32 }).withMessage('Новый пароль от 6 до 32 символов'),
  userControllerInstance.updatePassword
)

router.patch(
  '/user/avatar',
  authMiddleware,
  body('avatar').notEmpty().withMessage('Укажите изображение аватара'),
  userControllerInstance.updateAvatar
)

router.patch(
  '/user/personal-info',
  authMiddleware,
  userControllerInstance.updatePersonalInfo
)

export default router
