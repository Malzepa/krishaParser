"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHouseInfo = void 0;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var mongoose_1 = require("mongoose");
var model_1 = require("../../models/model");
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mongoose_1.default.connect("mongodb://localhost:27017/krisha-parcer-ads")];
                case 1:
                    _a.sent();
                    console.log("MongoDB connected");
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("MongoDB connection error:", error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function parseHouseInfo(url) {
    return __awaiter(this, void 0, void 0, function () {
        var urlPattern, response, html, $, id, titleElement, title, priceString, price, buildingTypeElement, buildingType, yearBuildString, yearBuilt, areaString, area, bathroomElement, bathroom, floorInfoString, _a, floorString, totalFloorsString, floor, totalFloors, houseInfo, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    urlPattern = /^https:\/\/krisha\.kz\/a\/show\/\d+$/;
                    if (!urlPattern.test(url)) {
                        console.error("Invalid URL format. Please provide a valid krisha.kz house info URL.");
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _b.sent();
                    html = response.data;
                    $ = cheerio_1.default.load(html);
                    id = url.split("/").pop();
                    titleElement = $(".offer__advert-title h1");
                    title = titleElement.length > 0 ? titleElement.text().trim() : "Unknown Title";
                    priceString = $(".offer__price").text().trim().replace(/\D/g, "");
                    price = parseInt(priceString) || 0;
                    buildingTypeElement = $("div[data-name='flat.building'] .offer__advert-short-info");
                    buildingType = buildingTypeElement.length > 0
                        ? buildingTypeElement.text().trim()
                        : "Unknown Building type";
                    yearBuildString = $("div[data-name='house.year'] .offer__advert-short-info")
                        .text()
                        .trim();
                    yearBuilt = parseInt(yearBuildString) || 0;
                    areaString = $("div[data-name='live.square'] .offer__advert-short-info")
                        .text()
                        .trim()
                        .replace(/[^\d.]/g, "");
                    area = parseFloat(areaString) || 0;
                    bathroomElement = $("div[data-name='flat.toilet'] .offer__advert-short-info");
                    bathroom = bathroomElement.length > 0
                        ? bathroomElement.text().trim()
                        : "Unknown Bathroom";
                    floorInfoString = $('.offer__info-item[data-name="flat.floor"] .offer__advert-short-info')
                        .text()
                        .trim();
                    _a = floorInfoString.split(" из "), floorString = _a[0], totalFloorsString = _a[1];
                    floor = parseInt(floorString) || 0;
                    totalFloors = parseInt(totalFloorsString) || 0;
                    houseInfo = new model_1.default({
                        id: id,
                        title: title,
                        price: price,
                        buildingType: buildingType,
                        yearBuilt: yearBuilt,
                        area: area,
                        bathroom: bathroom,
                        floor: floor,
                        totalFloors: totalFloors,
                    });
                    return [4 /*yield*/, houseInfo.save()];
                case 3:
                    _b.sent();
                    console.log("House info saved:", houseInfo);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    console.error("Error parsing house info:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.parseHouseInfo = parseHouseInfo;
connectToDatabase();
