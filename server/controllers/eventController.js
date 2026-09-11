const Event = require('../models/eventModel')

const getAllEvent = async (req, res) => {
    try {
        const filters = {}

        if (req.query.category) filters.category = req.query.category
        if (req.query.ticketPrice) filters.ticketPrice = req.query.ticketPrice

        const events = await Event.find(filters).sort({ date: 1 })
        res.json(events)
    } catch (error) {
        res.status(500).json({ message: 'Unable to load events' })
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) return res.status(404).json({ message: 'Event not found' })
        res.json(event)
    } catch (error) {
        res.status(404).json({ message: 'Event not found' })
    }
}

const createEvent = async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, createdBy: req.user._id })
        res.status(201).json(event)
    } catch (error) {
        res.status(400).json({ message: 'Unable to create event' })
    }
}

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!event) return res.status(404).json({ message: 'Event not found' })
        res.json(event)
    } catch (error) {
        res.status(400).json({ message: 'Unable to update event' })
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        if (!event) return res.status(404).json({ message: 'Event not found' })
        res.json({ message: 'Event deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Unable to delete event' })
    }
}

module.exports = { getAllEvent, getEventById, createEvent, updateEvent, deleteEvent }
