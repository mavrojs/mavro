export interface Config {
  port: number;
  environment: "development" | "production";
  auth: {
    jwtSecret: string;
  };
}
