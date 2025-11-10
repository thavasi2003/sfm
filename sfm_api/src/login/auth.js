/* AUTH ROUTES WITH GOOGLE + MICROSOFT + 2FA (JWT) */

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../config/user.js";
import LoginLog from "../config/loginLogs.js";


dotenv.config();
const router = express.Router();

/* ---------- HELPER: Generate 6-digit OTP ---------- */
const generate2FAToken = () => crypto.randomInt(100000, 999999).toString();

/* ---------- EMAIL TRANSPORTER ---------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------- EMAIL SENDER ---------- */
const send2FAEmail = async (email, token) => {
  try {
    await transporter.sendMail({
      from: `"Secure Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your 2FA Verification Code",
      text: `Your verification code is: ${token}`,
    });
    console.log(`2FA email sent to ${email}`);
  } catch (err) {
    console.error("Error sending 2FA email:", err.message);
  }
};

/* ---------- PASSPORT STRATEGIES ---------- */

/* ---- GOOGLE STRATEGY ---- */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email found in Google profile"));

        const otp = generate2FAToken();

        // Try find user by Google ID or email
        let user =
          (await User.findOne({ where: { googleId: profile.id } })) ||
          (await User.findOne({ where: { email } }));

        if (user) {
          user.googleId = profile.id;
          user.loginMethod = "google";
          user.twoFAToken = otp;
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            loginMethod: "google",
            is2FAEnabled: true,
            twoFAToken: otp,
          });
        }

        await send2FAEmail(email, otp);
        done(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        done(err, null);
      }
    }
  )
);

/* ---- MICROSOFT STRATEGY ---- */
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      scope: ["user.read", "email", "profile"],
      tenant: process.env.MICROSOFT_TENANT_ID,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email =
          profile.emails?.[0]?.value || profile._json?.userPrincipalName;

        if (!email) return done(new Error("No email found in Microsoft profile"));

        // Normalize external email formats
        if (email.includes("#EXT#")) {
          const match = email.match(/(.*)#EXT#@(.*)/);
          if (match) email = match[1];
        }
        if (email.includes("_gmail.com")) email = email.replace("_gmail.com", "@gmail.com");
        if (email.includes("_") && email.endsWith(".com")) email = email.replace("_", "@");

        const otp = generate2FAToken();

        let user =
          (await User.findOne({ where: { microsoftId: profile.id } })) ||
          (await User.findOne({ where: { email } }));

        if (user) {
          user.microsoftId = profile.id;
          user.email = email;
          user.loginMethod = "microsoft";
          user.twoFAToken = otp;
          await user.save();
        } else {
          user = await User.create({
            microsoftId: profile.id,
            name: profile.displayName,
            email,
            loginMethod: "microsoft",
            is2FAEnabled: true,
            twoFAToken: otp,
          });
        }

        await send2FAEmail(email, otp);
        done(null, user);
      } catch (err) {
        console.error("Microsoft Strategy Error:", err);
        done(err, null);
      }
    }
  )
);

/* ---------- PASSPORT SESSION ---------- */
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* ---------- ROUTES ---------- */

// Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(
      `http://localhost:3000/verify-2fa?email=${encodeURIComponent(req.user.email)}`
    );
  }
);

// Microsoft Login
router.get(
  "/microsoft",
  passport.authenticate("microsoft", { scope: ["user.read"] })
);

// Microsoft Callback
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(
      `http://localhost:3000/verify-2fa?email=${encodeURIComponent(req.user.email)}`
    );
  }
);
/* ---------- 2FA VERIFICATION temp---------- */
// router.post("/verify-2fa", async (req, res) => {
//   const { email, otp } = req.body;
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   const userAgent = req.headers["user-agent"];

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.twoFAToken)
//       return res.status(400).json({ message: "OTP expired or not generated" });

//     if (user.twoFAToken.trim() !== otp.trim())
//       return res.status(400).json({ message: "Invalid OTP" });

//     // ✅ Clear OTP
//     user.twoFAToken = null;
//     await user.save();

//     // ✅ JWT token
//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is missing!");
//       return res.status(500).json({ message: "Server config error" });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // ✅ Log the successful login
//     try {
//       await LoginLog.create({
//         userId: user.id,
//         email: user.email,
//         loginMethod: user.loginMethod || "2FA",
//         ipAddress: ip,
//         userAgent,
//         status: "success",
//         loginTime: new Date(),
//       });
//     } catch (logErr) {
//       console.error("LoginLog Error:", logErr);
//       // Do not block login if logging fails
//     }

//     res.json({
//       message: "2FA verification successful",
//       user,
//       token,
//     });
//   } catch (err) {
//     console.error("2FA Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


/* ---------- 2FA VERIFICATION ---------- */


router.post("/verify-2fa", async (req, res) => {
  const { email, otp } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.twoFAToken)
      return res.status(400).json({ message: "OTP expired or not generated" });

    if (user.twoFAToken.trim() !== otp.trim())
      return res.status(400).json({ message: "Invalid OTP" });

    // ✅ Clear OTP and issue JWT
    user.twoFAToken = null;
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Log the successful login
    await LoginLog.create({
      userId: user.id,
      email: user.email,
      loginMethod: user.loginMethod,
      ipAddress: ip,
      userAgent,
      status: "success",
      loginTime: new Date()
    });

    res.json({
      message: "2FA verification successful",
      user,
      token,
    });
  } catch (err) {
    console.error("2FA Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// /* ---------- LOGOUT ---------- */
// router.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.json({ message: "Logged out successfully" });
//   });
// });

// /* ---------- GET CURRENT USER ---------- */
// router.get("/", (req, res) => {
//   if (!req.user) return res.status(401).json({ message: "Not logged in" });
//   res.json(req.user);
// });

import moment from "moment-timezone"; // add at top if not there

/* ---------- LOGOUT WITH SINGAPORE TIME ---------- */
router.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    // Get current Singapore time
    const singaporeTime = moment().tz("Asia/Singapore").toDate();

    // Find the most recent login log for this user
    const latestLog = await LoginLog.findOne({
      where: { email },
      order: [["loginTime", "DESC"]],
    });

    if (latestLog) {
      latestLog.logoutTime = singaporeTime;
      await latestLog.save();
      console.log(`Logout time updated for ${email}`);
    } else {
      console.log(`No login record found for ${email}`);
    }

    res.json({ message: "Logout time recorded", time: singaporeTime });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
