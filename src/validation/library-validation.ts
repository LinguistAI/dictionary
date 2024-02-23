import Joi from "joi";

const wordValidation = {
    searchSchema: Joi.array()
        .items(Joi.string().min(1).pattern(new RegExp("^[a-zA-Z0-9-']+$")))
        .options({ abortEarly: false }),
};

export default wordValidation;
