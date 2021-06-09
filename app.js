const NodeMediaServer = require('./');
const axios = require('axios');

//TODO aquire Signature programmaticly
//TODO aquire userid programmaticly

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/'
});

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*'
  },
  https: {
    port: 8443,
    key: './privatekey.pem',
    cert: './certificate.pem',
  },
  auth: {
    api: true,
    api_user: 'admin',
    api_pass: 'admin',
    play: false,
    publish: false,
    secret: 'nodemedia2017privatekey'
  },
};


let nms = new NodeMediaServer(config)
nms.run();

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log("==============pre");

  var key = StreamPath.split('/')[2];

  instance.post(`users/` + key)
  .then((res) => {
    //TODO maybe logging?
  }).catch((e) => {
    let session = nms.getSession(id);
    session.reject();
  });
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log("==============post");
  
  var key = StreamPath.split('/')[2];

  instance.post(`streams/${key}`, { online: true })
  .then((res) => {
    //TODO logging or handling response
  }).catch((e) => {
    //TODO Error handling
  });
});

nms.on('donePublish', (id, StreamPath, args) => {
  var key = StreamPath.split('/')[2];

  instance.post(`streams/${key}`, { online: false })
  .then((res) => {
    //TODO logging or handling response
  }).catch((e) => {
    //TODO Error handling
  });
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log("==============preplay");
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log("==============postplay");
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log("==============doneplay");
});

