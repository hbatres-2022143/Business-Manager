'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    return res.send('Hello word')
}

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let existingUser = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        })
        if (existingUser) return res.status(400).send({ message: 'User already exists' })
        let user = new User(data)
        await user.save()
        return res.send({ message: 'User created succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating user' })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password, email } = req.body
        let user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggerdUser = {
                uid: user.id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
            let token = await generateJwt(loggerdUser)
            return res.send({ message: `Welcome ${user.name}`, loggerdUser, token })
        }
        return res.status(401).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let userIdU = req.params.id
        let userIdL = req.user._id
        if (userIdL.toString() !== userIdU.toString()) return res.status(404).send({
            message: 'You are not authorized to update another users password'
        })
        let update = checkUpdate(data, userIdU)
        if (!update) return res.status(400).send({ message: 'Could not update because data is missing' })
        let updatedUser = await User.findOneAndUpdate(
            { _id: userIdU },
            data,
            { new: true }
        )
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'User updated successfully', updatedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating user' })
    }
}
export const updatePassword = async (req, res) => {
    try {
        let data = req.body
        let userIdU = req.params.id
        let userIdL = req.user._id
        let user = await User.findOne({ _id: userIdU })
        let password = data.password
        if (userIdL.toString() !== userIdU.toString()) return res.status(404).send({
            message: 'You are not authorized to update another users password'
        })
        if (user && await checkPassword(password, user.password)) {
            if (data.passwordNew) data.passwordNew = await encrypt(data.passwordNew)
            let update = checkUpdate(data, userIdU)
            if (!update) return res.status(400).send({ message: 'Could not update because data is missing' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: userIdU },
                { password: data.passwordNew },
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'User password updated successfully' })
        }
        return res.status(404).send({ message: 'The password is not correct' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating password' })
    }
}