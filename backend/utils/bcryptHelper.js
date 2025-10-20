import bcrypt from "bcrypt";

const isPasswordCorrect = async (candidatePassword, actualPassword) => {
  return await bcrypt.compare(candidatePassword, actualPassword);
};

export { isPasswordCorrect };
