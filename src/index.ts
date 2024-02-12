/* eslint-disable import/first */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as OpenApiValidator from 'express-openapi-validator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { gameController } from './initialization';
import { handleError } from './controllers/middleware/handle-error';

const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('**db connected**');
  } catch (err) {
    console.log(err);
  }
})();

app.use(cors({ credentials: true, origin: true }));
app.use(
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
  }
);
app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: './validation/api-validation.yaml',
    validateRequests: true,
    validateResponses: true
  }),
);

app.use('/game', gameController.toRouter());

app.use(handleError);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running on port ${port}`));
