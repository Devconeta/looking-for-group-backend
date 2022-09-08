import { NotFoundException } from '@nestjs/common';

export class TeamNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.teamNotFound', error);
  }
}
