from flask import Flask, request, render_template, url_for
from search_library import check_availability
app = Flask(__name__)

@app.route('/check-book', methods=['POST', 'GET'])
def find_book():
    if request.method == 'POST':
        if request.form['title']:
            print(check_availability(request.form['title']))
            return render_template('result.html')
        else:
            return 'Invalid book title'
    

@app.route('/')
def home():
    return render_template('index.html')

if (__name__ == '__main__'):
    app.run(debug=True)