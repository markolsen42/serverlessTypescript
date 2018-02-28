import * as fs from "fs";
import * as yaml from "js-yaml";

export interface IConfig {
    postgres: string;
}

export class Config {
    public values: IConfig: ;
    public constructor() {
        this.values = yaml.safeLoad(fs.readFileSync("./config.yml", "utf8"));
    }
}
