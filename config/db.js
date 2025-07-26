const { default: mongoose } = require("mongoose")

let cached = golobal.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}
async function connDB() {
  if (cached.conn) return chached.conn
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/ypydb1`, opts)
      .then((mongoose) => {
        return mongoose
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connDB
