export class ApiError extends Error {
    constructor(
        statusCoode,
        message="Something went wrong",
        errors= [],
        stack = ""        
    ){
      super(message),
      this.statusCoode = statusCoode,
      this.message = message,
      this.success = false;
      this.errors = errors

      if (stack){
        this.stack = stack
      }else{
        Error.captureStackTrace(this, this.constructor)
      }
    }
}