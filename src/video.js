function handleSuccess(video, stream) {
    //stres of the webcam
 video.srcObject = window.URL.createObjectURL(stream);
}

function handleError(video, strem) {
    console.log('there was an error')
}

const constraints = {
    audio: false,
    video: {
        mandatory: {
            maxHeight: 480,
            maxWidth: 853,
            minHeight: 480,
            minWidth: 853,
        }
    }
};

exports.init = (nav, video) => {
    // to get webcam video
    nav.getUserMedia = nav.webkitGetUserMedia;

   

    nav.getUserMedia(
        constraints,
        stream => video.srcObject = stream,
        error => console.error(error));
}

exports.captureBytes = (videoEl, ctx, canvasEl) => {
 ctx.drawImage(videoEl,0,0)
 return canvasEl.toDataURL('image/png')
}

exports.captureBytesFromLiveCanvas = (canvasEl) => {
return canvasEl.toDataURL('image/png')
}