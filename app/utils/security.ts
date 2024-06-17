//const bcrypt = require("bcrypt")
import * as z from "zod"
import bcrypt from 'bcrypt';

type FormData = {
  email: string;  
  password: string;
};

export const signInSchema: z.ZodType<FormData> = z.object({  
  email: z.string().email({
    message: "Email is invalid",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  })
});

export const saltAndHashPassword = async (password: string) => {
  const saltRounds = 10; // Number of salt rounds (higher is more secure)
  console.log('Hashing password... ', password);

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);          
    } else {
        console.log('Hashed password:', hash);
        // Store 'hash' in your database
        return hash;
    }
  });
  return null;

  //const salt = bcrypt.genSaltSync(10);
  
  /*bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in the database
        console.log('hash result: ', hash);
    });
  });*/

  
  
  
  //return bcrypt.hashSync(password, salt)
}

export const comparePassword = (password: string, hash: string): boolean => {
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        if (result) {
            console.log('Password is correct!');
        } else {
            console.log('Incorrect password.');
        }
        return result;
    }

    return false;
  });

  // return bcrypt.compareSync(password, hash)
}

/**
 * bcrypt.compare(plaintextPassword, hash, function(err, result) {
    if (result) {
        // password is valid
    }
});
 * 
 */