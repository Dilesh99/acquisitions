import { signup } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  // Sign-in logic here
  res.send('POST/api/auth/sign-in response');
});

router.post('/sign-out', (req, res) => {
  // Sign-out logic here
  res.send('POST/api/auth/sign-out response');
});

export default router;