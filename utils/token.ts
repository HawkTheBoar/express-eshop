import { sign } from 'jsonwebtoken';
import { Request } from 'express';


export const generateToken = (email: string) => {
    if(!email) {
        throw new Error('Email is not provided')
    }

    if(process.env.JWT_SECRET === undefined) {
        throw new Error('JWT_SECRET is not defined')
    }
    if(process.env.JWT_EXP === undefined) {
        throw new Error('JWT_EXP is not defined')
    }
    return sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP.toString() });
}
export const getTokenFromCookie = (request: Request) => {
    if(!request) {
        throw new Error('Request is not provided')
    }
    let authCookie = undefined;
    if(request.cookies)
        authCookie = request.cookies.authToken;
    
    if(authCookie === undefined) {
        throw new Error('Authorization header is not present')
    }
    return authCookie;
}