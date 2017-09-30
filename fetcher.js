const xml2js = require('xml2js');
const request = require('request');
const fetchUrl = require('./fetchUrl');

const KEY = 'us:pa:erie';
const fetchFeed = (feed, store) => {
  return store.get().then((data) => {
    const target = data[KEY];
    const now = new Date();

    if (target && new Date(target.expiresAt) > now) {
      return target;
    } else {
      return fetchUrl(feed, 'xml')
        .then(res => res.body)
        .then(xmlToJson)
        .then((result) => {
          const expiresAt = new Date().setDate(now.getDate() + 1);

          data[KEY] = Object.assign({}, result, { expiresAt });

          return store.set(data).then(data => data[KEY]);
        });
    }
  });
}

const xmlToJson = (xml) => {
  const parser = new xml2js.Parser({
    trim: false,
    normalize: true,
    mergeAttrs: true
  });

  return new Promise((resolve, reject) => {
    parser.parseString(xml, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }).then(parse);
};

const parse = (json) => {
  const channel = Array.isArray(json.rss.channel) ? json.rss.channel[0] : json.rss.channel;
  const items = Array.isArray(channel.item) ? channel.item : [channel.item];

  return {
    title: channel.title[0],
    url: channel.link[0],
    description: channel.description[0],
    items: items.map((val) => ({
      title: val.title[0],
      description: val.description[0],
      created: Date.parse(val.pubDate[0]),
    }))
  };
};

module.exports = fetchFeed;
