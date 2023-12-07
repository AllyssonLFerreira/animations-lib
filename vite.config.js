export default {
    root: './src',
    build: {
      rollupOptions: {
        input: {
          main: '/index.html',
          orbit: '/orbit/orbit.html',
          wave: '/wave/wave.html',
          particles: '/particles/particles.html'
        },
      },
    },
};