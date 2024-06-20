const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL_LOCAl)
    .then((con) => {
      console.log(`DateBase connnected: ${con.connection.host}`);
    })
    // .catch((err) => {
    //   console.error(`Database Error:${err}`);
    //   process.exit(1);
    // });
};

module.exports = dbConnection;
