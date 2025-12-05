const validator = require('../helper/validate');

const saveStories = (req, res, next) => {
  const validationRules = {
    title: 'required|string',
    genre: 'required|string',
    description: 'required|string',
  };
  
   validator(req.body, validationRules, {}, (err, status) => {
    if (!status) {
      return res.status(412).json({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }

    const description = req.body.description || '';
    const wordCount = description.trim().split(/\s+/).length;

    if (wordCount > 15) {
      return res.status(412).json({
        success: false,
        message: 'Description cannot exceed 15 words',
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

const saveItems = (req, res, next) => {
  const validationRules = {
    item: 'required|string',
    class: 'required|string',
    advantage: 'required|string',
  };
  
   validator(req.body, validationRules, {}, (err, status) => {
    if (!status) {
      return res.status(412).json({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }

    const allowedClasses = ['Rogue', 'Knight', 'Wizard', 'Ranger', 'Paladin'];
    if (!allowedClasses.includes(req.body.class)) {
      return res.status(412).json({
        success: false,
        message: `Class must be one of: ${allowedClasses.join(', ')}`,
      });
    }

    const advantage = req.body.advantage || '';
    const wordCount = advantage.trim().split(/\s+/).length;

    if (wordCount > 10) {
      return res.status(412).json({
        success: false,
        message: 'Description cannot exceed 10 words',
      });
    }
    
    next();
  });
};

module.exports = { saveMasters, saveStories, saveItems };
