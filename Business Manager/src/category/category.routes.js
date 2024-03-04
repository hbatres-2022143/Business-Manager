'use strict'

import { Router } from 'express'
import { addCategory, deleteCategory, updateCategory, viewCategories } from './category.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/addCategory', validateJwt, addCategory)
api.put('/updateCategory/:id', validateJwt, updateCategory)
api.get('/viewCategories', validateJwt, viewCategories)
api.delete('/deleteCategory/:id', validateJwt, deleteCategory)

export default api