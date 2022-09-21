import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AuthWsAdapter } from "./wsadapter";
import { REDIS } from "./redis/redis.module";
import * as RedisStore from "connect-redis";
import * as passport from "passport";
import * as session from "express-session";

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  const redis = await app.resolve(REDIS);
  const expressMiddle = session({
    store: new (RedisStore(session))({
      client: redis,
      logErrors: true,
    }),
    secret: "nya ichi nii san nya arigato",
    cookie: {
      sameSite: true,
      httpOnly: false,
    },
    saveUninitialized: false,
    resave: false,
  });
  app.use(expressMiddle);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new AuthWsAdapter(app, expressMiddle));
  await app.listen(4000);
}

main();
