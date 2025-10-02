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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const seedAdmin_1 = require("./app/utils/seedAdmin");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server;
const startServer = () => {
    try {
        console.log(env_1.envVars.DATABASE_URL);
        mongoose_1.default.connect(env_1.envVars.DATABASE_URL);
        console.log("The mongodb is connected");
        server = app_1.app.listen(env_1.envVars.PORT, () => {
            console.log(`The server is running on the port of 5000`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seedAdmin_1.seedAdmin)();
}))();
