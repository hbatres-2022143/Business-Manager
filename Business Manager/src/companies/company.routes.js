'use strict'

import { Router } from 'express'
import { addCompany, filterCompaniesByAZ, filterCompaniesByYears, filterCompaniesByZA, generateReports, updateCompany, viewAllCompanies } from './company.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/addCompany', validateJwt, addCompany)
api.put('/updateCompany/:id', validateJwt, updateCompany)
api.get('/viewAllCompanies', validateJwt, viewAllCompanies)
api.post('/filterCompaniesByYears', validateJwt, filterCompaniesByYears)
api.get('/filterCompaniesByAZ', validateJwt, filterCompaniesByAZ)
api.get('/filterCompaniesByZA', validateJwt, filterCompaniesByZA)
api.get('/generateReports', validateJwt, generateReports)

export default api