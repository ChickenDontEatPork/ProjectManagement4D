import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupInviteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
