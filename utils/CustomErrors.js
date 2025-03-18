// utils/CustomErrors.js
class EmailAlreadyExistsError extends Error {
    constructor(message = 'Email is already in use') {
      super(message);
      this.name = 'EmailAlreadyExistsError';
    }
  }
  
  class DatabaseError extends Error {
    constructor(message = 'Database error occurred') {
      super(message);
      this.name = 'DatabaseError';
    }
  }
  
  class InvalidCredentialsError extends Error {
    constructor(message = 'Invalid credentials') {
      super(message);
      this.name = 'InvalidCredentialsError';
    }
  }


  export { EmailAlreadyExistsError, DatabaseError,InvalidCredentialsError };
  