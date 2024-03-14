import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(columnModel.COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw error
  }
}

const validateBeforeCreate = async(data) => {
  return await columnModel.COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//Them id cua column vao bang columnOrderIds trong board
const pushColumnOrderIds = async(column) => {
  try {
    const result = await GET_DB().collection(boardModel.BOARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(column.boardId)
      },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw error
  }
}
const createNew = async( reqBody ) => {
  try {
    //validate data before creating
    const validData = await validateBeforeCreate(reqBody)
    const data = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    const createdNewColumn = await GET_DB().collection(columnModel.COLUMN_COLLECTION_NAME).insertOne(data)
    // Lay du lieu vua created
    const getNewColumn = await findOneById(createdNewColumn.insertedId)

    //
    if (getNewColumn) {
      getNewColumn.cards = []
      //Cap nhat lai mang orderIds
      await pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew
}
