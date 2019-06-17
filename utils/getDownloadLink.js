module.exports = function(domain, url, quality, height, videoId, title) {
  const encodeTitle = encodeURIComponent(title);
  return `${domain}/api/v2/youtube/generateDownloadLink?url=${url}&quality=${quality}&height=${height}&videoId=${videoId}&title=${encodeTitle}`;
};
