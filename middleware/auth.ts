import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { getTokenFromHeader } from '../utils/token';

export const verifyToken = async (req: Request, res: Response) => {
    if(process.env.JWT_SECRET === undefined) {
        throw new Error('JWT_SECRET is not defined')
    }
    try{
        const token = getTokenFromHeader(req.headers);
        const payload = await jwt.verify(token, process.env.JWT_SECRET)
        console.log(payload)

    }
    catch(err: any){
        res.status(401).send(err.message);
    }

}