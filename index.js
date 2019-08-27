require('dotenv').config()
const async = require('async')
const fs = require('fs')
const TootDownloader = require('./toot-downloader.js')
const TootProcessor = require('./toot-processor.js')
const TootPoster = require('./toot-poster.js')
const exec = require('child_process').execSync;

async function main()
{
    var jerID = 842131;

    var toots = []

    if(fs.existsSync('toots.json'))
    {
        toots = await TootDownloader.updateToots('toots.json', jerID)
    }
    else
    {
        toots = await TootDownloader.downloadAllToots('toots.json', jerID)
    }

    notReTootedToots = toots.filter((toot) => !toot.reblog)
    notSensitiveToots = notReTootedToots.filter((toot) => !toot.sensitive)

    var jerrys = [
        './images/jerry1.png',
        './images/jerry2.png',
        './images/jerry3.png',
        './images/jerry4.png',
        './images/jerry5.png',
        './images/jerry6.png',
        './images/jerry7.png',
        './images/jerry8.png'
    ];

    var jerry = jerrys[Math.floor(Math.random() * jerrys.length)];

    var randomToot = notSensitiveToots[Math.floor(Math.random() * notSensitiveToots.length)].content;
    
    var processedToot = "JERRY: " + TootProcessor.processToot(randomToot);

    console.log(randomToot);
    console.log(processedToot);

    exec(`convert -background 'rgba(0, 255, 255, 0)' -fill white -size 640x320 -pointsize 32 -gravity South caption:'${processedToot}' caption.png`, (err, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (err) {
            console.log(`exec error: ${error}`);
        }
    });

    console.log(jerry + " chosen");

    exec(`composite -gravity South -geometry +0+30 caption.png ${jerry} final.png`, (err, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (err) {
            console.log(`exec error: ${error}`);
        }
    });

    TootPoster.postImage(processedToot)
}

main()
