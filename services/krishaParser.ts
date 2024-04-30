import axios from "axios";
import cheerio from "cheerio";
import mongoose from "mongoose";
import Listing from "../models/model";

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/krisha-parcer-ads");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function parseListing(url: string) {
  const urlPattern = /^https:\/\/krisha\.kz\/a\/show\/\d+$/;

  if (!urlPattern.test(url)) {
    console.error(
      "Invalid URL format. Please provide a valid krisha.kz listing URL."
    );
    return;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const id = url.split("/").pop();
    const title = $(".offer__advert-title h1").text().trim();
    const price = parseInt($(".offer__price").text().trim().replace(/\D/g, ""));
    const buildingType = $(
      "div[data-name='flat.building'] .offer__advert-short-info"
    )
      .text()
      .trim();
    const yearBuilt = parseInt(
      $("div[data-name='house.year'] .offer__advert-short-info").text().trim()
    );
    const area = parseInt(
      $("div[data-name='live.square'] .offer__advert-short-info")
        .text()
        .trim()
        .replace(/\D/g, "")
    );
    const bathroom = $("div[data-name='flat.toilet'] .offer__advert-short-info")
      .text()
      .trim();
    const floorInfo = $(
      '.offer__info-item[data-name="flat.floor"] .offer__advert-short-info'
    )
      .text()
      .trim();
    const [floor, totalFloors] = floorInfo.split(" из ");

    const listing = new Listing({
      id,
      title,
      price,
      buildingType,
      yearBuilt,
      area,
      bathroom,
      floor,
      totalFloors,
    });

    await listing.save();

    console.log("Listing saved:", listing);
  } catch (error) {
    console.error("Error parsing listing:", error);
  }
}

// export async function parseKrishaAd(url: string): Promise<void> {
//   const response = await axios.get(url);
//   const $ = cheerio.load(response.data);

connectToDatabase();
