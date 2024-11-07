import { defineStore } from 'pinia';

export const useChannelStore = defineStore('channelStore', {
  state: () => ({
    channels: [],
    epg: [],
    lastUpdated: '',
    loading: true,
  }),
  actions: {
    async fetchChannels() {
      this.loading = true;
      try {
        const response = await fetch('/api/getChannels');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const uniqueChannels = [];
        const channelNames = new Set();

        data.channels.forEach(channel => {
          const channelId = channel.url.split('/').pop().split('.')[0]; // Extract ID from URL
          if (!channelNames.has(channel.name)) {
            channelNames.add(channel.name);
            uniqueChannels.push({
              ...channel,
              id: channelId
            });
          }
        });

        this.channels = uniqueChannels.sort((a, b) => a.name.localeCompare(b.name)); // Sort channels alphabetically by name
        this.epg = data.epg;
        this.lastUpdated = data.lastUpdated;
      } catch (error) {
        console.warn("Error: Unable to get channels, EPG, or last updated time.", error);
      } finally {
        this.loading = false;
      }
    }
  }
});