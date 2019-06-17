const express = require("express");
const cheerio = require("cheerio");
const rp = require("request-promise");
var decode = require("urldecode");
const app = express();

app.get("/", async (req, res) => {
  let options = {
    uri: `https://www.youtube.com/watch?v=FJcBThfsJc0`,
    transform: body => {
      return cheerio.load(body);
    }
  };
  try {
    const $ = await rp(options);
    const data = $("script");
    let rawData =
      data.length === 21
        ? decode(data[12].children[0].data)
        : decode(data[13].children[0].data);
    rawData = rawData.slice(48);
    rawData = rawData.slice(0, -92);
    // sample =
    //   ";(function() {if (!!window.yt && yt.player && yt.player.Application) {ytplayer.load();}}());";
    // console.log(sample.length);
    console.log(data.length);
    res.send(rawData);
  } catch (e) {
    console.error(e);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
