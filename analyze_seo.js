const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"/);
    
    // Find FAQs
    const faqRegex = /class="faq-item"[\s\S]*?<h4[^>]*>(.*?)<\/h4>[\s\S]*?<p[^>]*>(.*?)<\/p>/g;
    let md = '';
    let match;
    let faqCount = 0;
    while((match = faqRegex.exec(content)) !== null) {
        faqCount++;
    }

    console.log(`\n--- ${f} ---`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'NONE'}`);
    console.log(`Desc: ${descMatch ? descMatch[1] : 'NONE'}`);
    console.log(`FAQs: ${faqCount}`);
});
