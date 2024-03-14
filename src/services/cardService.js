import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'


const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(cardModel.CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw error
  }
}

const validateBeforeCreate = async(data) => {
  return await cardModel.CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const pushCardOrderIds = async(card) => {
  try {
    const result = await GET_DB().collection(columnModel.COLUMN_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(card.columnId)
      },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
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
      ...reqBody,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    const createdNewCard = await GET_DB().collection(cardModel.CARD_COLLECTION_NAME).insertOne(data)
    // Lay du lieu vua created
    const getNewCard = await findOneById(createdNewCard.insertedId)

    if (getNewCard) {
      //Cap nhat lai mang orderIds
      await pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}

