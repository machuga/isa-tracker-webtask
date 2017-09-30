//'use latest';

const express = require('express');
const { fromExpress } = require('webtask-tools');
//const bodyParser = require('body-parser');
const fetcher = require('./fetcher');
const createStorage = require('./storage');
const erieFeed = 'https://spotthestation.nasa.gov/sightings/xml_files/United_States_Pennsylvania_Erie.xml';
const app = express();

//app.use(bodyParser.json());

app.get('/', (req, res) => {
  //const HTML = renderView({
  //  title: 'Erie ISS Sighting Opportunities',
  //  body: '<h1>Loading</h1>'
  //});

  //res.set('Content-Type', 'text/html');
  //res.status(200).send(HTML);
  const storage = createStorage(req.webtaskContext.storage);

  fetcher(erieFeed, storage).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    console.log("Something went wrong", err.stack);
    res.sendStatus(500);
  });
});

module.exports = fromExpress(app);

function renderView(locals) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>${locals.title}</title>

      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                                 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', '${locals.googleAnalyticsId}', 'auto');
        ga('send', 'pageview');
      </script>
    </head>

    <body>
      <div id="app">
        ${locals.body}
      </div>
    </body>
    </html>
  `;
}
