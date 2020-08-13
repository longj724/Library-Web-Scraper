from flask import Flask, request, render_template, url_for, jsonify, g
import sqlite3
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from twilio.rest import Client
from apscheduler.schedulers.background import BackgroundScheduler

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
            title = request.get_json()
            books = search_library(title['book'])
            
            book_dict = {}
            for i in range(len(books)):
                book_dict[i] = books[i]
            
            return jsonify(books)

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

            db.execute('INSERT INTO books (title, author, kind, available) VALUES (:title, :author, :kind, :available)', book['book'])

            db.commit()
            msg = 'Book added'
        except Exception as ex:
            print(ex)
            db.rollback()
            msg = 'Error in insert operation'
        finally:
            return msg

    def get_statuses():
        PATH = '/Users/justinlong/Documents/chromedriver'
        options = webdriver.ChromeOptions()
        options.add_argument('--incognito')
        options.add_argument('--headless')
        options.add_argument('--disable-extensions')
        options.add_argument('start-maximized')
        options.add_argument('disable-infobars')
        driver = webdriver.Chrome(chrome_options=options, executable_path=PATH)

        from backend.my_books import get_db
        db = get_db()

        try:
            db_titles = db.execute('SELECT * from books').fetchall()
        except Exception as ex: 
            print(ex)

        statuses = []
        titles = []
        authors = []
        versions = []

        for book in db_titles:
            driver.get('https://ccpl.overdrive.com/search?query=' + book[1])

            element = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'title-header-bar'))
            )
            statuses = driver.find_elements_by_class_name('title-header-bar')
            titles = driver.find_elements_by_class_name('title-name')
            authors = driver.find_elements_by_class_name('title-author')
            versions = driver.find_elements_by_class_name('title-format-badge')

            for i in range(len(titles)):
                if titles[i].text == book[1] and authors[i].text == book[2] and versions[i].text == book[3]:
                    if statuses[i].text != book[4]:
                        db.execute('UPDATE books SET available=? WHERE title=?', (statuses[i].text, book[1]))
                        db.commit()
            
            driver.quit()
    
    with app.app_context():
        # get_statuses()
        sched = BackgroundScheduler(daemon=True)
        sched.add_job(lambda: print('working'), 'cron', day_of_week='mon,wed,fri')
        sched.start()


    return app

def search_library(title):
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

    statuses = []
    titles = []
    authors = []
    versions = []
    book_list = []

    try :
        element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'title-header-bar'))
        )
        statuses = driver.find_elements_by_class_name('title-header-bar')
        titles = driver.find_elements_by_class_name('title-name')
        authors = driver.find_elements_by_class_name('title-author')
        versions = driver.find_elements_by_class_name('title-format-badge')
    finally:
        for i in range(len(titles)):
            book = (titles[i].text, authors[i].text, versions[i].text, statuses[i].text)
            book_list.append(book)

        driver.quit()
        return book_list