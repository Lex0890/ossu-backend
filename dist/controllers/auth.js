"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("src/prisma"));
const jwt = __importStar(require("jsonwebtoken"));
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('Missing required environment variables for OAuth2');
}
const route = {
    async login(req, res) {
        const redirectUri = `https://osu.ppy.sh/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
        res.redirect(redirectUri);
    },
    async callback(req, res) {
        const { code } = req.query;
        try {
            const response = await fetch('https://osu.ppy.sh/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: REDIRECT_URI,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return res
                    .status(response.status)
                    .json({ error: 'there was an error', details: errorData });
            }
            const tokenData = (await response.json());
            const userRes = await fetch('https://osu.ppy.sh/api/v2/me', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            if (!userRes.ok) {
                const errorData = await userRes.json();
                return res
                    .status(userRes.status)
                    .json({ error: 'Failed to fetch user data', details: errorData });
            }
            const userData = await userRes.json();
            const osuProfile = userData;
            console.log(userData);
            const user = await prisma_1.default.osuUser.upsert({
                where: { osuId: osuProfile.id },
                update: {
                    username: osuProfile.username,
                    avatarUrl: osuProfile.avatar_url,
                    country: osuProfile.country_code,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    pp: osuProfile.statistics.pp,
                    rank: osuProfile.statistics.global_rank,
                    countryRank: osuProfile.statistics.country_rank,
                    accuracy: osuProfile.statistics.hit_accuracy,
                    level: osuProfile.statistics.level.current,
                    hoursPlayed: osuProfile.statistics.play_time / 3600,
                    updatedAt: new Date(),
                },
                create: {
                    osuId: osuProfile.id,
                    username: osuProfile.username,
                    avatarUrl: osuProfile.avatar_url,
                    country: osuProfile.country_code,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token || '',
                    pp: osuProfile.statistics.pp,
                    rank: osuProfile.statistics.global_rank,
                    countryRank: osuProfile.statistics.country_rank,
                    accuracy: osuProfile.statistics.hit_accuracy,
                    level: osuProfile.statistics.level.current,
                },
            });
            const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: '7d',
            });
            res.cookie('token', jwtToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.redirect(`${process.env.FRONTEND_URL}`);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    },
    async logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
        });
        res.json({ ok: true });
    },
};
exports.default = route;
