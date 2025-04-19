from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/book', methods=['GET'])
def get_book_data():
    # Get the ISBN from the query parameters
    isbn = request.args.get('isbn')
    if not isbn:
        return jsonify({'message': 'ISBN is required'}), 400

    try:
        # Define the URL for the textbook website
        url = f"https://www.textbookcenter.com/search/?q={isbn}"
        
        # Fetch the page content
        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({'message': 'Failed to fetch data from external source'}), 500
        
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.select_one('.product-title')
        authors = soup.select_one('.product-author')

        if not title or not authors:
            return jsonify({'message': 'Book not found'}), 404

        # Extract the text and clean it
        title_text = title.text.strip()
        authors_text = authors.text.strip()

        # Return the book data as JSON
        return jsonify({
            'title': title_text,
            'authors': [a.strip() for a in authors_text.split(',')],
            'source': 'Text Book Center'
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
