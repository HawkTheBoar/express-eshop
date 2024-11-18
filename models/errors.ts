interface HttpErrorOptions {
    errorCode?: number;
    message?: string;
}
class HttpError extends Error{
    public readonly errorCode: number;
    constructor(errorCode: number, message: string){
        super(message);
        this.errorCode = errorCode;
    }
}

class NotFoundError extends HttpError {
    constructor({ errorCode = 404, message = 'Not Found.' }: HttpErrorOptions = {}) {
      super(errorCode, message);
    }
}


class MissingCredentialsError extends HttpError {
    constructor({ errorCode = 400, message = 'One or more credentials are missing.' }: HttpErrorOptions = {}) {
      super(errorCode, message);
    }
  }

class InvalidCredentialsError extends HttpError{
    constructor({ errorCode = 401, message = 'Invalid Credentials' }: HttpErrorOptions = {}){
        super(errorCode, message);
    }
}

class InsufficientPermissionsError extends HttpError{
    constructor({ errorCode = 403, message = 'You do not have permission to access this resource.' }: HttpErrorOptions = {}){
        super(errorCode, message);
    }
}


export {InsufficientPermissionsError, InvalidCredentialsError, MissingCredentialsError, HttpError, NotFoundError}