//comes from node
const path =  require('path')
const fs =  require('fs')

let imagesPath = []

const logError = err => err && console.error(err)
// ipc.on('image-captured', (evt, contents) => {
exports.save = (picturesPath, contents, done) => {
const base64Data = contents.replace(/^data:image\/png;base64,/, '')
imgPath = path.join(picturesPath, `${new Date()}.png`)
fs.writeFile(imgPath, base64Data, {encoding: 'base64'}, err => {
    if (err) return logError(err)
    //else
    done(null, imgPath)
})
}

exports.getPicturesDir = (app) => {
return path.join(app.getPath('pictures'),'photobombth')
}

//its creating a folder and subfolder named Photobombth
exports.mkdir = picturesPath => {
    fs.stat(picturesPath, (err, stats) => {
        if(err && err.code !== 'ENOENT')
        return logError(err)
        else if( err || !stats.isDirectory())
        fs.mkdir(picturesPath, logError)
    })
}

exports.cache = imgPath => {
    imagesPath = imagesPath.concat([imgPath])
    return imagesPath
}

exports.getFromCache = (index) => {
    return imagesPath[index]
}

exports.remove = (index, done) => {
    //synchronous unlink(2) - delete a name and possibly the file it refers to.
    fs.unlink(imagesPath[index], err => {
        if(err) return logError(err)

        imagesPath.splice(index,1)
        done()
    })
}