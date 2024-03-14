import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoute'
import { cardRoutes } from './cardRoute'
import { columnRoutes } from './columnRoute'

const Router = express.Router()

//Chack API_v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

// Board APIs
Router.use('/boards', boardRoutes)

// Column APIs
Router.use('/columns', columnRoutes)

// Card APIs
Router.use('/cards', cardRoutes)

export const APIs_V1 = Router
