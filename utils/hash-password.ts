import crypto from "crypto";

export const hashPassword = (password: string) => {
  const salt = process.env.SECRET_KEY!;

  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
};

export const comparePassword = (password: string, hashedPassword: string) => {
  const salt = process.env.SECRET_KEY!;

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === hashedPassword;
};
