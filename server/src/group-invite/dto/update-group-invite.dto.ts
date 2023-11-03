import { PartialType } from '@nestjs/swagger';
import { CreateGroupInviteDto } from './create-group-invite.dto';

export class UpdateGroupInviteDto extends PartialType(CreateGroupInviteDto) {}
