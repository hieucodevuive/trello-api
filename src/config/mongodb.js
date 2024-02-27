import { env } from './environment'

import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDatabaseInstance = null

//Khoi tao doi tuong mongoClient de connect toi Mongo Database
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // goi ket noi toi mongo db atlas voi URI da khai bao
  await mongoClientInstance.connect()
  //Ket nnoi thanh cong thi lay data base thong qua name
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to database first!')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}