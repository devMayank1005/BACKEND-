import { body, validationResult } from "express-validator";


     const validate  = (req, res, next) => {
            const errors = validationResult(req);
         if (!errors.isEmpty()) {
        const formattedErrors = {};

        errors.array().forEach(err => {
            // Only assign first error per field
            if (!formattedErrors[err.path]) {
                formattedErrors[err.path] = err.msg;
            }
        });

        return res.status(400).json({
            success: false,
            errors: formattedErrors
        });
    }
            next();
        }
    

export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscore"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validate
];