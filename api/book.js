const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
    const { isbn } = req.query; // Correctly getting isbn from query

    const fetchTextBookCenter = async () => {
        try {
            // Use backticks for template literals
            const response = await axios.get(`https://www.textbookcenter.com/search/?q=${isbn}`);

            const $ = cheerio.load(response.data);
            const title = $('.product-title').first().text().trim();
            const authors = $('.product-author').first().text().trim();

            if (title && authors) {
                return {
                    title,
                    authors: authors.split(',').map(a => a.trim()),
                    source: 'Text Book Center'
                };
            }
        } catch (err) {
            console.error("Tbc error:", err.message);
        }
        return null;
    };

    const sources = [
        fetchTextBookCenter()
        // More scraping sources here
    ];

    const results = await Promise.all(sources);
    const book = results.find(b => b !== null);

    if (book) {
        res.status(200).json(book); // Send book data as JSON
    } else {
        res.status(400).json({ message: "Book not found" }); // Handle if no book data found
    }
};

