import dotenv from "dotenv"

export const envs = {
  ...process.env,
  ...dotenv.config().parsed
};

export const isProduction = envs.NODE_ENV === "production";