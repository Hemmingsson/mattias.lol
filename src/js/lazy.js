
import mobile from './mobile.js'

const loadVideo = (target) =>{
    target.src = target.dataset.src
}

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target);
        loadVideo(entry.target)
    });
}, {
    rootMargin: '0px 0px 200px 0px'
});

var init = function() {
    if(mobile.isMobile) return
    const videos = document.querySelectorAll('video')
    videos.forEach(video => observer.observe(video));
}

export default {
    init
}