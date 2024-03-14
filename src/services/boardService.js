/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(boardModel.BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw error
  }
}

const getDetailsById = async(id) => {
  try {
    const result = await GET_DB().collection(boardModel.BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(id),
        _destroy: false
      } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw error
  }
}

const validateBeforeCreate = async(data) => {
  return await boardModel.BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async( reqBody ) => {
  try {
    //Validate data before creating
    const data = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //validate data before creating
    const validData = await validateBeforeCreate(data)
    const createdNewBoard = await GET_DB().collection(boardModel.BOARD_COLLECTION_NAME).insertOne(validData)
    // Lay du lieu vua created
    const getNewBoard = await findOneById(createdNewBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async(boardId) => {
  try {
    const board = await getDetailsById(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    //clone the board
    const resBoard = cloneDeep(board)
    // Dua card vao dung column cua no
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    //Xoa cards cu cua board  vi no da duoc day vao trong column roi
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
