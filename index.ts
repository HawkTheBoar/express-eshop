require('dotenv').config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import { verifyToken } from './middleware/auth';


const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.get('/', verifyToken, (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port,  () => {
  console.log(`Server started at http://localhost:${port}`);
});
