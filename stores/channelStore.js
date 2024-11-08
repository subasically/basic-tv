import { defineStore } from 'pinia';
import axios from 'axios';

export const useChannelStore = defineStore('channelStore', {
  state: () => ({
    channels: [],
    epg: [],
    lastUpdated: '',
    loading: true,
    currentChannel: null, // Add this line
  }),
  actions: {
    async fetchChannels() {
      this.loading = true;
      try {
        const response = await axios.get('/api/getChannels');
        const data = response.data;

        this.channels = data.channels;
        this.epg = data.epg;
        this.lastUpdated = data.lastUpdated;
      } catch (error) {
        console.warn("Error: Unable to get channels, EPG, or last updated time.", error);
      } finally {
        this.loading = false;
      }
    },
    async forceRefresh() {
      this.loading = true;
      try {
        const response = await axios.get('/api/forceUpdate');
        const data = response.data;

        this.channels = data.channels;
        this.epg = data.epg;
        this.lastUpdated = data.lastUpdated;
      } catch (error) {
        console.warn("Error: Unable to force refresh channels, EPG, or last updated time.", error);
      } finally {
        this.loading = false
      }
    },
    setCurrentChannel(channel) {
      this.currentChannel = channel;
    },
  },
});