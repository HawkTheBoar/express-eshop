import prisma from '../prisma/prisma_client'
import bcrypt from 'bcrypt'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/token'
import isValidEmail from '../utils/email';

export const getUser = async (email: string) => {
    if(!email) {
        throw new Error('Email is not provided')
    }

    const user = await prisma.user.findUnique({
    where: {
      email: email
    }
    });
    if(!user)
    {
        throw new Error('Invalid user');
    }
    user.password = ''
    return user;
}
export const isUserUnique = async (email: string, username: string) => { 
    if(!email || !username)
        throw new Error('Email or username is not provided')
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
        throw new Error('Email, password or username is not provided')
    }
    if(!isValidEmail(email)) {
        throw new Error('Invalid email')
    }
    if(await isUserUnique(email, username)) {
        throw new Error('User already exists')
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
        throw new Error('Email or password is not provided')
    }
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if(user === null || user === undefined) {
        throw new Error('Authentication failed')
    }
    const match = await bcrypt.compare(password, user.password)
    if(match) {
        return user
    } else {
        throw new Error('Authentication failed')
    }
}
export const loginUser = (user: { email: string }, res: Response) =>{
    if(user.email === undefined) {
        throw new Error('User email is not defined');
    }

    const token = generateToken(user.email);
    res.cookie('authToken', token);

    return token;
} 
