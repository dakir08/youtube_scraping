const {
  express,
  fs,
  youtubedl,
  mongoose
} = require("./config/packagerequirement");
const youtubeAPI = require("./router/youtube");

mongoose
  .connect(
    "mongodb://dakir08:DAnh1702@ds139037.mlab.com:39037/youtubedownloader",
    { useNewUrlParser: true, useFindAndModify: true },
    () => console.log("CONNECT TO DB....")
  )
  .catch(err => console.error(`cannot connect to mongoDB ${err}`));

const app = express();

// v2 youtube

app.use("/api/v2/youtube", youtubeAPI);

app.listen(3000, () => {
  console.log("Server Works !!! At port 3000");
});
