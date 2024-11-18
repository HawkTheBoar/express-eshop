import prisma from '../prisma/prisma_client'
import bcrypt from 'bcrypt'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/token'
import isValidEmail from '../utils/email';
import { InvalidCredentialsError, HttpError, InsufficientPermissionsError, MissingCredentialsError, NotFoundError } from '../models/errors'

export const getUser = async (email: string) => {
    if(!email) {
        throw new MissingCredentialsError({message: 'Email is required.'})
    }

    const user = await prisma.user.findUnique({
    where: {
      email: email
    }
    });
    if(!user)
    {
        throw new NotFoundError({ message: 'User not found'})
    }
    user.password = ''
    return user;
}
export const isUserUnique = async (email: string, username: string) => { 
    if(!email || !username)
        throw new MissingCredentialsError({message: 'Email and password are required.'})
    const userByEmail = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    const userByUsername = await prisma.user.findFirst({
        where: {
            username: username
        }
    })
    return userByEmail !== null || userByUsername !== null
}
export const createUser = async (email: string, password: string, username: string) => {
    if(!email || !password || !username) {
        throw new MissingCredentialsError({ message: 'Email, password and username is required' })
    }
    if(!isValidEmail(email)) {
        throw new InvalidCredentialsError({ message: 'Invalid email provided.'})
    }
    if(await isUserUnique(email, username)) {
        throw new HttpError(400, 'User alredy exists');
    }

    if(process.env.SALT_ROUNDS === undefined) {
        throw new Error('SALT_ROUNDS is not defined')
    }

    const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS)
    const user = await prisma.user.create({
    data : {
        username: username,
        email: email,
        password: hashedPassword
    },
    })
    user.password = ''
    return user;
}
export const authenticateUser = async (email: string, password: string) => {
    if(!email || !password) {
        throw new MissingCredentialsError({message: 'Email and password are required.'})
    }
    if(!isValidEmail(email)) {
        throw new InvalidCredentialsError({ message: 'Invalid email provided.'});
    }
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if(user === null || user === undefined) {
        throw new InvalidCredentialsError()
    }
    const match = await bcrypt.compare(password, user.password)
    if(match) {
        return user
    } else {
        throw new InvalidCredentialsError()
    }
}
export const loginUser = (user: { email: string }, res: Response) =>{
    if(user.email === undefined) {
        throw new MissingCredentialsError();
    }

    const token = generateToken(user.email);
    res.cookie('authToken', token);

    return token;
} 
