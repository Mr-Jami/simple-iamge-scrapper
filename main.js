const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeImageUrls() {
    const baseUrl = 'https://verloren.de/found?page=';
    const markdownContent = [];

    for (let page = 1; page <= 10; page++) {
        try {
            const { data } = await axios.get(`${baseUrl}${page}&category=keys`);
            const $ = cheerio.load(data);

            $('.np-item__img-bg').each((i, element) => {
                const style = $(element).attr('style');
                const urlMatch = style && style.match(/url\(["']?(.+?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    const imageUrl = `https://verloren.de${urlMatch[1]}`;
                    markdownContent.push(`![Key Image](${imageUrl})`);
                }
            });

        } catch (error) {
            console.error(`Error scraping page ${page}: ${error.message}`);
        }
    }

    // Write the Markdown content to a .md file
    const distinctMarkdownContent = [... new Set(markdownContent)];
    fs.writeFileSync('image_urls.md', distinctMarkdownContent.join('\n'), 'utf8');
    console.log(`Scraped ${markdownContent.length} image URLs and saved to image_urls.md`);
}

scrapeImageUrls();
