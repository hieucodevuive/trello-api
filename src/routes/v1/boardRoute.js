import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs get list board' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

//API ho tro viec di chuyencard giua cac column
Router.route('/supports/moving_cards')
  .put(boardValidation.moveCardToDiffColumn, boardController.moveCardToDiffColumn)
export const boardRoutes = Router