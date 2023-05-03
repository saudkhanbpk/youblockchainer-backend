const ipfsClient = require('ipfs-http-client');

const auth =
  `Basic ` +
  Buffer.from(
    process.env.PROJECT_ID + `:` + process.env.PROJECT_SECRET
  ).toString(`base64`);
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

exports.uploadImg = async (req, res) => {
  if (!req.files) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: false,
      status: 'Not a single file found in request',
    });
  } else {
    let urls = [];
    await Promise.all(
      req.files.map(async (fil) => {
        let CID = await ipfs.add(fil.buffer);
        urls.push(`https://youblockchainer.infura-ipfs.io/ipfs/${CID.path}`);
      })
    );

    res.json({
      success: true,
      urls,
    });
  }
};

exports.uploadJson = async (req, res) => {
  let CID = await ipfs.add(JSON.stringify(req.body));
  let url = `https://youblockchainer.infura-ipfs.io/ipfs/${CID.path}`;

  res.json({
    success: true,
    url,
  });
};
