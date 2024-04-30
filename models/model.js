"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var listingSchema = new mongoose_1.default.Schema({
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
var Listing = mongoose_1.default.model("Listing", listingSchema);
exports.default = Listing;
