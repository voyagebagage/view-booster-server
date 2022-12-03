const cors = require("cors");
const express = require("express");
const youtube = require("./youtube.js");
const app = express();
app.use(cors());

app.post("/next-video", async (req, res) => {
  try {
    // console.log("QUERY :", req.query);

    const {
      //   tryLoggedIn,
      automationYoutubeUrl,
      mute,
      chromePath,
      //   username,
      //   password,
    } = req.query;
    res.status(200).send(
      await youtube(
        automationYoutubeUrl,
        Boolean(mute),
        chromePath
        //   tryLoggedIn,
        //   username,
        //   password,
      )
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//ALL ROUTE & SERVER PORT\\\\\\\\_________________________\\\\\\\\\
app.all("*", (req, res) => {
  res.status(404).json({ error: "None existing route" });
});

app.listen(6807, (req, res) => {
  console.log("Server Launched");
});
//process.env.PORT ||
