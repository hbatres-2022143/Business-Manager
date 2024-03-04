'use strict'

import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRETKEY || '@SecretKey@'

export const generateJwt = async (payload) => {
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: '12h',
            algorithm: 'HS256'
        })
    } catch (err) {
        console.error(err)
        return err
    }
}