import mongoose from "mongoose";

const connectToDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Succcesffuly connected to DB");
  } catch (err) {
    console.log("DB Connection failed.", err);
  }
};

export default connectToDB;
