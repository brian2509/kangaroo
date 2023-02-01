import { IsEnum, IsString } from "class-validator";

export enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export class Config {
  @IsEnum(Environment)
  public readonly NODE_ENV: Environment;

  @IsString()
  public readonly PORT: number;

  @IsString()
  public readonly DOMAIN_NAME: string;

  @IsString()
  public readonly AWS_REGION: string;

  @IsString()
  public readonly AWS_ACCESS_KEY_ID: string;

  @IsString()
  public readonly AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  public readonly AWS_PRIVATE_BUCKET_NAME: string;

  @IsString()
  public readonly JWT_SECRET: string;

  @IsString()
  public readonly POSTGRES_HOST: string;

  @IsString()
  public readonly POSTGRES_PORT: number;

  @IsString()
  public readonly POSTGRES_USER: string;

  @IsString()
  public readonly POSTGRES_PASSWORD: string;

  @IsString()
  public readonly POSTGRES_DB: string;
}
