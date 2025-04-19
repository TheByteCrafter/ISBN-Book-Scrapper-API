const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const { isbn } = req.query;  // Extract the ISBN from the query string

  // Ensure ISBN is provided
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  const fetchTextBookCenter = async () => {
    try {
      const response = await axios.get(`https://www.textbookcenter.com/search/?q=${isbn}`);
      const $ = cheerio.load(response.data);
      const title = $('.product-title').first().text().trim();
      const authors = $('.product-author').first().text().trim();

      if (title && authors) {
        return {
          title,
          authors: authors.split(',').map(a => a.trim()),
          source: 'Text Book Center',
        };
      } else {
        console.error("No title or authors found for ISBN:", isbn);
        return null;
      }
    } catch (err) {
      console.error("Error fetching data from Textbook Center:", err.message);
      return null;
    }
  };

  try {
    const result = await fetchTextBookCenter();

    if (result) {
      res.status(200).json(result);  // Send back the book data if found
    } else {
      res.status(400).json({ message: "Book not found" });  // Send error if not found
    }
  } catch (err) {
    console.error("Error handling the request:", err.message);
    res.status(500).json({ message: "A server error occurred" });
  }
};


