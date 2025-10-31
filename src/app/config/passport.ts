import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IRole, IUser } from "../modules/user/user.interface";

console.log(envVars.GOOGLE_CLIENT_ID, envVars.GOOGLE_CLIENT_SECRET)

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          const userInfo: Partial<IUser> = {
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            auths: [
              {
                providerId: profile.id,
                providerName: "Google",
              },
            ],
            isVerified: true,
            role: IRole.RIDER,
          };

          user = await User.create(userInfo);
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
