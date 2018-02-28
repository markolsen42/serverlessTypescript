import * as fs from "fs";
import * as yaml from "js-yaml";

export class Config {
    public values;
    public constructor() {
        this.values = yaml.safeLoad(fs.readFileSync("./config.yml", "utf8"));
    }
}
