const fs = require('fs')
const Mastodon = require('mastodon')

var M = new Mastodon({
    access_token: process.env.OUTPUT_MASTODON_ACCESS_TOKEN,
    api_url: process.env.OUTPUT_MASTODON_API 
})

exports.postToot = async function (string)
{
    M.post('statuses', { status: string }, function(err, data, response) {
        console.log(`Posted status: ${string}`);
    });
}

exports.postImage = async function (description)
{
    M.post('media', { file: fs.createReadStream('./final.png'), description: description }).then(resp => {
        const id = resp.data.id;
        M.post('statuses', { status: '', media_ids: [id] })
    })
}
