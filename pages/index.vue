<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
    <div v-else-if="channels.length" class="space-y-6">
      <div class="channel bg-white p-4 rounded-lg shadow-md">
        <div class="flex justify-center max-w-5xl mx-auto">
          <VideoPlayer class="min-w-full min-h-[360px]" :src="channels[currentChannelIndex].url" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <label for="channel-select" class="text-lg font-medium">Channel</label>
        <select id="channel-select" v-model="currentChannelIndex" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="(channel, index) in channels" :key="index" :value="index">{{ channel.name }}</option>
        </select>
      </div>
      <EPG :epg="epg" :currentChannel="channels[currentChannelIndex]" />
      <div class="text-sm text-gray-500">
        <h3>Last Updated: {{ formattedLastUpdated }}</h3>
      </div>
    </div>
    <div v-else class="text-center">
      <h3 class="text-lg font-semibold">No channels found.</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useChannelStore } from '~/stores/channelStore';
import VideoPlayer from '~/components/VideoPlayer.vue';
import EPG from '~/components/EPG.vue';

const channelStore = useChannelStore();
const { channels, epg, lastUpdated, loading } = storeToRefs(channelStore);
const currentChannelIndex = ref(0);

const formattedLastUpdated = computed(() => {
  return lastUpdated.value ? formatDistanceToNow(new Date(lastUpdated.value), { addSuffix: true }) : '';
});

onMounted(() => {
  channelStore.fetchChannels();
});
</script>

<style scoped>
.loader {
  border-top-color: #3490dc;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>