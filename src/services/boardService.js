/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from '~/models/boardModel'

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
    const result = await GET_DB().collection(boardModel.BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
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
  return await getDetailsById(boardId)
}

export const boardService = {
  createNew,
  getDetails
}
