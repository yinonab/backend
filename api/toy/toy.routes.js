import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAdmin, addToy)
toyRoutes.put('/', requireAdmin, updateToy)
toyRoutes.delete('/:id', requireAdmin, removeToy)

// router.delete('/:id', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAdmin, removeToyMsg)