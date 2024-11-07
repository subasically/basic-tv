export function parseM3U(data) {
  console.info('Parsing M3U playlist');
  try {
    const lines = data.split('\n');
    const channels = [];

    let currentChannel = {};

    lines.forEach(line => {
      if (line.startsWith('#EXTINF')) {
        const info = line.split(',')[1];
        currentChannel.name = info.trim();
      } else if (line && !line.startsWith('#')) {
        currentChannel.url = line.trim();
        channels.push(currentChannel);
        currentChannel = {};
      }
    });

    console.info('Parsing successful');
    return channels;
  } catch (error) {
    console.error('Error parsing M3U playlist:', error);
    throw new Error('Failed to parse M3U data');
  }
}