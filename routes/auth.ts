import express, { NextFunction, Request, Response} from 'express';
import { authenticateUser, createUser, getUser, loginUser} from '../services/auth';

const router = express.Router();


router.all('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect(`/auth/login/?next=%2F`)
})

router.get('/login', (req: Request, res: Response) => {
    const nextUrl = typeof req.query.next === 'string' ? req.query.next : '/';
    const error = req.query.error;
    
    res.render('auth/login', {next: nextUrl, error: error })
});

router.get('/register', (req: Request, res: Response) => {
    const error = req.query.error;
    res.render('auth/register', { error: error });
});

router.post('/login', async (req: Request, res: Response, next) => {
    const { email, password } = req.body;
    let nextUrl = req.query.next;
    nextUrl = typeof req.query.next === 'string' ? req.query.next : '/';
    try{
        const user = await authenticateUser(email, password)
        loginUser(user, res)
        res.redirect(nextUrl);
    }
    catch(err: any){
        res.status(401).redirect(`/auth/login/?next=${nextUrl}&error=${err.message}`);
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
        res.status(400).redirect(`/auth/register?error=${err.message}`);
        next(err);
    }

});

export default router;