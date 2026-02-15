import { Router } from 'express'
import UserController from '../controllers/UserController.js'
import { body } from 'express-validator'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()
const userControllerInstance = new UserController()

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 6, max: 32 }), userControllerInstance.register)

router.post('/login', userControllerInstance.login)

router.post('/logout', userControllerInstance.logout)

router.get('/refresh', userControllerInstance.refresh)

router.get('/activate/:link', userControllerInstance.activate)

router.get('/users', authMiddleware, userControllerInstance.getUsers)

export default router
