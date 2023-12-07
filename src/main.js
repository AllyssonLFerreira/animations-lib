
document.querySelector('#app').innerHTML = ``

document.getElementById('navigateOrbit').addEventListener('click', () => {
    window.location.href = './orbit/orbit.html'
})

document.getElementById('navigateWave').addEventListener('click', () => {
    window.location.href = './wave/wave.html'
})

document.getElementById('navigateParticles').addEventListener('click', () => {
    window.location.href = './particles/particles.html'
})