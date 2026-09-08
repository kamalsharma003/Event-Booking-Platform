// const express = require('express')
// const router = express.Router()
// const {pretect, admin, protect} = require('../middleware/auth')

// router.get('/', getAllEvent)
// router.get('/:id', getEventById)
// router.post('/', protect, admin, createEvent)
// router.put('/:id',protect, admin, updateEvent)
// router.delete('/:id', protect, admin, deleteEvent)

// module.exports = router

const express = require('express')

const router = express.Router()

const { protect, admin } = require('../middleware/auth')

const {
    getAllEvent,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController')

router.get('/', getAllEvent)

router.get('/:id', getEventById)

router.post('/', protect, admin, createEvent)

router.put('/:id', protect, admin, updateEvent)

router.delete('/:id', protect, admin, deleteEvent)

module.exports = router

