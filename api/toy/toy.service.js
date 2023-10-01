import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

async function query(filterBy = {}) {
    let criteria = {}

    try {
        if (filterBy.txt) {
            criteria.name = { $regex: filterBy.txt, $options: 'i' }
        }
        if (filterBy.labels && filterBy.labels[0]) {
            criteria.labels = { $in: filterBy.labels }
        }
        if (filterBy.inStock !== undefined) {
            if (filterBy.inStock === 'true') {
                criteria.inStock = true 
            } else if (filterBy.inStock === 'false') {
                criteria.inStock = false 
            }
        }

        console.log('filterBy', filterBy)
        const collection = await dbService.getCollection('toys')
        const toys = await collection.find(criteria).toArray()
        console.log('toys', toys)

        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        console.log('toyId:', toyId)
        const collection = await dbService.getCollection('toys')
        const toy = collection.findOne({ _id: new ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toys')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toys')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
           
            name: toy.name,
            price: toy.price,
            inStock: toy.inStock,
            review: toy.review,
        }
        const collection = await dbService.getCollection('toys')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toys')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toys')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg
}
