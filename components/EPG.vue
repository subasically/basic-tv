<template>
  <div v-if="currentChannelEPG.length">
    <h3 class="text-lg font-semibold mb-4">EPG for {{ currentChannelName }}</h3>
    <ul class="space-y-4">
      <li v-for="program in currentChannelEPG" :key="program.start" :class="{'bg-yellow-100': isCurrentlyPlaying(program)}" class="p-4 bg-gray-100 rounded-lg shadow">
        <div class="flex justify-between items-center mb-2">
          <strong class="text-md font-medium">{{ program.title }}</strong>
          <span class="text-sm text-gray-600">{{ formatDate(program.start) }} - {{ formatDate(program.stop) }}</span>
        </div>
        <p class="text-sm text-gray-700">{{ program.description }}</p>
      </li>
    </ul>
  </div>
  <div v-else>
    <h3 class="text-lg font-semibold">No EPG available for {{ currentChannelName }}</h3>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format, parse, isWithinInterval } from 'date-fns';

const props = defineProps({
  epg: Array,
  currentChannel: Object
});

const currentChannelName = computed(() => props.currentChannel.name);

const currentChannelEPG = computed(() => {
  const channelId = props.currentChannel.channelId
  return props.epg.filter(program => program.channel === channelId);
});

const formatDate = (dateString) => {
  const date = parse(dateString, "yyyyMMddHHmmss X", new Date());
  return format(date, 'PPpp');
};

const isCurrentlyPlaying = (program) => {
  const now = new Date();
  const start = parse(program.start, "yyyyMMddHHmmss X", new Date());
  const stop = parse(program.stop, "yyyyMMddHHmmss X", new Date());
  return isWithinInterval(now, { start, end: stop });
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

.bg-yellow-100 {
  background-color: #fefcbf;
}
</style>