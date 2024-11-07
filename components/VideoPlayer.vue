<template>
  <video ref="videoPlayer" class="video-js vjs-default-skin" controls></video>
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