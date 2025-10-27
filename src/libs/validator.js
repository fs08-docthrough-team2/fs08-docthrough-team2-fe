import validator from 'validator';

export const isValidateEmail = (email) => {
  return validator.isEmail(email);
};

export const isValidateNickname = (nickname) => {
  return validator.isLength(nickname, { min: 2, max: 10 });
};

export const isValidatePassword = (password) => {
  return validator.isLength(password, { min: 8 });
};

export const isValidateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};
