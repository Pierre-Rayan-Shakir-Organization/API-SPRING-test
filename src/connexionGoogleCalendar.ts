import { google } from "googleapis";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

/*
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);
*/

const oauth2Client = new google.auth.OAuth2(
    "898958448984-3glgj7qig64qfh2vn81chlpsq9utb7g4.apps.googleusercontent.com",
    "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",
    "http://localhost:4000"
);

export const connexionGoogle = async (req : Request, res : Response) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        prompt: "consent",
    });
    res.redirect(authUrl);
}
