import { NotFoundException } from '@nestjs/common';

export class UserAlreadyAMemberException extends NotFoundException {
  constructor(error?: string) {
    super('error.userAlreadyAMember', error);
  }
}
