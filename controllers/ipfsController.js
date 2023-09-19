const { getMethods } = require('../config/blockchain');

exports.uploadImg = async (req, res) => {
  try {
    if (!req.files) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: false,
        status: 'Not a single file found in request',
      });
    } else {
      const { ipfs } = await getMethods();
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
  } catch (err) {
    res.json({
      success: false,
      msg: err.message,
    });
  }
};

exports.uploadJson = async (req, res) => {
  try {
    const { ipfs } = await getMethods();
    let CID = await ipfs.add(JSON.stringify(req.body));
    let url = `https://youblockchainer.infura-ipfs.io/ipfs/${CID.path}`;

    res.json({
      success: true,
      url,
    });
  } catch (err) {
    res.json({
      success: false,
      msg: err.message,
    });
  }
};
