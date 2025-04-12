import './envConfig.ts'

const config = {
  schema: "./Utils/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL!,
  },
};

export default config;
