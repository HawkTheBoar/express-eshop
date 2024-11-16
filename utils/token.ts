import { sign } from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';


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
export const getTokenFromHeader = (header: IncomingHttpHeaders) => {
    if(!header) {
        throw new Error('Header is not provided')
    }
    const authHeader = header['authorization'];
    if(authHeader === undefined) {
        throw new Error('Authorization header is not present')
    }
    return authHeader.split(' ')[1];
}