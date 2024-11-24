export const validatePassword = (password: string): boolean => {
  const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
  const numberCount = (password.match(/[0-9]/g) || []).length;
  const specialCharCount = (password.match(/[@$!%*?&#]/g) || []).length;

  return letterCount >= 2 && numberCount >= 2 && specialCharCount >= 2;
};
