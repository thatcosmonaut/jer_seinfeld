const fs = require('fs')

exports.readTootFile = async function(filename)
{
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, 'utf8', function(error, result) {
            if (error) { reject(error) }
            else { resolve(result) }
        })
    })
}
