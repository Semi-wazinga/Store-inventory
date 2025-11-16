const mongoose = require('mongoose');

async function connectDB(uri) {
    

    try {
        await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('connected to mongodb')
    } catch (err) {
       console.log("Connection error:", err)
    }
}

module.exports = connectDB