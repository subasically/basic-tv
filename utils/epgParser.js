import { DOMParser } from 'xmldom';

export function parseEPG(data) {
  try {
    console.info('Parsing EPG');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const programs = [];

    const programElements = xmlDoc.getElementsByTagName("programme");
    console.info('Programs:', programElements.length);
    for (let i = 0; i < programElements.length; i++) {
      const program = programElements[i];
      programs.push({
        start: program.getAttribute("start"),
        stop: program.getAttribute("stop"),
        channel: program.getAttribute("channel"),
        title: program.getElementsByTagName("title")[0].textContent,
        description: program.getElementsByTagName("desc")[0]?.textContent || ""
      });
    }

    console.info('Parsing  epg successful');
    return programs;
  } catch (error) {
    console.error('Error parsing EPG:', error);
    throw new Error('Failed to parse EPG data');
  }
}