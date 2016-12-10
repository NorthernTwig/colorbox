import express from 'express'
import cors from 'cors'
import path from 'path'
import fsp from 'fs-promise'
import multer from 'multer'
import superMegaJson from '../images/superMegaJson.json'
const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/save', upload.single('file'), (req, res) => {
    const obj = {
      color: req.body.color,
      path: req.file.originalname
    }

    superMegaJson.push(obj)

    fsp.writeFile('images/superMegaJson.json', JSON.stringify(superMegaJson))
    .then(() => fsp.readFile(req.file.path))
    .then(imageData => fsp.writeFile('images/' + req.file.originalname, imageData, {
      encoding: 'binary'
    }))
    .then(() => fsp.unlink(req.file.path))
    .then(() => res.send(true))
})

router.get('/load/:image', (req, res) => {
  res.sendFile(req.params.image, {root: __dirname + '/../images'});
})

router.get('/load', (req, res) => {
  //res.setHeader('Content-Type', 'application/json')
  fsp.readFile('images/superMegaJson.json', 'utf-8')
    .then(file => res.send(file))
})

export default router
