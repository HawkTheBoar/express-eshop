require('dotenv').config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import { verifyToken } from './middleware/auth';
import path from 'path';
import cookieParser from 'cookie-parser'
import { getUser } from './services/auth';


const app = express();
const port = 3000;
// set ejs as frontend
app.set('view engine', 'ejs')
// set views folder to path
app.set('views', path.join(__dirname, 'views'))

// applying middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())



// applying routes from other applications
app.use('/auth', authRoutes);


app.get('/', verifyToken, async (req: Request, res: Response) => {
  const user = await getUser(req.params.email)
  res.render('index/storefront', { products: [], user: user })
});

app.listen(port,  () => {
  console.log(`Server started at http://localhost:${port}`);
});
