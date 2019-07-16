//(counterEl, 3, _ => {})
function setCount(counterEl, count) {
    counterEl.innerHTML = count > 0 ? count : ''
}
exports.start = (counterEl, timer, done) => {
    for(let i=0; i<=timer; ++i){
        setTimeout(_ => {
            const count = timer - i
            setCount(counterEl, count)
            if(i===timer) 
                    done()
        }, i*1000)
    }
}