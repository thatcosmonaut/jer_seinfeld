const Mastodon = require('mastodon')
var fs = require('fs')
const FileOps = require('./file-ops.js')


var M = new Mastodon({
    access_token: process.env.INPUT_MASTODON_ACCESS_TOKEN,
    api_url: process.env.INPUT_MASTODON_API
})

exports.getAccountID = async function()
{
    const result = await M.get('accounts/verify_credentials')
    return result.data.id
}

exports.getAccountString = async function()
{
    const result = await M.get('accounts/verify_credentials')
    return result.data.acct
}

exports.getTootsUpTo = async function(account_id, max_id)
{
    const response = await M.get('accounts/:id/statuses', { id: account_id, max_id: max_id, limit: 40 })
    const statuses = response.data
    return statuses
}

exports.getTootsSince = async function(account_id, since_id)
{
    const response = await M.get('accounts/:id/statuses', { id: account_id, since_id: since_id, limit: 40 })
    const statuses = response.data
    return statuses
}

exports.getAllTootsStart = async function(account_id)
{
    const response = await M.get('accounts/:id/statuses', { id: account_id, limit: 40 })
    const statuses = response.data
    return statuses
}

exports.downloadAllToots = async function(filename, accountID)
{
    var toots = await exports.getAllTootsStart(accountID)

    var sizeOfLastGroup = 40

    const things = await (async function thing(toots) {
        while (sizeOfLastGroup == 40)
        {
            var last = toots.slice(-1)[0]
            var nextGroup = await exports.getTootsUpTo(accountID, last.id)

            toots = toots.concat(nextGroup)
            sizeOfLastGroup = nextGroup.length
            console.log(sizeOfLastGroup)
        }

        return toots
    })(toots)

    await fs.writeFile(filename, JSON.stringify(things), 'utf8', () => {})
    return things
}

latestTootID = function(toots)
{
    return Math.max(...toots)
}

exports.updateToots = async function(filename, accountID)
{
    var tootsFile = await FileOps.readTootFile(filename)
    var toots = JSON.parse(tootsFile)

    var newToots = await (async (toots) => {
        //var latestID = latestTootID(toots)
        latestID = toots[0].id

        var newToots = []
        var sizeOfLastGroup = 40

        while (sizeOfLastGroup == 40)
        {
            var nextGroup = await exports.getTootsSince(accountID, latestID)
            if (nextGroup.length > 0)
            {
                sizeOfLastGroup = nextGroup.length

                newToots = nextGroup.concat(newToots)

                latestID = nextGroup.slice(-1)[0].id
            }
            else
            {
                sizeOfLastGroup = 0
            }
        }

        return newToots
    })(toots)

    toots = newToots.concat(toots)
    await fs.writeFile(filename, JSON.stringify(toots), 'utf8', () => {})

    return toots
}
