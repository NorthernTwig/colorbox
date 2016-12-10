import express from 'express'
import multer from 'multer'
import images from '../routes/images.js'
import cors from 'cors'
const app = express()
const PORT = 3001

export default () => {
    app.use(cors())

    app.use('/images', images)

    app.use('*', (req, res) => {
        return res.send('Not valid')
    })

    app.listen(PORT, () => {
        console.log('Express up. ' + PORT)
    })
}
