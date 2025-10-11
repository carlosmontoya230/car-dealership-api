import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsString
} from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "usuario@email.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "contraseñaSegura123" })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: "Juan" })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @ApiProperty({ example: "usuario@email.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "contraseñaSegura123" })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
