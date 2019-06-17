const AWS = require("aws-sdk");
const request = require("request-promise");
// const client = require("../redisClient");

AWS.config.setPromisesDependency(Promise);

module.exports = async function(url, bucket, streaming) {
  try {
    // let uploadingFiles = await client.getAsync("uploadingFiles");
    // uploadingFiles = JSON.parse(uploadingFiles);

    const spacesEndpoint = new AWS.Endpoint(url);

    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: "HYRI555JNYNMDQW2ASIZ",
      secretAccessKey: "0v7QQpj0dsUPo48skxKnOtMkw3v9VGbHIgfeilzlJ+U"
    });

    const reqParams = {
      Bucket: "losslessmusic",
      Key: bucket
    };

    let shouldUpload = false;
    try {
      await s3.headObject(reqParams).promise();
    } catch (error) {
      // uploadingFiles = uploadingFiles.filter(f => f !== url);
      // client.set("uploadingFiles", JSON.stringify(uploadingFiles));
      shouldUpload = true;
    }

    if (!shouldUpload) {
      console.log(`skipping ${bucket}`);
      return false;
    }

    console.log(`start putting inside uploadDigitalOcean ${bucket}`);

    // Putting file into space

    let updateSuccess = true;
    // let body;
    // try {
    //   body = await request({
    //     uri: url,
    //     encoding: null
    //   });
    // } catch (e) {
    //   console.log("something wrong when fetching data");
    //   // uploadingFiles = uploadingFiles.filter(f => f !== url);
    //   // client.set("uploadingFiles", JSON.stringify(uploadingFiles));
    //   return false;
    // }

    const params = {
      // EDIT HERE
      Body: streaming,
      Bucket: "losslessmusic",
      // EDIT HERE
      Key: bucket,
      ACL: "public-read"
    };

    try {
      await s3.putObject(params).promise();
      console.log("UPLOAD SUCCESS");
    } catch (error) {
      updateSuccess = false;
      // uploadingFiles = uploadingFiles.filter(f => f !== url);
      // client.set("uploadingFiles", JSON.stringify(uploadingFiles));
      console.log("error when putting into s3 putObject");
      console.log(error);
    }

    return updateSuccess;
  } catch (ex) {
    console.log(ex);
    // uploadingFiles = uploadingFiles.filter(f => f !== url);
    // client.set("uploadingFiles", JSON.stringify(uploadingFiles));
    return false;
  }
};
