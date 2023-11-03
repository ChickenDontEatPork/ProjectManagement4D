import { Role } from '@prisma/client';
import { Expose } from 'class-transformer';

export class GetUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  image: string;

  @Expose()
  name: string;

  @Expose()
  lastname: string;

  @Expose()
  tel: string;

  @Expose()
  role: Role;

  @Expose()
  register: boolean;
}
