const express = require("express");

const app = express();
app.use(express.json());

const delayMs = Number(process.env.HEADER_DELAY_MS || 5100);

app.get("/", (_req, res) => {
  res.send(`webhook delay repro (HEADER_DELAY_MS=${delayMs})`);
});

app.post("/circleci/", (req, res) => {
  const payloadId = req.body?.id ?? "(no id)";
  const eventType = req.headers["circleci-event-type"] ?? "unknown";

  console.log(
    `POST /circleci/ event=${eventType} id=${payloadId} delaying ${delayMs}ms before headers`,
  );

  setTimeout(() => {
    res.status(200).send("ok");
    console.log(`  -> 200 for id=${payloadId}`);
  }, delayMs);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on :${port}, header delay ${delayMs}ms`);
});
