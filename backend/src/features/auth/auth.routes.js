import express from 'express';
import { changePassword, loginUser, logout, myProfile, signupUser, verifyOtp } from './auth.controller.js';
import { loginRequired } from '../../utils/loginRequired.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/verify-otp', verifyOtp);
router.post('/logout', loginRequired, logout);
router.get('/my-profile', loginRequired, myProfile);
router.put('/change-password', loginRequired, changePassword)

export default router;