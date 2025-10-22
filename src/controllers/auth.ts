import { Request, Response } from 'express';
import { OsuAccessToken, OsuUser } from '../types/osu';
import prisma from 'src/prisma';
import * as jwt from 'jsonwebtoken';
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('Missing required environment variables for OAuth2');
}

const route = {
  async login(req: Request, res: Response) {
    const redirectUri = `https://osu.ppy.sh/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI!
    )}&response_type=code&scope=identify`;

    res.redirect(redirectUri);
  },
  async callback(req: Request, res: Response) {
    const { code } = req.query;
    try {
      const response = await fetch('https://osu.ppy.sh/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: CLIENT_ID!,
          client_secret: CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI!,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ error: 'there was an error', details: errorData });
      }
      const tokenData: OsuAccessToken = (await response.json()) as OsuAccessToken;

      const userRes = await fetch('https://osu.ppy.sh/api/v2/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token as String}` },
      });
      if (!userRes.ok) {
        const errorData = await userRes.json();
        return res
          .status(userRes.status)
          .json({ error: 'Failed to fetch user data', details: errorData });
      }
      const userData = await userRes.json();
      const osuProfile = userData as OsuUser;

      console.log(userData);

      const user = await prisma.osuUser.upsert({
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

      const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });

      res.cookie('token', jwtToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  },
  async logout(req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
    });

    res.json({ ok: true });
  },
};
export default route;
