const striptags = require('striptags');
const unescape = require('unescape');

function stripAtsFromToot(toot) {
    return toot.replace( /@([\dA-Za-z\-\_]+) ?/g, '' );
}

function convertBRToEscapeLineBreak(toot) {
    var regex = /<br\s*[\/]?>/gi;

    return toot.replace(regex, "\n")
}

function stripHTMLTagsFromToot(toot)
{
    return striptags(toot, ['<br>', '<a>'])
}

function unescapeToot(toot)
{
    return unescape(toot)
}

exports.processToot = function(toot)
{
    return unescapeToot(stripAtsFromToot(stripHTMLTagsFromToot(toot)))
}
