const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const eventsDir = path.join(__dirname, 'events');
const outputFile = path.join(__dirname, 'events.json');

const events = [];

fs.readdirSync(eventsDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);
    events.push({
      title: data.title || '',
      date: data.date || '',
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