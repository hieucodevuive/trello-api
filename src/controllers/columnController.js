import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async(req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body)
    //Co ket qua thi tra ve client
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) { next(error) }
}

export const columnController = {
  createNew
}