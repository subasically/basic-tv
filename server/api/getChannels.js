import axios from 'axios';
import { parseM3U } from '~/utils/m3uParser';
import { parseEPG } from '~/utils/epgParser';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.resolve('./cache');
const PLAYLIST_CACHE_FILE = path.join(CACHE_DIR, 'playlist.json');
const EPG_CACHE_FILE = path.join(CACHE_DIR, 'epg.xml');
const CACHE_EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export default defineEventHandler(async (event) => {
  const playlistUrl = useRuntimeConfig().public.channelPlaylist;
  const epgUrl = useRuntimeConfig().public.epgUrl;

  if (!playlistUrl || !epgUrl) {
    throw createError({ statusCode: 500, statusMessage: 'PLAYLIST_URL or EPG_URL is not defined' });
  }

  let channels;
  let epg = [];
  let lastUpdated;

  try {
    console.info('Checking cache');
    const playlistCacheExists = fs.existsSync(PLAYLIST_CACHE_FILE);
    const epgCacheExists = fs.existsSync(EPG_CACHE_FILE);
    const playlistCacheAge = playlistCacheExists ? Date.now() - fs.statSync(PLAYLIST_CACHE_FILE).mtimeMs : Infinity;
    const epgCacheAge = epgCacheExists ? Date.now() - fs.statSync(EPG_CACHE_FILE).mtimeMs : Infinity;

    if (playlistCacheExists && epgCacheExists && playlistCacheAge < CACHE_EXPIRATION_TIME && epgCacheAge < CACHE_EXPIRATION_TIME) {
      console.info('Using cached playlist and EPG');
      const cachedData = JSON.parse(fs.readFileSync(PLAYLIST_CACHE_FILE, 'utf-8'));
      channels = cachedData.channels;
      epg = JSON.parse(fs.readFileSync(EPG_CACHE_FILE, 'utf-8'));
      lastUpdated = new Date(fs.statSync(PLAYLIST_CACHE_FILE).mtimeMs).toISOString();
    } else {
      console.info('Fetching new playlist and EPG');
      let playlistResponse, epgResponse;
      try {
        [playlistResponse, epgResponse] = await Promise.all([
          axios.get(playlistUrl),
          axios.get(epgUrl)
        ]);
      } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch playlist or EPG' });
      }

      console.info('Parsing playlist and EPG');
      try {
        channels = parseM3U(playlistResponse.data);
        epg = parseEPG(epgResponse.data);
        console.info('Parsing successful');
      } catch (error) {
        console.error('Error parsing EPG:', error);
        epg = [];
      }

      // Save to cache
      console.info('Saving playlist and EPG to cache');
      fs.writeFileSync(PLAYLIST_CACHE_FILE, JSON.stringify({ channels }), 'utf-8');
      fs.writeFileSync(EPG_CACHE_FILE, JSON.stringify(epg), 'utf-8');
      lastUpdated = new Date().toISOString();
    }

    return { channels, epg, lastUpdated };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load playlist or EPG' });
  }
});