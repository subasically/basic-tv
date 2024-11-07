export function parseM3U(data) {
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

  return channels;
}