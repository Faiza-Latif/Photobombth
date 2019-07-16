let timer
module.exports = (flashEl) => {
    clearTimeout(timer);
    flashEl.classList.add('is-flashing');
    timer = setTimeout(_ => {
        flashEl.classList.remove('is-flashing')
    }, 2000)
}