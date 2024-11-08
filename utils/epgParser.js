import { DOMParser } from 'xmldom';

export function parseEPG(data) {
  try {
    console.info('Parsing EPG');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const programs = [];

    const programElements = xmlDoc.getElementsByTagName("programme");
    console.info('Programs:', programElements.length);
    const now = new Date();

    for (let i = 0; i < programElements.length; i++) {
      const program = programElements[i];
      const start = program.getAttribute("start");
      const stop = program.getAttribute("stop");
      const stopDate = parseEPGDate(stop);

      // Ignore programs that have already ended
      if (stopDate < now) {
        continue;
      }

      programs.push({
        start: start,
        stop: stop,
        channel: program.getAttribute("channel"),
        title: program.getElementsByTagName("title")[0].textContent,
        description: program.getElementsByTagName("desc")[0]?.textContent || ""
      });
    }

    // Sort programs by start date and time
    programs.sort((a, b) => new Date(a.start) - new Date(b.start));

    console.info('Parsing EPG successful');
    return programs;
  } catch (error) {
    console.error('Error parsing EPG:', error);
    throw new Error('Failed to parse EPG data');
  }
}

function parseEPGDate(dateString) {
  // Parse the EPG date string (format: "yyyyMMddHHmmss Z")
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript Date
  const day = parseInt(dateString.substring(6, 8), 10);
  const hour = parseInt(dateString.substring(8, 10), 10);
  const minute = parseInt(dateString.substring(10, 12), 10);
  const second = parseInt(dateString.substring(12, 14), 10);
  const timezone = dateString.substring(15); // Timezone offset

  return new Date(Date.UTC(year, month, day, hour, minute, second));
}