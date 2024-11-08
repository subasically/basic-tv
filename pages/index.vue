<template>
  <div class="xl:container mx-auto xl:mt-6">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
    <div v-else-if="channels.length">
      <div class="channel bg-white xl:rounded-lg xl:shadow-md xl:border-2 xl:border-slate-500/100">
        <div class="flex flex-col lg:flex-row justify-center mx-auto">
          <div class="flex-1 max-h-[280px] sm:max-h-full">
            <VideoPlayer class="min-w-full aspect-video" :src="channels[currentChannelIndex].url" />
          </div>
          <div class="flex-2 p-4">
            <label for="group-select" class="text-lg font-medium">Group</label>
            <select id="group-select" v-model="selectedGroup"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4">
              <option v-for="group in sortedGroups" :key="group" :value="group">{{ group }}</option>
            </select>
            <div class="overflow-y-auto max-h-[480px]">
              <h3 class="text-lg font-medium">Channels</h3>
              <div v-for="(channel, index) in filteredChannels" :key="index"
                @click="selectChannel(channel)"
                :class="{'bg-yellow-300': isCurrentlyPlaying(channel)}"
                class="cursor-pointer p-4 mb-2 mr-3 bg-white border-2 border-slate-200 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-100 hover:border-slate-300">
                <img :src="channel.logo" alt="Logo" class="w-12 h-12" />
                <div>
                  <h3 class="text-lg font-semibold">{{ channel.name }}</h3>
                  <p class="text-sm text-gray-500">{{ channel.group }} - {{ channel.chno }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-4">
              <button @click="channelStore.forceRefresh()"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Refresh EPG
              </button>
            </div>
          </div>
        </div>
      </div>
      <EPG :epg="epg" :currentChannel="channels[currentChannelIndex]" />
      <div class="text-sm text-gray-500">
        <h3>Last Updated: {{ formattedLastUpdated }}</h3>
      </div>
    </div>
    <div v-else class="text-center">
      <h3 class="text-lg font-semibold">No channels found.</h3>
      <button @click="channelStore.forceRefresh()"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        Refresh EPG
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useChannelStore } from '~/stores/channelStore';
import VideoPlayer from '~/components/VideoPlayer.vue';
import EPG from '~/components/EPG.vue';

const channelStore = useChannelStore();
const { channels, epg, lastUpdated, loading, currentChannel } = storeToRefs(channelStore);
const currentChannelIndex = ref(0);
const selectedGroup = ref('');

const formattedLastUpdated = computed(() => {
  return lastUpdated.value ? formatDistanceToNow(new Date(lastUpdated.value), { addSuffix: true }) : '';
});

const sortedGroups = computed(() => {
  const groups = channels.value.map(channel => channel.group);
  return [...new Set(groups)].sort();
});

const filteredChannels = computed(() => {
  if (!selectedGroup.value) return channels.value;
  return channels.value.filter(channel => channel.group === selectedGroup.value);
});

const isCurrentlyPlaying = (channel) => {
  return currentChannel.value && currentChannel.value.channelId === channel.channelId;
};

const selectChannel = (channel) => {
  channelStore.setCurrentChannel(channel);
  currentChannelIndex.value = channels.value.indexOf(channel);
};

onBeforeMount(() => {
  channelStore.fetchChannels().then(() => {
    const groups = sortedGroups.value;
    if (groups.length > 0) {
      selectedGroup.value = groups[0]; // Set the default group to the first sorted group
    }
  });
});

onMounted(() => {
  if (channels.value.length > 0) {
    currentChannelIndex.value = 0; // Mark the first channel as selected
  }
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

.bg-yellow-100 {
  background-color: #fefcbf;
}
</style>