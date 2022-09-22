import { NotFoundException } from '@nestjs/common';

export class UserAlreadyAppliedException extends NotFoundException {
  constructor(error?: string) {
    super('error.userAlreadyApplied', error);
  }
}
