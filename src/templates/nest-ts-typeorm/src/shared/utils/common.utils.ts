import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { promisify } from 'util';

const writeFileAsyncFn = promisify(fs.writeFile);
const unlinkAsyncFn = promisify(fs.unlink);

/*------------------------------------------------------------------------- [ success response ] -------------------------------------------------------------------------*/

export const successResponse = (
  statusCode: number,
  error: boolean,
  message: string,
  result?: any,
) => {
  return {
    statusCode,
    error,
    message,
    result,
  };
};

/*------------------------------------------------------------------------- [ password encrypt ] -------------------------------------------------------------------------*/

export const encrypt = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/*------------------------------------------------------------------------- [ password decrypt ] -------------------------------------------------------------------------*/

export const decrypt = async (
  password: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};

/*------------------------------------------------------------------------- [ generate otp ] -------------------------------------------------------------------------*/

export const generateOtp = (): string => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

/*------------------------------------------------------------------------- [ generate hash ] -------------------------------------------------------------------------*/

export const generateHash = (): string => {
  return uuidv4();
};

/*------------------------------------------------------------------------- [ write file ] -------------------------------------------------------------------------*/

export const writeFileAsync = async (
  buffer: Buffer,
  filePath: string,
): Promise<void> => {
  await writeFileAsyncFn(filePath, buffer);
};

/*------------------------------------------------------------------------- [ delete file ] -------------------------------------------------------------------------*/

export const deleteFile = async (filePath: string): Promise<void> => {
  await unlinkAsyncFn(filePath);
};
