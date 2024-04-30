import mongoose from "mongoose";

const houseInfoSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  buildingType: String,
  yearBuilt: Number,
  area: Number,
  bathroom: String,
  floor: Number,
  totalFloors: Number,
});

const HouseInfo = mongoose.model("HouseInfo", houseInfoSchema);

export default HouseInfo;
