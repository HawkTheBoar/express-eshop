import express, { NextFunction, Request, Response} from 'express';
import { authenticateUser, createUser, getUser, loginUser} from '../services/auth';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello auth!');
});

router.all('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect(`/auth/login/?next=%2F`)
})

router.get('/login', (req: Request, res: Response) => {
    const nextUrl = typeof req.query.next === 'string' ? req.query.next : '/bruh/undefined';
    res.render('auth/login', {next: nextUrl})
});

router.get('/register', (req: Request, res: Response) => {
    res.render('auth/register');
});

router.post('/login', async (req: Request, res: Response, next) => {
    const { email, password } = req.body;
    try{
        const user = await authenticateUser(email, password)
        loginUser(user, res)
        
    }
    catch(err: any){
        res.status(400).send(err.message);
    }
    finally{
        let nextUrl = req.query.next;
        nextUrl = typeof req.query.next === 'string' ? req.query.next : '/';
        res.redirect(nextUrl);
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