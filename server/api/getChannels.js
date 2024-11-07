import fs from 'fs';
import path from 'path';
import { parseM3U } from '~/utils/m3uParser';
import { parseEPG } from '~/utils/epgParser';

export default defineEventHandler(async (event) => {
  const playlistPath = path.resolve('public/playlist.m3u8');
  const epgPath = path.resolve('public/epg.xml');

  if (!fs.existsSync(playlistPath) || !fs.existsSync(epgPath)) {
    throw createError({ statusCode: 500, statusMessage: 'Playlist or EPG file not found' });
  }

  const playlistContent = fs.readFileSync(playlistPath, 'utf8');
  const epgContent = fs.readFileSync(epgPath, 'utf8');

  const channels = parseM3U(playlistContent);
  const epg = parseEPG(epgContent);

  return { channels, epg, lastUpdated: new Date().toISOString() };
});