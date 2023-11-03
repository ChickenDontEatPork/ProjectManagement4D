import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentsAssignDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  assignmentId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
