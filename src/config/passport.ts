import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { client } from './prisma';
import { hashData } from '../utils/hash';
import { generateRandomToken } from '../utils/token';
import { BASEPATH } from '../constants';

dotenv.config();

interface User {
  id: string;
  name: string | null;
  email: string | null;
  profilePic: string | null;
  strategy: string | null;
  strategyId: string | null;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  hashedRefreshToken: string;
}

interface UserData {
  name: string | null;
  email: string | null;
  profilePic: string | null;
  strategy: string | null;
  strategyId: string | null;
}

const generateTokens = (userId: string, role: string, email: string): Tokens => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secrets not configured');
  }

  const accessToken = jwt.sign({ id: userId, role: role, email: email }, jwtSecret, {
    expiresIn: '15m',
  });

  const refreshToken = generateRandomToken(15);
  const hashedRefreshToken = hashData(refreshToken);

  return { accessToken, refreshToken, hashedRefreshToken };
};

const setRefreshToken = async (token: string, userId: string) => {
  try {
    await client.loginSession.create({
      data: {
        token: token,
        userId: userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    return error;
  }
};

export const findOrCreateUser = async ({
  name,
  email,
  profilePic,
  strategy,
  strategyId,
}: UserData): Promise<{ user: User; tokens: Tokens }> => {
  let user;
  user = await client.user.findUnique({
    where: { email: email! },
  });

  if (!user) {
    user = await client.user.create({
      data: {
        name: name,
        email: email!,
        profilePic: profilePic,
        strategy: strategy,
        strategyId: strategyId,
      },
    });

    // TODO
    // create user's plan here
    // setting also
    // and other db if neeeded
  }

  const tokens = generateTokens(user.id, user.role, user.email);
  await setRefreshToken(tokens.hashedRefreshToken, user.id);

  return { user, tokens };
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `${BASEPATH}/auth/google/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        const userData: UserData = {
          name: profile.displayName || profile.username || 'Unknown',
          email: profile.emails?.[0]?.value || null,
          profilePic: profile.photos?.[0]?.value || null,
          strategy: 'google',
          strategyId: profile.id,
        };

        const { user, tokens } = await findOrCreateUser(userData);
        return done(null, { user, tokens });
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      callbackURL: `${BASEPATH}/auth/github/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        const userData: UserData = {
          name: profile.displayName || profile.username || 'Unknown',
          email: profile.emails?.[0]?.value || null,
          profilePic: profile.photos?.[0]?.value || null,
          strategy: 'github',
          strategyId: profile.id,
        };

        const { user, tokens } = await findOrCreateUser(userData);
        return done(null, { user, tokens });
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
