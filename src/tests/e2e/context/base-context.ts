import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { AppModule } from '@modules/app/app.module';
import { ConfigModule } from '@nestjs/config';
import TestService from '@tests/e2e/test.service';
import { AdminUserInterface } from '@tests/e2e/interfaces/admin-user.interface';
import { IMakeRequest } from '@tests/e2e/interfaces/make-request.interface';
import makeRequest from '@tests/e2e/common/make-request';
import { RedisService } from '@providers/redis';

class BaseContext {
  private _app!: INestApplication;

  private _module!: TestingModule;

  private _server!: Server;

  private _connection!: PrismaClient;

  private _redis!: RedisService;

  public service!: TestService;

  public globalAdmin!: AdminUserInterface;

  public request!: IMakeRequest;

  async init() {
    this._module = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
    }).compile();

    this._app = this._module.createNestApplication();

    this._connection = new PrismaClient();

    await this._app.init();

    this._server = this._app.getHttpServer();

    this.request = makeRequest(this._server);

    this.service = new TestService(this._app, this._connection);

    this.globalAdmin = await this.service.createGlobalAdmin();
  }

  async end() {
    const deleteUsers = this._connection.user.deleteMany();
    await this._connection.$transaction([deleteUsers]);

    this._redis.deleteAll();

    await this._app.close();
  }
}

export default BaseContext;
