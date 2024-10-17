import morgan from "morgan";
import fs from "fs";
import path from "path";

const errorLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
  flags: "a",
});

const errorFormat =
  ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms";

const errorLogger = morgan(errorFormat, {
  stream: {
    write: (message) => errorLogStream.write(message),
  },
  skip: (_req, res) => res.statusCode < 400,
});

export default errorLogger;
