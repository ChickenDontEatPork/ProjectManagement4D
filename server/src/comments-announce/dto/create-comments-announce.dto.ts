import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentsAnnounceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  annoucementId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
