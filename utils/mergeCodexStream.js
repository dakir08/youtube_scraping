const { exec } = require("child_process");
module.exports = function(url, resolution, videoId, quality, title) {
  return new Promise((resolve, reject) => {
    const cmd = `youtube-dl -f bestvideo[height=${resolution}]+bestaudio --merge-output-format mkv -o "temp/${videoId}/${title}-${quality}" ${url}`;
    console.log("EXECUTING YTDL....");
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      resolve(stdout ? stdout : stderr);
      console.log("DOWNLOAD COMPLETE....");
      console.log("WAITING FOR NEXT DOWNLOAD...");
    });
  });
};
