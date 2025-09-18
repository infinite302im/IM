export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?:any;

    constructor(message:string,statusCode:number,isOperational = true, details?:any){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

//Not found error
export class NotFoundError extends AppError{
    constructor(message = "Resources not found"){
        super(message, 404);
    }
}

//Validation Error
export class ValidationError extends AppError{
    constructor(message = "Invalid Request Data", details?: any){
        super(message,400, true, details);
    }
}

// AuthError
export class AuthError extends AppError {
    constructor(message = "Unauthorizes") {
        super(message, 401);
    }
}

//ForbiddenError
export class ForbiddenError extends AppError{
    constructor(message = "Forbidden access"){
        super(message, 403);
    }
}

//DatabaseError
export class DatabaseError extends AppError {
    constructor(message = "Database error", details?: any){
        super(message, 500, true, details);
    }
}

//RateLimitError
export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later") {
        super(message, 429);
    }
}
