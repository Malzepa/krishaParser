import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
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

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
