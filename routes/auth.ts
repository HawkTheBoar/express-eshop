import express, { NextFunction, Request, Response} from 'express';
import { authenticateUser, createUser, getUser, loginUser} from '../services/auth';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello auth!');
});

router.get('/login', (req: Request, res: Response) => {
    res.send('Login');
});

router.get('/register', (req: Request, res: Response) => {
    res.send('Register');
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try{
        const user = await authenticateUser(email, password)
        loginUser(user, res)
        res.status(200).send('Logged in Successfully');

    }
    catch(err: any){
        res.status(400).send(err.message);
    }
});
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    
    try{
        const { email, password, username } = req.body;

        const user = await createUser(email, password, username);
        loginUser(user, res);
        res.status(200).send('Registered Successfully');

    }
    catch(err: any){
        res.status(400).send(err.message);
        next(err);
    }

});

export default router;