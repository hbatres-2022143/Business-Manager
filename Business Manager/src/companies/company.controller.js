'use strict'

import Company from './company.model.js'
import XlsxPopulate from 'xlsx-populate'

export const addCompany = async (req, res) => {
    try {
        let data = req.body
        let existingCompany = await Company.findOne({ name: data.name })
        if (existingCompany) return res.status(400).send({ message: 'Company already exists' })
        let company = new Company(data)
        await company.save()
        return res.send({ message: 'Company was added successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error add company' })
    }
}

export const updateCompany = async (req, res) => {
    try {
        let data = req.body
        let companyId = req.params.id
        let updatedCompany = await Company.findOneAndUpdate(
            { _id: companyId },
            data,
            { new: true }
        )
        if (!updatedCompany) return res.status(404).send({ message: 'Company not found and not updated' })
        return res.send({ message: 'Company updated successfully', updatedCompany })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error updating company' })
    }
}

export const viewAllCompanies = async (req, res) => {
    try {
        let companies = await Company.find().populate('category', ['name'])
        return res.send(companies)
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error when viewing companies' })
    }
}

export const filterCompaniesByYears = async (req, res) => {
    try {
        let { years } = req.body
        let companies = await Company.find({ yearsofexperience: years }).populate('category', ['name'])
        if (companies.length == 0) return res.status(404).send({ message: 'Companies not found' })
        return res.send({ message: `Companies by ${years} years`, companies })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error when viewing companies' })
    }
}

export const filterCompaniesByAZ = async (req, res) => {
    try {
        let companies = await Company.find().sort({ name: 1 }).populate('category', ['name'])
        return res.send({ message: 'Companies by A-Z', companies })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error when viewing companies' })
    }
}

export const filterCompaniesByZA = async (req, res) => {
    try {
        let companies = await Company.find().sort({ name: -1 }).populate('category', ['name'])
        return res.send({ message: 'Companies by Z-A', companies })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error when viewing companies' })
    }
}

export const generateReports = async (req, res) => {
    try {
        let report = await XlsxPopulate.fromBlankAsync()
        let companies = await Company.find().populate({
            path: 'category',
            select: 'name'
        })
        let data = companies.map(company => [
            company.name,
            company.address,
            company.category.name,
            company.impactlevel,
            company.yearsofexperience
        ])
        report.sheet(0).cell('A1').value([
            ['Name', 'Address', 'Category', 'Impact Level', 'Years Of Experience']
        ])
        report.sheet(0).cell('A2').value(data)
        report.toFileAsync('./src/generatedReports/reports.xlsx')
        return res.send({ message: 'Report generated successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error generating report' })
    }
}