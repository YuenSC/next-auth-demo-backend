const envFilePath =
  process.env.NODE_ENV === undefined ? '.env' : `.env.${process.env.NODE_ENV}`;

export default envFilePath;
