// const Event = require('../models/eventModel')

// const getAllEvent = async(req, res) => {

//     try{
//         const filters = {}
//         if(req.query.category){
//             filters.category = req.query.category
//         }
//         if(req.query.ticketPrece){
//             filters.ticketPrece = req.query.ticketPrece
//         }

//         const events = await Event.find(filters)
//         res.json(events)
//     } catch(error){
//         res.status(500).json({error: error.message})
//     }

// };

// const getEventById = async (req, res) =>{
//     try{
//         const event = await Event.findById(req.param.id)
//         if (!event) {
//             res.status(404).json({message:'event not found'})
//         }
//         res.json({message:'event delete successefully'})
//     }
//     catch{
//         res.status(500).json({error: error.message})
    
//     }

// }

// const createEvent = async (req, res ) =>{
//     const {title, description , date, location, cetagory ,totolSeats, ticketPrece, imageUrl} = req.body;

//     try{

        
//         const event = await Event.create({
//             title,
//             description,
//             date,
//             location,
//             cetagory,
//             totalSeats,
//             ticketPrice,
//             imageUrl
            
//         })
//         res.status(201).json(event)
//     } catch(error){
//         res.status(500).json({error: error.message})


//     }
// }

// const updateById = async (req, res) =>{
//     const {title, description , date, location, cetagory ,totolSeats, ticketPrece, imageUrl} = req.body;

//     try{

        
//         const event = await Event.create({
//             title,
//             description,
//             date,
//             location,
//             cetagory,
//             totalSeats,
//             ticketPrice,
//             imageUrl
            
//         })
//         res.status(201).json(event)
//     } catch(error){
//         res.status(500).json({error: error.message})


//     }

// }




// const  deleteEvent = async (req, res ) =>{
//     try{

//         const event = await Event.findByIdAndDelete(req.param.id)
//         if (!event) {
//             res.status(404).json({message:'event not found'})
//         }
//         res.json({message:'event delete successefully'})
//     }
//     catch{
//         res.status(500).json({error: error.message})
//     }
    

// }

const Event = require('../models/eventModel')

const getAllEvent = async (req, res) => {
    try {
        const filters = {}
        if (req.query.category) {
            filters.category = req.query.category
        }
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice
        }

        const events = await Event.find(filters)
        res.json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'event not found' })
        }
        res.json(event)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createEvent = async (req, res) => {
    const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body

    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl
        })
        res.status(201).json(event)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateById = async (req, res) => {
    const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body

    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location, category, totalSeats, ticketPrice, imageUrl },
            { new: true, runValidators: true }
        )
        if (!event) {
            return res.status(404).json({ message: 'event not found' })
        }
        res.json(event)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'event not found' })
        }
        res.json({ message: 'event deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getAllEvent, getEventById, createEvent, updateById, deleteEvent }