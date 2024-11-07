<template>
  <video ref="videoPlayer" class="video-js vjs-theme-city" controls></video>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const props = defineProps({
  src: String
});

const videoPlayer = ref(null);
let player = null;

onMounted(() => {
  player = videojs(videoPlayer.value, {
    controls: true,
    autoplay: false,
    preload: 'auto',
    techOrder: ['html5', 'flash'],
    sources: [{ src: props.src, type: 'application/x-mpegURL' }]
  });

  player.on('error', () => {
    console.error('Video.js error:', player.error());
  });

  onBeforeUnmount(() => {
    if (player) {
      player.dispose();
    }
  });
});

watch(() => props.src, (newSrc) => {
  if (player) {
    player.src({ src: newSrc, type: 'application/x-mpegURL' });
    player.load();
    player.play();
  }
});
</script>

<style scoped>
.video-js {
  width: 100%;
  height: 100%;
}
</style>