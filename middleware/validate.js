const validator = require('../helper/validate');

const saveStories = (req, res, next) => {
  const validationRules = {
    title: 'required|string',
    genre: 'required|string',
    description: 'required|string|max:15',
  };
   validator(req.body, validationRules, {}, (err, status) => {
    if (!status) {
      return res.status(412).json({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    
    next();
  });
};


const saveMasters = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    username: 'required|string',
    level: 'required|integer|min:1|max:20',
    email: 'required|email',
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).json({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    
    next();
  });
};

module.exports = { saveMasters, saveStories };
