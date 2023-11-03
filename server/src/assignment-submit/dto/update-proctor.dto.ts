import { AssignmentStatus } from '@/shared/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateProtorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AssignmentStatus)
  status: AssignmentStatus;
}
