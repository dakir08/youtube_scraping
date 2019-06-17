const {
  express,
  fs,
  youtubedl,
  mongoose
} = require("../config/packagerequirement");
const { infoModel } = require("../model/youtubeInfo");
const generatePath = require("../utils/generatePath");

const { promisify } = require("util");
const { to } = require("../utils/function");

const mergeStream = require("../utils/mergeCodexStream");

const uploadStorages = require("../utils/uploadStorages");
const rimraf = require("rimraf");

const getDownloadLink = require("../utils/getDownloadLink");

const getInfo = promisify(youtubedl.getInfo);

const router = express.Router();

router.get("/", async (req, res) => {
  const videoId = req.query.videoId;
  const getInfoFromDB = await infoModel.findOne({ videoId });
  if (getInfoFromDB) return res.send(getInfoFromDB);
  return res.status(404).send("cannot find video from DB");
});

router.post("/", async (req, res) => {
  //get url
  const url = req.query.link;

  if (!url) return res.send(["no link provided"]);

  const [err, info] = await to(getInfo(url));
  if (!info) return res.send(["Cannot get youtube link"]);

  //put into result

  let downloadInfo = [];
  info.formats.map(data => {
    if (
      data.format_note !== "DASH audio" &&
      data.format_note !== "medium" &&
      data.format_note !== "hd720" &&
      data.format_note !== "144p" &&
      data.ext === "webm"
    )
      downloadInfo.push({
        generateDownloadLink: getDownloadLink(
          "localhost:3000",
          url,
          data.format_note,
          data.height,
          info.id,
          info._filename
        ),
        resolution: data.format_note,
        fileFormat: "Mp4",
        downloadLink: null
      });
  });

  const result = {
    videoId: info.id,
    name: info.title,
    duration: info.duration,
    thumbnail: info.thumbnail,
    description: info.description,
    downloadInfo
  };

  // save into DB

  const getInfoFromDB = await infoModel.findOne({ videoId: info.id });

  if (!getInfoFromDB) {
    const infoDB = new infoModel(result);

    await infoDB.save();
    console.log("saving into DB succesfull");
    if (req.query.reduceInfo === "true") return res.send(result);
  }

  console.log("DB found!");

  //veriy link

  if (req.query.reduceInfo === "true") return res.send(getInfoFromDB);
  res.send(info);
});

router.get("/generateDownloadLink", async (req, res) => {
  const { url, height: resolution, videoId, quality, title } = req.query;
  const encodeTitle = encodeURIComponent(title);

  // Read streaming
  const getInfoFromDB = await infoModel.findOne({ videoId });
  const downloadUrlIndex = getInfoFromDB.downloadInfo.findIndex(
    downloadLink => {
      return downloadLink.resolution == quality;
    }
  );
  let downloadUrl = getInfoFromDB.downloadInfo[downloadUrlIndex].downloadLink;
  let status = "false";
  let statusCode = "500";
  if (!downloadUrl) {
    console.log("Cannot find Download link from ");

    await mergeStream(url, resolution, videoId, quality, title);

    const stream = fs.createReadStream(
      `./temp/${videoId}/${title}-${quality}.mkv`
    );

    const uploadVideo = await uploadStorages(
      "sgp1.digitaloceanspaces.com",
      generatePath(`youtube/${videoId}`, `${quality}-${title}`),
      stream
    );

    if (uploadVideo === true) {
      rimraf(generatePath(`./temp/${videoId}`), err => {
        if (err) throw err;
        console.log(`Folder ${videoId} was deleted`);
      });
      downloadUrl = `https://losslessmusic.sgp1.digitaloceanspaces.com/youtube/${videoId}/${quality}-${encodeTitle}`;
      status = "success";
    }

    // add into DB
    const downloadInfoClone = [...getInfoFromDB.downloadInfo];
    downloadInfoClone[downloadUrlIndex].downloadLink = downloadUrl;

    // console.log(getInfoFromDB);
    getInfoFromDB.updateOne({ downloadInfo: downloadInfoClone }, err =>
      console.error(err)
    );
  }

  const result = {
    status,
    downloadUrl,
    statusCode
  };
  //put into DB

  res.send(result);
});

module.exports = router;
