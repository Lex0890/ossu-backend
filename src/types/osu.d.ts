// packages/shared/src/types/osu.ts

/** OAuth2 token devuelto por osu! */
export interface OsuAccessToken {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token?: string;
  created_at: number;
}

/** Token extendido (con campos calculados/locales) */
export interface OsuToken {
  token_type: 'Bearer';
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at: number;
  /** Tiempo exacto de expiración en ms */
  expires_at: number;
  /** ID de usuario asociado, opcional */
  user_id?: number;
}

/** Información del usuario obtenida desde /api/v2/me */
export interface OsuUser {
  id: number;
  osuId: number;
  username: string;
  avatar_url: string | null;
  country_code: string | null;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  statistics: {
    global_rank?: number;
    pp: number;
    country_rank: number;
    hit_accuracy: number;
    play_count: number;
    play_time: number;
    level: {
      current: number;
    };
  };
}

/** Estructura combinada para sesiones */
export interface OsuSession {
  user: OsuUser;
  token: OsuToken;
}
