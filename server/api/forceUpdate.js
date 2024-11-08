import fs from 'fs';
import path from 'path';
import { parseM3U } from '~/utils/m3uParser';
import { parseEPG } from '~/utils/epgParser';
import { main as fetchChannelsEPG } from '~/scripts/fetchChannelsEPG';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const params = {
    regions: config.public.tv_regions,
    groups: '',
    start_chno: '',
    sort: 'name',
    include: '',
    exclude: ''
  };
  const playlistPath = path.resolve('public/playlist.m3u8');
  const epgPath = path.resolve('public/epg.xml');

  console.info('Running fetchChannelsEPG to get channels and EPG with params:', params);
  await fetchChannelsEPG(params);

  const playlistContent = fs.readFileSync(playlistPath, 'utf8');
  const epgContent = fs.readFileSync(epgPath, 'utf8');

  const channels = parseM3U(playlistContent);
  const epg = parseEPG(epgContent);

  return { channels, epg, lastUpdated: new Date().toISOString() };
});