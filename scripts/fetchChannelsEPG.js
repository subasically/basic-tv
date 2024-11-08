import axios from 'axios';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';

const REGION_ALL = 'all';

const PLAYLIST_PATH = 'public/playlist.m3u8';
const EPG_PATH = 'public/epg.xml';
const APP_URL = 'https://i.mjh.nz/SamsungTVPlus/.channels.json';
const EPG_URL = `https://i.mjh.nz/SamsungTVPlus/${REGION_ALL}.xml.gz`;
const PLAYBACK_URL = 'https://jmp2.uk/sam-{id}.m3u8';

function logger(message, ...args) {
  if (args.length) {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
    return;
  } else {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

function deleteFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger(`Deleted file: ${filePath}`);
    }
  } catch (err) {
    logger(`Error deleting file: ${filePath}`, err);
  }
}

async function generatePlaylist(params) {
  const allChannels = (await axios.get(APP_URL)).data.regions;

  logger(`Generating playlist from ${APP_URL}`);
  logger('Regions:', params.regions || process.env.TV_REGIONS || REGION_ALL);
  logger('Groups:', params.groups || process.env.GROUPS || '');
  logger('Number of channels found:', Object.keys(allChannels).reduce((acc, region) => acc + Object.keys(allChannels[region].channels).length, 0));

  const regions = (params.regions || process.env.TV_REGIONS || REGION_ALL)
    .split(',')
    .map(region => region.trim().toLowerCase())
    .filter(region => region);

  const groups = (params.groups || process.env.GROUPS || '')
    .split(',')
    .map(group => decodeURIComponent(group).toLowerCase())
    .filter(group => group);

  const startChno = params.start_chno ? parseInt(params.start_chno, 10) : null;
  const sort = params.sort || 'chno';
  const include = (params.include || '').split(',').filter(x => x);
  const exclude = (params.exclude || '').split(',').filter(x => x);

  let channels = {};
  regions.forEach(region => {
    if (allChannels[region]) {
      Object.assign(channels, allChannels[region].channels);
    }
  });

  const playlistContent = ['#EXTM3U'];
  Object.keys(channels)
    .sort((a, b) => (sort === 'chno' ? channels[a].chno - channels[b].chno : channels[a].name.trim().toLowerCase().localeCompare(channels[b].name.trim().toLowerCase())))
    .forEach(key => {
      const channel = channels[key];
      const logo = channel.logo;
      const group = channel.group;
      const name = channel.name;
      const url = PLAYBACK_URL.replace('{id}', key);
      const channelId = `samsung-${key}`;

      if (channel.license_url) return;

      if ((include.length && !include.includes(channelId)) || (exclude.length && exclude.includes(channelId))) {
        logger(`Skipping ${channelId} due to include / exclude`);
        return;
      }

      if (groups.length && !groups.includes(group.toLowerCase())) {
        logger(`Skipping ${channelId} due to group filter`);
        return;
      }

      let chno = '';
      if (startChno !== null) {
        if (startChno > 0) {
          chno = ` tvg-chno="${startChno}"`;
          startChno++;
        }
      } else if (channel.chno !== null) {
        chno = ` tvg-chno="${channel.chno}"`;
      }

      playlistContent.push(`#EXTINF:-1 channel-id="${channelId}" tvg-id="${key}" tvg-logo="${logo}" group-title="${group}"${chno},${name}\n${url}`);
    });

  // Ensure the public directory exists
  const publicDir = path.dirname(PLAYLIST_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Delete the existing playlist file if it exists
  deleteFileIfExists(PLAYLIST_PATH);

  fs.writeFileSync(PLAYLIST_PATH, playlistContent.join('\n'), 'utf8');
  logger('Playlist saved.');
}

async function generateEPG() {
  const response = await axios.get(EPG_URL, { responseType: 'stream' });

  const gunzip = zlib.createGunzip();
  const writeStream = fs.createWriteStream(EPG_PATH);

  response.data.pipe(gunzip).pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      logger('EPG saved.');
      resolve();
    });

    writeStream.on('error', (err) => {
      logger('Error saving EPG:', err);
      reject(err);
    });
  });
}

export async function main(params) {
  logger('Params:', params);

  await generatePlaylist(params);
  await generateEPG();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const params = {
    regions: process.argv[2] || '',
    groups: process.argv[3] || '',
    start_chno: process.argv[4] || '',
    sort: process.argv[5] || 'chno',
    include: process.argv[6] || '',
    exclude: process.argv[7] || ''
  };

  main(params).catch(err => {
    console.error('Error:', err);
    exit(1);
  });
}