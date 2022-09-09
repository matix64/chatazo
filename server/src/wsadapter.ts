import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RequestHandler, Request, Response } from 'express';
import { Server } from 'socket.io';
import * as passport from 'passport';

export class AuthWsAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private sessionMiddle: RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    server.use(sockMiddleware(this.sessionMiddle));
    server.use(sockMiddleware(passport.initialize()));
    server.use(sockMiddleware(passport.session()));
    server.use((sock, next) =>
      next(
        (sock.request as Request).user ? undefined : new Error('Unauthorized'),
      ),
    );
    return server;
  }
}

function sockMiddleware(middleware: RequestHandler) {
  return (socket: any, next: () => void): void =>
    middleware(socket.request as Request, {} as Response, next);
}
