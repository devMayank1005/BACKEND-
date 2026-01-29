function connectToDb() {
    mongoose.connect('mongodb+srv://devmayank1005_db_user:kvRx4RWKxJztRj6Q@cluster0.usa0ewy.mongodb.net/Day7').then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log("Error connecting to DB", err);
    });
}
    module.exports = connectToDb;
// db sai connection krna

