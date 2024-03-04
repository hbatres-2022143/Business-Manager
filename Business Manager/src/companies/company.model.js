'use strict'

import { Schema, model } from 'mongoose'

const companySchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    impactlevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        uppercase: true,
        required: true
    },
    yearsofexperience: {
        type: Number,
        required: true
    }
},
    {
        versionKey: false
    })
export default model('company', companySchema)