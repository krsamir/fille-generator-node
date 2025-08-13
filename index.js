import fs from "fs";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";

const yargs = _yargs(hideBin(process.argv));
yargs.version("1.0.0");

const log = console.log;

yargs.command({
  command: "create_service",
  describe: "--name, --service",
  handler(args) {
    console.log("🚀 ~ args:", args.name);
    const service = args.service;
    const name = args.name;
    const content = `
    async ${name}({}) {
    try {
      logger.info(\`${service}.${name} called :\`);
      return knex({ENVIRONMENT.KNEX_SCHEMA}.CONSTANTS.TABLES.MASTER)
    } catch (error) {
      logger.error(\`
        ${service}.${name}: Error occurred : \${inspect(error)}\`
      );
      throw error;
    }
  }`;
    fs.writeFile("./service.js", content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`File Created.`);
      }
    });
  },
});

yargs.command({
  command: "_controller",
  describe: "--name, --service",
  handler(args) {
    console.log("🚀 ~ args:", args.name);
    const service = args.service;
    const name = args.name;
    const content = `
  async ${name}(req, res) {
    const {} = req.body;
    try {
      logger.info(\`${service}.${name} called :\`);
      const data = await ${service}.${name}({});
      if (data === 1) {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "",
          status: CONSTANTS.STATUS.SUCCESS,
        });
      } else {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }
    } catch (error) {
      logger.error(\`
        ${service}.${name}: Error occurred : \${inspect(error)}\`
      );
      throw error;
    }
  }`;
    fs.writeFile("./controller.js", content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`File Created.`);
      }
    });
  },
});

yargs.parse();
