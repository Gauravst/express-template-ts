import { Router } from 'express';
import passport from '../config/passport';
import { authCallback, getUser, logoutUser } from '../controllers/auth';
import { auth } from '../middlewares/auth';

const router = Router();

// google auth route
router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

// githhub auth route
router.route('/github').get(passport.authenticate('github', { scope: ['user:email'] }));

// google auth callback
router
  .route('/google/callback')
  .get(passport.authenticate('google', { session: false }), authCallback);

// GitHub Auth Routes
router
  .route('/github/callback')
  .get(passport.authenticate('github', { session: false }), authCallback);

// Get User & Logout
router.route('/me').get(auth, getUser);
router.route('/logout').post(auth, logoutUser);

export default router;
