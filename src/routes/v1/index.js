import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoute'

const Router = express.Router()

//Chack API_v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

// Board APIs
Router.use('/boards', boardRoutes)

export const APIs_V1 = Router
