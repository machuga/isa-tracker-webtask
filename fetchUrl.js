const request = require('request');

const requestTypes = {
  json: 'application/json',
  xml: 'application/xhtml+xml',
  html: 'text/html,application/xhtml+html'
};

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:45.0) Gecko/20100101 Firefox/45.0',
  Accept: requestTypes.html
};

const fetchUrl = (url, requestType = 'html', headers = {}) => new Promise((resolve, reject) => {
  request({
    url,
    headers: Object.assign({}, defaultHeaders, headers),
    pool: false,
    json: requestType === 'json',
    followRedirect: true
  }, (err, res, body) => {
    if (err) {
      reject(err)
    } else if (res.statusCode < 200 && res.statusCode >= 400) {
      reject(new Error(`Unsuccessful Status Code: ${res.statusCode}`));
    } else {
      resolve(res);
    }
  });
});

module.exports = fetchUrl;
