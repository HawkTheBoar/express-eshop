const test = require("node:test")
import { loginUser, authenticateUser, createUser, getUser, isUserUnique } from "../services/auth";
import { InvalidCredentialsError, MissingCredentialsError } from "../models/errors";

describe('Auth services', ()=>{
    afterEach(()=>{
        jest.clearAllMocks()
    })
    describe('authenticateUser', () => {
        it('should throw an authentication error when some values are missing', () => {
            const email = 'example@email.com';
            const password = 'examplePassword'
            expect(authenticateUser('', password)).toThrow(MissingCredentialsError);
            expect(authenticateUser(email, '')).toThrow(MissingCredentialsError);
        });
        it('should throw an authentication error when email structure is invalid', () => {
            const emails = ['@hotmail.com', 'example.com', 'asdmop@', 'helloworld']
            emails.forEach(email => {
                expect(authenticateUser(email, 'examplePassword')).toThrow(InvalidCredentialsError)
            })
        });
        it('should throw an authentication error when password is invalid', () => {
            
        });

    })
})