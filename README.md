# ISS Tracker Webtask

Space is awesome, and I enjoy spotting the International Space Station.
As such, I spend time on [SpotTheStation](http://spotthestation.nasa.gov)
tracking it so that my family and I can catch a glimpse of it. The site
is lovely, but slow and sometimes 500's for us.

I noticed that it has an XML option for my area, so I wrote this script
to fetch the XML file no more than once per day and return the listings to me
as JSON. I'm then adding a front end in Elm (because why not?) to consume and
format the data quickly. That app will simply be a static asset on github.io 
or on my personal site.

## To Develop Locally
Make sure you're using node 4.8.4 to be compatible with the wt environment.

1. `npm -g install wt-cli`
2. Clone repo
3. Run `yarn install`
4. Run `yarn serve:wt` to serve locally
5. Visit the path given to view the endpoint
6. Run `yarn publish` to bundle and ship the package to webtask.io
