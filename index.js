import fs from "fs";
import env from "dotenv";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";

const yargs = _yargs(hideBin(process.argv));
yargs.version("1.0.0");
env.config();

const log = console.log;

const CONTROLLER_NAME = process.env.CONTROLLER_NAME;
const CONTROLLER_FUNCTION_NAME = process.env.CONTROLLER_FUNCTION_NAME;

const SERVICE_NAME = process.env.SERVICE_NAME;
const SERVICE_FUNCTION_NAME = process.env.SERVICE_FUNCTION_NAME;

const TABLE_NAME = process.env.TABLE_NAME;

yargs.command({
  command: "create_service",
  describe: "--name, --service",
  handler(args) {
    log("🚀 ~ args:", { SERVICE_NAME, SERVICE_FUNCTION_NAME });
    const service = args.service || SERVICE_NAME || "";
    const name = args.name || SERVICE_FUNCTION_NAME || "";
    const content = `
    async ${name}({}) {
    try {
      logger.info(\`${service}.${name} called :\`);
      return knex(\`\${ENVIRONMENT.KNEX_SCHEMA}.\${CONSTANTS.TABLES.${TABLE_NAME}}\`)
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
        log(
          "----------------------------------------------------------------------------------------------------------------"
        );
        log(content);
        log(
          "----------------------------------------------------------------------------------------------------------------"
        );
      }
    });
  },
});

yargs.command({
  command: "_controller",
  describe: "--name, --service",
  handler(args) {
    const service = args.service || CONTROLLER_NAME || "";
    const name = args.name || CONTROLLER_FUNCTION_NAME || "";
    log("🚀 ~ args:", {
      CONTROLLER_NAME,
      CONTROLLER_FUNCTION_NAME,
    });
    const content = `
  async ${name}(req, res) {
    const {} = req.body;
    try {
      logger.info(\`${service}.${name} called :\`);
      const data = await ${SERVICE_NAME}.${name}({});
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
        log(
          "----------------------------------------------------------------------------------------------------------------"
        );
        log(content);
        log(
          "----------------------------------------------------------------------------------------------------------------"
        );
      }
    });
  },
});

yargs.command({
  command: "_remove_file",
  describe: "Remove Generated Files",
  handler(args) {
    log("Removing Files.");
    const files = ["controller.js", "service.js"];
    files.forEach((file) => {
      fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(`${file} does not exist, skipping...`);
        } else {
          fs.unlink(file, (err) => {
            if (err) {
              console.error(`Error deleting ${file}:`, err);
            } else {
              console.log(`${file} deleted successfully!`);
            }
          });
        }
      });
    });
  },
});
yargs.parse();
