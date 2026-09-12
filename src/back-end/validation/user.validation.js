import * as bodyV from './body.validation.js';
import * as queryV from './query.validation.js';
import * as paramV from './param.validation.js';

export const userValidate = {
  createUser: () => {
    return [
      bodyV.email('email', 255, true, 'Email'),
      bodyV.string('password', 255, true, null, 'Password'),
      bodyV.string('name', 150, false, v => (typeof v === 'string' ? v.trim() : v), 'Name'),
      bodyV.string('phone_number', 30, false, v => (typeof v === 'string' ? v.trim() : v), 'Phone number'),
      bodyV.number('age', 0, 200, false, 'Age'),
      bodyV.string('gender', 20, false, v => (typeof v === 'string' ? v.trim() : v), 'Gender'),
      bodyV.string('job', 150, false, v => (typeof v === 'string' ? v.trim() : v), 'Job'),
      bodyV.string('dateofbirth', 10, false, v => (typeof v === 'string' ? v.trim() : v), 'Date of birth'),

      // profile fields (optional)
      bodyV.number('height_cm', 50, 250, false, 'Height (cm)'),
      bodyV.number('weight_kg', 10, 400, false, 'Weight (kg)'),

      bodyV.number('bust_cm', 40, 200, false, 'Bust (cm)'),
      bodyV.number('waist_cm', 30, 200, false, 'Waist (cm)'),
      bodyV.number('hip_cm', 40, 250, false, 'Hip (cm)'),

      bodyV.string('favorite_style', 80, false, v => (typeof v === 'string' ? v.trim() : v), 'Favorite style'),
      bodyV.string('preferred_color_tone', 80, false, v => (typeof v === 'string' ? v.trim() : v), 'Preferred color tone'),

      bodyV.string('body_shape', 50, false, v => (typeof v === 'string' ? v.trim() : v), 'Body shape'),
      bodyV.string('usual_size', 30, false, v => (typeof v === 'string' ? v.trim() : v), 'Usual size'),

      bodyV.number('fashion_budget_min', 0, 2000000000, false, 'Fashion budget min'),
      bodyV.number('fashion_budget_max', 0, 2000000000, false, 'Fashion budget max')
    ];
  },

  updateUser: () => {
    return [
      paramV.number('user_id', 1, 9007199254740991, true, 'User ID'),
      bodyV.email('email', 255, false, 'Email'),
      bodyV.string('name', 150, false, v => (typeof v === 'string' ? v.trim() : v), 'Name'),
      bodyV.string('phone_number', 30, false, v => (typeof v === 'string' ? v.trim() : v), 'Phone number'),
      bodyV.number('age', 0, 200, false, 'Age'),
      bodyV.string('gender', 20, false, v => (typeof v === 'string' ? v.trim() : v), 'Gender'),
      bodyV.string('job', 150, false, v => (typeof v === 'string' ? v.trim() : v), 'Job'),
      bodyV.string('dateofbirth', 10, false, v => (typeof v === 'string' ? v.trim() : v), 'Date of birth'),

      // profile fields (optional)
      bodyV.number('height_cm', 50, 250, false, 'Height (cm)'),
      bodyV.number('weight_kg', 10, 400, false, 'Weight (kg)'),

      bodyV.number('bust_cm', 40, 200, false, 'Bust (cm)'),
      bodyV.number('waist_cm', 30, 200, false, 'Waist (cm)'),
      bodyV.number('hip_cm', 40, 250, false, 'Hip (cm)'),

      bodyV.string('favorite_style', 80, false, v => (typeof v === 'string' ? v.trim() : v), 'Favorite style'),
      bodyV.string('preferred_color_tone', 80, false, v => (typeof v === 'string' ? v.trim() : v), 'Preferred color tone'),

      bodyV.string('body_shape', 50, false, v => (typeof v === 'string' ? v.trim() : v), 'Body shape'),
      bodyV.string('usual_size', 30, false, v => (typeof v === 'string' ? v.trim() : v), 'Usual size'),

      bodyV.number('fashion_budget_min', 0, 2000000000, false, 'Fashion budget min'),
      bodyV.number('fashion_budget_max', 0, 2000000000, false, 'Fashion budget max')
    ];
  },

  changePassword: () => {
    return [
      paramV.number('user_id', 1, 9007199254740991, true, 'User ID'),
      bodyV.string('new_password', 255, true, null, 'New password')
    ];
  },

  getById: () => {
    return [paramV.number('user_id', 1, 9007199254740991, true, 'User ID')];
  },

  listUsers: () => {
    return [
      queryV.number('user_id', 1, 9007199254740991, false, 'User ID'),
      queryV.string('email', 255, false, 'Email'),
      queryV.string('name', 150, false, 'Name'),
      queryV.string('phone_number', 30, false, 'Phone number'),
      queryV.number('age', 0, 200, false, 'Age'),
      queryV.string('gender', 20, false, 'Gender'),
      queryV.string('job', 150, false, 'Job'),
      queryV.string('dateofbirth', 10, false, 'Date of birth'),
      queryV.number('limit', 1, 200, false, 'Limit'),
      queryV.number('offset', 0, 1000000000, false, 'Offset')
    ];
  },

  searchByName: () => {
    return [
      queryV.string('name', 150, true, 'Name'),
      queryV.number('limit', 1, 200, false, 'Limit'),
      queryV.number('offset', 0, 1000000000, false, 'Offset')
    ];
  }
};