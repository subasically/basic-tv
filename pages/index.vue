<template>
  <div>
    <div>
      <label for="country">Select Country:</label>
      <select id="country" v-model="selectedCountry" @change="fetchChannels" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="US">United States</option>
        <option value="UK">United Kingdom</option>
        <option value="CA">Canada</option>
      </select>
    </div>
    <div v-if="channels.length">
      <div class="channel">
        <h3>{{ channels[currentChannelIndex].name }}</h3>
        <VideoPlayer :src="channels[currentChannelIndex].url" />
      </div>
      <select v-model="currentChannelIndex" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option v-for="(channel, index) in channels" :key="index" :value="index">{{ channel.name }}</option>
      </select>
      <div v-if="epg.length">
        <h3>EPG</h3>
        <ul>
          <li v-for="program in epg" :key="program.start">
            <strong>{{ program.title }}</strong> ({{ program.start }} - {{ program.stop }}): {{ program.description }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h3>No channels found.</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import VideoPlayer from '~/components/VideoPlayer.vue';

const channels = ref([]);
const epg = ref([]);
const currentChannelIndex = ref(0);
const selectedCountry = ref('US');

const fetchChannels = async () => {
  try {
    const response = await fetch(`/api/getChannels?country=${selectedCountry.value}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    channels.value = data.channels;
    epg.value = data.epg;
    currentChannelIndex.value = 0;
    console.log('Channels and EPG fetched successfully', data);
  } catch (error) {
    console.warn("Error: Unable to get channels or EPG.", error);
  }
};

onMounted(fetchChannels);

watch(selectedCountry, fetchChannels);
</script>

<style scoped>
.channel {
  display: flex;
  margin-bottom: 20px;
}
</style>