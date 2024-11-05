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
exports.verifyToken = exports.verifyPassword = exports.verifyEmailLogin = exports.verifyEmailSingup = void 0;
const utilisateurService_1 = __importDefault(require("../database/utilisateurService"));
const secretKey_1 = require("../secretKey");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyEmailSingup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const utilisateurService = new utilisateurService_1.default();
    try {
        const user = req.body;
        const result = yield utilisateurService.verifyEmail(user.email);
        if (result === false) {
            req.user = user;
            next();
        }
        else {
            res.status(401).json({ "message": "Le mail existe déja" });
        }
    }
    catch (error) {
        res.status(401).json({ "error": error });
    }
});
exports.verifyEmailSingup = verifyEmailSingup;
const verifyEmailLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const utilisateurService = new utilisateurService_1.default();
    try {
        const user = req.body;
        const result = yield utilisateurService.verifyEmail(user.email);
        if (result) {
            req.userConnexion = user;
            next();
        }
        else {
            res.status(401).json("Le mail n'éxiste pas");
        }
    }
    catch (error) {
        res.status(401).json({ "error": error });
    }
});
exports.verifyEmailLogin = verifyEmailLogin;
const verifyPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const utilisateurService = new utilisateurService_1.default();
    try {
        const userConnexion = req.userConnexion;
        const result = yield utilisateurService.verifyPassword(userConnexion.email, userConnexion.password);
        if (result) {
            const user = yield utilisateurService.getUserByEmail(userConnexion.email);
            req.user = user;
            next();
        }
        else {
            res.status(401).json({ "message": "mot de passe incorrect" });
        }
    }
    catch (error) {
        res.status(404).json(error);
    }
});
exports.verifyPassword = verifyPassword;
const verifyToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        jsonwebtoken_1.default.verify(token, secretKey_1.secretKey, (error, decoded) => {
            if (error) {
                res.status(401).json({ "message": "Token non valide" });
                return;
            }
            const playload = decoded;
            req.user = playload;
            next();
        });
    }
    catch (error) {
        res.status(401).json({ "error": error });
    }
};
exports.verifyToken = verifyToken;
