export function parseM3U(data) {
  console.info('Parsing M3U playlist');
  try {
    const lines = data.split('\n');
    const channels = [];

    let currentChannel = {};

    lines.forEach(line => {
      if (line.startsWith('#EXTINF')) {
        const name = line.split(',')[1];
        const logo = line.match(/tvg-logo="([^"]*)"/);
        const group = line.match(/group-title="([^"]*)"/);
        const chno = line.match(/tvg-chno="([^"]*)"/);
        const channelId = line.match(/tvg-id="([^"]*)"/);

        currentChannel.name = name.trim();
        currentChannel.logo = logo ? logo[1] : '';
        currentChannel.group = group ? group[1] : '';
        currentChannel.chno = chno ? parseInt(chno[1], 10) : null;
        currentChannel.channelId = channelId ? channelId[1] : '';
      } else if (line && !line.startsWith('#')) {
        currentChannel.url = line.trim();
        channels.push(currentChannel);
        currentChannel = {};
      }
    });

    console.info('Parsing playlist successful');
    return channels;
  } catch (error) {
    console.error('Error parsing M3U playlist:', error);
    throw new Error('Failed to parse M3U data');
  }
}