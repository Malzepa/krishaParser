import axios from "axios";
import cheerio from "cheerio";
import mongoose from "mongoose";
import HouseInfo from "../../models/model";

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/krisha-parcer-ads");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function parseHouseInfo(url: string) {
  const urlPattern = /^https:\/\/krisha\.kz\/a\/show\/\d+$/;

  if (!urlPattern.test(url)) {
    console.error(
      "Invalid URL format. Please provide a valid krisha.kz house info URL."
    );
    return;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const id = url.split("/").pop();

    const titleElement = $(".offer__advert-title h1");
    const title =
      titleElement.length > 0 ? titleElement.text().trim() : "Unknown Title";

    const priceString = $(".offer__price").text().trim().replace(/\D/g, "");
    const price = parseInt(priceString) || 0;

    const buildingTypeElement = $(
      "div[data-name='flat.building'] .offer__advert-short-info"
    );
    const buildingType =
      buildingTypeElement.length > 0
        ? buildingTypeElement.text().trim()
        : "Unknown Building type";

    const yearBuildString = $(
      "div[data-name='house.year'] .offer__advert-short-info"
    )
      .text()
      .trim();
    const yearBuilt = parseInt(yearBuildString) || 0;

    const areaString = $(
      "div[data-name='live.square'] .offer__advert-short-info"
    )
      .text()
      .trim()
      .replace(/[^\d.]/g, "");
    const area = parseFloat(areaString) || 0;

    const bathroomElement = $(
      "div[data-name='flat.toilet'] .offer__advert-short-info"
    );
    const bathroom =
      bathroomElement.length > 0
        ? bathroomElement.text().trim()
        : "Unknown Bathroom";

    const floorInfoString = $(
      '.offer__info-item[data-name="flat.floor"] .offer__advert-short-info'
    )
      .text()
      .trim();
    const [floorString, totalFloorsString] = floorInfoString.split(" из ");
    const floor = parseInt(floorString) || 0;
    const totalFloors = parseInt(totalFloorsString) || 0;

    const houseInfo = new HouseInfo({
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

    await houseInfo.save();

    console.log("House info saved:", houseInfo);
  } catch (error) {
    console.error("Error parsing house info:", error);
  }
}

connectToDatabase();
