import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    return false;
    // const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    // if (_.isEmpty(roles)) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();
    // const user = <UserEntity>request.user;

    // return roles.includes(user.role);
  }
}
