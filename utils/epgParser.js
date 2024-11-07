export function parseEPG(data) {
  // Implement your EPG parsing logic here
  // This is a placeholder example
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "application/xml");
  const programs = [];

  const programElements = xmlDoc.getElementsByTagName("programme");
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

  return programs;
}