import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsPhoneNumber('TH')
  @IsNotEmpty()
  tel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  picture: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  credential: string;
}
