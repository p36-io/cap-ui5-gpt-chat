import "reflect-metadata";
import express from "express";
import { createCombinedHandler, useContainer } from "cds-routing-handlers";
import cds from "@sap/cds";
import Container from "typedi";

export class Server {
  public static async run() {
    // @ts-ignore
    const apiToken = cds.env.for("app")["openai-api-token"];
    if (!apiToken) {
      throw new Error(
        `No OpenAI API token provided! Please set the environment variable "{ 'app': { 'openai-api-token': 'xxx' } }"`
      );
    }
    useContainer(Container);
    Container.set("openai-api-token", apiToken);

    const app = express();

    const hdl = createCombinedHandler({
      handler: [__dirname + "/handlers/**/*.js"],
    });

    await cds.connect("db");
    await cds
      .serve("all")
      .at("odata")
      .in(app)
      .with((srv) => hdl(srv));

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
