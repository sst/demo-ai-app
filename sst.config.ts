/// <reference path="./.sst/src/global.d.ts" />

export default $config({
  app(input) {
    return {
      name: "movies",
      removalPolicy: input?.stage === "production" ? "retain" : "remove",
      providers: {
        aws: {
          profile: input?.stage === "production" ? "sst-production" : undefined,
        },
      },
    };
  },
  async run() {
    const db = new aws.dynamodb.Table("Movies", {
      hashKey: "id",
      billingMode: "PAY_PER_REQUEST",
      attributes: [{ name: "id", type: "S" }],
    });

    const bucket = new sst.Bucket("Assets", {
      public: true,
    });

    const vector = new sst.Vector("Vector", {
      model: "text-embedding-ada-002",
      openAiApiKey: new Secret("OpenAiApiKey").value,
    });

    const site = new sst.Nextjs("Web", {
      link: [db, bucket, vector],
      domain: $app.stage === "production" ? "movies.sst.dev" : undefined,
    });

    return {
      Table: db.name,
      Bucket: bucket.name,
    };
  },
});
