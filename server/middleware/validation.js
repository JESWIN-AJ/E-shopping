const { z } = require('zod');

const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
});

const signupSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long'),

  lastname: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),

  email: z
    .string()
    .trim()
    .email('Invalid email address'),

  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number is too long'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
});

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    req.body = result.data;
    next();
  };
};

module.exports = {
  adminLoginSchema,
  signupSchema,
  validate
};