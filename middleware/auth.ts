import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { getTokenFromCookie } from '../utils/token';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    if(process.env.JWT_SECRET === undefined) {
        throw new Error('JWT_SECRET is not defined')
    }
    try{
        const token = getTokenFromCookie(req);
        
        const payload = await jwt.verify(token, process.env.JWT_SECRET) as any
        
        req.params.email = payload.email;
        next()
    }
    catch(err: any){
        const originalUrl = req.originalUrl;
        return res.redirect(`/auth/login/?next=${encodeURIComponent(originalUrl)}`);
    }

}