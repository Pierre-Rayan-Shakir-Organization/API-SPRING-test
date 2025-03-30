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

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
);

export const connexionGoogle = async (req: Request, res: Response) => {
    const { token } = req.query;
  
    if (!token) {
      return res.status(400).send("Token JWT manquant");
    }
  
    // 🔒 Mettre le token dans un cookie httpOnly
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: false, // true si HTTPS
      maxAge: 5 * 60 * 1000,
    });
  
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.events"],
      prompt: "consent",
    });
  
    res.redirect(authUrl);
  };

