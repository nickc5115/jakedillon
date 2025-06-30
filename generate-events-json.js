const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const eventsDir = path.join(__dirname, 'events');
const outputFile = path.join(__dirname, 'events.json');

function formatDateTime(isoString) {
  if (!isoString) return { date: '', time: '' };
  const dateObj = new Date(isoString);
  if (isNaN(dateObj)) return { date: isoString, time: '' };
  const date = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const time = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });
  return { date, time };
}

const events = [];

fs.readdirSync(eventsDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);
    const { date, time } = formatDateTime(data.date);
    events.push({
      title: data.title || '',
      date,
      time: data.time_range || time,
      location: data.location || '',
      link: data.link || '',
      description: body.trim(),
      filename: file
    });
  }
});

events.sort((a, b) => new Date(a.date) - new Date(b.date));

fs.writeFileSync(outputFile, JSON.stringify(events, null, 2));
console.log(`Generated ${outputFile} with ${events.length} events.`); 