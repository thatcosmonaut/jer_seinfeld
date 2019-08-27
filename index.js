const async = require('async')
const fs = require('fs')
const TootDownloader = require('./toot-downloader.js')
const TootProcessor = require('./toot-processor.js')
const TootPoster = require('./toot-poster.js')
const exec = require('child_process').execSync;
const path = require('path');

async function main()
{
    var jerID = 842131;

    var toots = []

    var tootsPath = path.resolve(__dirname, "toots.json");
    if(fs.existsSync(tootsPath))
    {
        toots = await TootDownloader.updateToots(tootsPath, jerID)
    }
    else
    {
        toots = await TootDownloader.downloadAllToots(tootsPath, jerID)
    }

    filteredToots = toots.filter((toot) => !toot.reblog && !toot.sensitive && toot.in_reply_to_id == jerID && toot.in_reply_to_account_id == jerID);

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

    var jerry = path.resolve(__dirname, jerrys[Math.floor(Math.random() * jerrys.length)]);

    var randomToot = filteredToots[Math.floor(Math.random() * filteredToots.length)].content;
    
    var processedToot = "JERRY: " + TootProcessor.processToot(randomToot);

    console.log(randomToot);
    console.log(processedToot);

    exec(`convert -background 'rgba(0, 255, 255, 0)' -fill white -size 640x320 -pointsize 32 -gravity South caption:'${processedToot}' ${path.resolve(__dirname, "caption.png")}`, (err, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (err) {
            console.log(`exec error: ${error}`);
        }
    });

    console.log(jerry + " chosen");

    exec(`composite -gravity South -geometry +0+30 ${path.resolve(__dirname, "caption.png")} ${jerry} ${path.resolve(__dirname, "final.png")}`, (err, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (err) {
            console.log(`exec error: ${error}`);
        }
    });

    TootPoster.postImage(processedToot)
}

main()
