const electron = require('electron')
const video = require('./video')
const countdown = require('./countdown')
const effects = require('./effects')
const flash = require('./flash')
const { ipcRenderer: ipc, shell, remote } = electron

//porque nao é um ipc, mas é como se houvesse um require no main process
const images = remote.require('./images') 

let canvasTarget
let seriously
let videoSrc

function formatImgTag(document, bytes) {
    const div = document.createElement('div')
    div.classList.add('photo')
    const close = document.createElement('div')
    close.classList.add('photoClose')
    const img = new Image()
    img.classList.add('photoImg')
    img.src = bytes
    div.appendChild(img)
    div.appendChild(close)
    return div
}

// function customCreateObjectURL(object) {
//     return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
// }

window.addEventListener('DOMContentLoaded', _ => {
    const videoEl = document.getElementById('video');    
    const canvasEl = document.getElementById('canvas')
    const recordEl = document.getElementById('record')
    const photosEl = document.getElementById('photos')
    const counterEl = document.getElementById('counter')
    const flashEl = document.getElementById('flash')
    
    //const ctx = canvasEl.getContext('2d'); --> no need because seriously is already doing this for us

    seriously = new Seriously()
    //connect seriously to the videoSrc and Target
    videoSrc = seriously.source('#video')
    canvasTarget = seriously.target('#canvas')

    //ascii -> name of the effect
    effects.choose(seriously, videoSrc, canvasTarget, 'ascii')

    video.init(navigator, videoEl)
    
    recordEl.addEventListener('click', _ => {
    //when i click record --> countdown
        countdown.start(counterEl, 3, _ => {
            flash(flashEl);
            //const bytes = video.captureBytes(videoEl, ctx, canvasEl)
            const bytes = video.captureBytesFromLiveCanvas(canvasEl)
            //send to the main
            ipc.send('image-captured', bytes)
            photosEl.appendChild(formatImgTag(document, bytes))
        })
       
    })
   
    photosEl.addEventListener('click', evt => {
        //o click vai para a div
        const hasRemove = evt.target.classList.contains('photoClose');
        const selector = hasRemove ? '.photoClose' : '.photoImg'
        const photos = Array.from(document.querySelectorAll(selector));
        const index = photos.findIndex( el => el == evt.target)

        if(index > -1){
            if(hasRemove)
            ipc.send('image-remove', index)
        
            else
            shell.showItemInFolder(images.getFromCache(index));
        }
    })
})

ipc.on('image-removed', (evt, index) => {
    imagesContainer = Array.from(document.querySelectorAll('.photo'))
    document.getElementById('photos').removeChild(imagesContainer[index])
})

ipc.on('effect-choose', (evt, effectName) => {
    effects.choose(seriously,videoSrc,canvasTarget, effectName)
})