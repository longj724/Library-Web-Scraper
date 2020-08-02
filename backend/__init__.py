from flask import Flask, request, render_template, url_for, jsonify, g
import sqlite3
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import my_books
    my_books.init_app(app)

    @app.route('/search-book', methods=['POST'])
    def search_for_book():
        if request.method == 'POST':
            if request.form['title']:
                books = check_availability_two(request.form['title'])
                return jsonify({'books': books})

    @app.route('/my-books', methods=['GET'])
    def my_books():

        from backend.my_books import get_db
        db = get_db()

        book_rows = db.execute('SELECT * FROM books').fetchall()

        books = []
        for num, book in enumerate(book_rows, start=0):
            books.append({'title': book_rows[num][1], 'author': book_rows[num][2], 'status': book_rows[num][3], 
            'type': book_rows[num][4]})
        
        return jsonify(books)

    @app.route('/add-book', methods=['POST'])
    def add_book():

        from backend.my_books import get_db

        try:
            db = get_db()

            book = request.get_json()

            db.execute('INSERT INTO books (title, author, kind, available) VALUES (:title, :author, :kind, :available)', book)

            db.commit()
            msg = 'Book added'
        except Exception as ex:
            print(ex)
            db.rollback()
            msg = 'Error in insert operation'
        finally:
            return msg

    return app

def check_availability_two(title):

    PATH = '/Users/justinlong/Documents/chromedriver'
    options = webdriver.ChromeOptions()
    options.add_argument('--incognito')
    options.add_argument('--headless')
    options.add_argument('--disable-extensions')
    options.add_argument('start-maximized')
    options.add_argument('disable-infobars')
    driver = webdriver.Chrome(chrome_options=options, executable_path=PATH)

    formatted_title = title.replace(' ', '+')
    formatted_title = title.replace('\'', '%27')

    driver.get('https://ccpl.overdrive.com/search?query=' + formatted_title)

    statuses = 'statuses not found'
    titles = 'titles not found'
    book_list = {}

    try :
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'title-header-bar'))
        )
        statuses = driver.find_elements_by_class_name('title-header-bar')
        titles = driver.find_elements_by_class_name('title-name')
    finally:
        for status, title in zip(statuses, titles):
            book_list[title.text] = status.text

        driver.quit()

        return book_list