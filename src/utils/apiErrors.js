class ApiError extends Error {
  constructor(status, message, stack, errors) {
    super(message);
    this.status = status;
    this.message = message || "Something went wrong";
    this.stack = stack;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      this.stack = Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
