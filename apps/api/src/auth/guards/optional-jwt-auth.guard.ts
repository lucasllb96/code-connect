import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, info: any) {
    // If there is a valid user, return it. Otherwise, return null (do not throw error).
    return user || null;
  }
}
