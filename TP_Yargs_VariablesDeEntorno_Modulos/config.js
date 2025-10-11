import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT,
    mode: process.env.MODE
};