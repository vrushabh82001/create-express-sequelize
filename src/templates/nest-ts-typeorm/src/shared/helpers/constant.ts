export const constant = {
  /*---------------------------------------------[ error fillter handle ]----------------------------------------------*/
  HANDLING_ERROR_EXCEPTION: 'An unexpected error occurred.',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',

  /*---------------------------------------------[ logger ]----------------------------------------------*/
  USER_TABLE_CREATE: 'User Table Create in Database',

  /*---------------------------------------------[ Auth ]----------------------------------------------*/
  TOKEN_EMPTY: 'No token or no Api Key,authorization denied',
  INVALID_TOKEN: 'Invalid Token',

  /*---------------------------------------------[ User ]----------------------------------------------*/
  USER_ALREADY_EXIST: `User already exists`,
  NO_SUCH_USER: `No such user found.`,
  WRONG_PASSWORD: 'Wrong password',
  VERIFY_MAIL: 'Verify Mail',
  CONFIRM_REGISTRATION: `Confirm your registration`,
  USER_REGISTER_SUCCESSFULLY: `User Register Successfully`,
  USER_ALREADY_VERIFY: 'User already verified..',
  OTP_WRONG: 'OTP Wrong',
  EMAIL_VERIFIED_SUCESSFULLY: 'Email verified successfully',
  THIS_ACCOUNT_NOT_FOUND: 'This account is not found',
  PLEASE_REGISTER: 'Please Register First!',
  CREDENTIAL_WRONG: 'Your Credential Wrong!',
  PLEASE_CONFIRM_REGISTRATION: 'Please confirm your registration first!',
  USER_FOUND_SUCCESFULLY: 'User found succesfully',

  /*---------------------------------------------[ Notification ]----------------------------------------------*/
  NOTIFICATION_SENT_SUCCESS: 'Notification sent successfully.',
  NOTIFICATION_FAIL: 'Notification send failed:',
  OTP_SENT_SUCESS: 'OTP sent successfully.',
  OTP_SENT_FAIL: 'OTP sent successfully.',
};

export const swaggerConstant = {
  /*---------------------------------------------[ swagger config constant ]----------------------------------------------*/
  TITLE: 'Nest.js CRUD API with Swagger',
  DESCRIPTION:
    'Documentation for a simple CRUD API using Nest.js, Type Orm and PostgreSQL',
  VERSION: '1.0.0',
  BEARERAUTH_DESCRIPTION: 'Bearer token to access these API endpoints',

  /*---------------------------------------------[ Common Eroor Message ]----------------------------------------------*/

  INTERNAL_RESPONSE_DESCRIPTION: 'Internal server error',
  BAD_RESPONSE_DESCRIPTION: 'Bad request',

  /*---------------------------------------------[ User Swagger ]----------------------------------------------*/

  REGISTER_SUMMARY: 'Register a new user',
  REGISTER_OK_RESPONSE_DESCRIPTION: 'User registered successfully',
  REGISETR_BODY_DESCRIPTION: 'Register a new user with profile picture upload',

  VERIFY_SUMMARY: 'Verify user',
  VERIFY_OK_RESPONSE_DESCRIPTION: 'User verified successfully',
  VERIFY_BODY_DESCRIPTION: 'Verify user account',

  LOGIN_SUMMARY: 'Login user',
  LOGIN_OK_RESPONSE_DESCRIPTION: 'User logged in successfully',
  LOGIN_BODY_DESCRIPTION: 'Login user with email and password',

  PROFILE_SUMMARY: 'Get user profile',
  PROFILE_OK_RESPONSE_DESCRIPTION: 'User profile retrieved successfully',
};
