import Joi from 'joi';


export const SignupSchema = Joi.object({
    email: Joi.string()
        .email({
            tlds:{allow: ['com', 'net']}
        })
        .lowercase()
        .trim()
        .required(),
    
    password: Joi.string()
        .min(6)
        .required(),
})

export const LoginSchema = Joi.object({
    email: Joi.string()
        .email({
            tlds:{allow: ['com', 'net']}
        })
        .lowercase()
        .trim()
        .required(),
    
    password: Joi.string()
        .min(6)
        .required(),
})


export const CreateListingSchema = Joi.object({
    title: Joi.string()
            .uppercase()
            .trim()
            .required(),

    description : Joi.string()
                .required(),
    
    location: Joi.string()
             .required(),

    images: Joi.string(),

    price: Joi.number()
            .min(100)
            .max(9999)
            .required()
})



export const CreateBookingSchema = Joi.object({
    listingId: Joi.string()
              .required()
              .messages({
                'any.required': 'Listing ID is required'
              }),
    checkIn: Joi.date()
             .min('now')
             .required(),
    
    numberOfDays: Joi.number()
                  .integer()
                  .min(1)
                  .required()
})

export const UpdateBookingSchema = Joi.object({
    
    checkIn: Joi.date(),
    
    numberOfDays: Joi.number()
                  .integer()
                  .min(1)
                 
}).min(1);