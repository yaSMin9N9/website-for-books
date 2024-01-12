const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect("mongodb+srv://mino:RJAprvEDUloW4Si7@cluster0.v4aub5m.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
    }
};
