import "reflect-metadata";
import express from "express";
import compression from "compression";
import { createCombinedHandler, useContainer } from "cds-routing-handlers";
import cds from "@sap/cds";
import Container from "typedi";

export class Server {
  public static async run() {
    // @ts-ignore
    const openaiConfig = <OpenAIConfing>cds.env.for("app")["openai"];
    if (!openaiConfig.apiKey) {
      throw new Error(
        `No OpenAI API token provided! Please set the environment variable "{ 'app_openai': { 'apiKey': 'xxx' } }"`
      );
    }

    useContainer(Container);
    Container.set("openai-config", openaiConfig);

    const app = express();
    app.use(compression());

    await cds.connect("db");
    await cds
      .serve("all")
      .at("odata")
      .in(app)
      .with((srv) =>
        createCombinedHandler({
          handler: [__dirname + "/handlers/**/*.js"],
        })(srv)
      );

    // Redirect requests to the OData Service
    app.get("/", function (req, res) {
      res.redirect("/odata/");
    });

    // Run the server.
    const port = process.env.PORT || 3001;
    app.listen(port, async () => {
      console.info(`Server is listing at http://localhost:${port}`);
    });
  }
}

Server.run();
