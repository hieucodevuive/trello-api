import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async(req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    //Co ket qua thi tra ve client
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

export const cardController = {
  createNew
}