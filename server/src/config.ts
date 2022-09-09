import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";

interface Config {
  mongo_url: string;
  redis_url: string;
}

export function readConfig(): Config {
  const file = yaml.load(
    readFileSync(join(__dirname, "../config.yml"), "utf8")
  ) as Config;
  const defaults: Config = {
    mongo_url: "mongodb://127.0.0.1/chat",
    redis_url: "redis://127.0.0.1",
  };
  return { ...defaults, ...file };
}
