from requests_html import HTMLSession
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def check_availability(title):
    formatted_title = title.replace(' ', '+')
    formatted_title = title.replace('\'', '%27')

    session = HTMLSession()
    r = session.get('https://ccpl.overdrive.com/search?query=' + formatted_title)
    r.html.render()

    statuses = r.html.find('.title-header-bar')
    titles = r.html.find('.title-name')

    book_list = {}

    for status, title in zip(statuses, titles):
        book_list[title.text] = status.text
    
    return book_list

def check_availability_two(title):

    PATH = '/Users/justinlong/Documents/chromedriver'
    options = webdriver.ChromeOptions()
    options.add_argument('--incognito')
    # options.add_argument('--headless')
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

        for book in book_list:
            print(book + ': ' + book_list[book])

        driver.quit()

        return book_list

check_availability_two('Sapiens')