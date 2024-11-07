import axios from 'axios';
import { parseM3U } from '~/utils/m3uParser';
import { parseEPG } from '~/utils/epgParser'; // Assuming you have a parser for EPG data

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const country = query.country || 'US';
  let playlistUrl;

  switch (country) {
    case 'US':
      playlistUrl = useRuntimeConfig().public.USPlaylist;
      break;
    case 'UK':
      playlistUrl = useRuntimeConfig().public.UKPlaylist;
      break;
    case 'CA':
      playlistUrl = useRuntimeConfig().public.CAPlaylist;
      break;
    default:
      playlistUrl = useRuntimeConfig().public.USPlaylist;
  }

  if (!playlistUrl) {
    throw createError({ statusCode: 500, statusMessage: 'PLAYLIST_URL is not defined' });
  }

  try {
    const [playlistResponse, epgResponse] = await Promise.all([
      axios.get(playlistUrl),
      axios.get(useRuntimeConfig().public.EPGUrl)
    ]);

    const channels = parseM3U(playlistResponse.data);
    const epg = parseEPG(epgResponse.data);

    return { channels, epg };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load playlist or EPG' });
  }
});