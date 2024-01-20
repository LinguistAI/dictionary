import Joi from "joi";

const word_validation = {
    search_schema: Joi.object({
        word: Joi.string().min(1).pattern(new RegExp("^[a-zA-Z0-9-']+$")),
    }).options({ abortEarly: false }),
};

export default word_validation;
