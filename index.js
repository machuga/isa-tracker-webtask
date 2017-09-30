const request = require('request');
const feed = require('rss-to-json');
const fetcher = require('./fetcher');
const createStorage = require('./storage');
const erieFile = 'https://spotthestation.nasa.gov/sightings/xml_files/United_States_Pennsylvania_Erie.xml';
//const ENDPOINT = 'https://spotthestation.nasa.gov/sightings/view.cfm';

const validParams = ['country', 'region', 'city'];
const countries = {
  us: 'United_States',
  ca: 'Canada'
};
//?country=United_States&region=Pennsylvania&city=Erie

const params = { country: countries.us, region: 'Pennsylvania', city: 'Erie' };

const fetchUrl = (url, json = false) => new Promise((resolve, reject) => {
  request({ url, json }, (err, res, body) => {
    err ? reject(err) : resolve(res);
  });
});

//const fetchIssTle = () => 
//  fetchUrl(tleStationsFile)
//    .then((body) => body.split('\n'))
//    .then((lines) => lines.slice(0,3))
//    //.then(TLE.parse)
//
const getResults = () => fetchUrl(`${ENDPOINT}?${qs.stringify(params)}`);

const getFeed = () => new Promise((resolve, reject) => {
  feed.load(erieFile, (err, rss) => {
    err ? reject(err) : resolve(rss);
  });
});

const parseOpportunity = (item) =>
  item.description
    .split('<br/>')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => part.split(':'))
    .map(([key, ...values]) => [key, values.join(':')])
    .map(([key, value]) => [key.toLowerCase().replace(' ', '_').trim(), value.trim()])
    .reduce((acc, [key, value]) => {
      acc[key] = value;

      return acc;
    }, {});

const parseOpportunities = (items) => {
  return items.map(parseOpportunity);
}

const getOpportunities = () => 
  fetcher(erieFile, createStorage()).then(body => parseOpportunities(body.items))

getOpportunities().then(console.log).catch(console.error);

//fetchIssTle().then(([name, line1, line2]) => {
//  const satRec = satellite.twoline2satrec(line1, line2);
//  const positionAndVelocity = satellite.propagate(satRec, new Date())
//  console.log(positionAndVelocity);
//})
