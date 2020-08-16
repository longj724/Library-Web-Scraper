import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import axios from 'axios';
import useStyles from '../CSS/styles';

function App() {
    const classes = useStyles();

    const [book, setBook] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [myBooks, setMyBooks] = useState([]);

    const handleChange = (event) => {
        setBook(event.target.value);
    };

    const handleSubmit = () => {
        setMyBooks([]);
        axios
            .post('/search-book', { book: book })
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                data.length !== 0
                    ? setSearchResults(data)
                    : setSearchResults([0]);
            });
    };

    const addBook = (e) => {
        const bookIndex = parseInt(e.currentTarget.value);
        console.log('Add book value is', e.currentTarget.value)
        axios
            .post('/add-book', { book: searchResults[bookIndex] })
            .then((res) => {
                if (res.data === 'Error in insert operation') {
                    window.alert('Error: Book not added')
                } else {
                    console.log(res)
                }
            });
    };

    const deleteBook = (e) => {
        const bookIndex = parseInt(e.currentTarget.value);
        console.log(e.currentTarget.value)
        console.log(bookIndex)
        axios
            .delete(
                '/delete-book/' +
                    myBooks[bookIndex]['title'] +
                    '/' +
                    myBooks[bookIndex]['author']
            )
            .then((res) => {
                if (res.data === 'Error in deletion operation') {
                    window.alert('Error: Book Not Deleted')
                } else {
                    const newBooks = myBooks.filter((book) => {
                        return book['title'] !== myBooks[bookIndex]['title']
                    })
                    setMyBooks(newBooks)
                }
            });
    };

    const getMyBooks = () => {
        setSearchResults([]);
        axios
            .get('/my-books')
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                data.length !== 0 ? setMyBooks(data) : setMyBooks([0]);
            });
    };

    return (
        <div className={classes.root}>
            <Button
                variant="contained"
                className={classes.myBook}
                onClick={() => getMyBooks()}
            >
                My Books
            </Button>
            <form className={classes.form}>
                <TextField
                    label="Search Library for Book"
                    variant="filled"
                    className={classes.textField}
                    onChange={(e) => handleChange(e)}
                />
                <IconButton
                    className={classes.searchIconButton}
                    onClick={() => handleSubmit()}
                >
                    <SearchIcon className={classes.searchIcon} />
                </IconButton>
            </form>
            <div className={classes.bookDiv}>
                {searchResults[0] !== 0 ? (
                    searchResults.map((book, index) => {
                        return (
                            <div key={index}>
                                <li className={classes.listElement}>
                                    {book[0] +
                                        ' ' +
                                        book[1] +
                                        ' ' +
                                        book[2] +
                                        ', Status: ' +
                                        book[3]}
                                </li>
                                <IconButton
                                    value={index.toString()}
                                    className={classes.searchIconButton}
                                    onClick={addBook}
                                >
                                    <AddIcon className={classes.addIcon} />
                                </IconButton>
                            </div>
                        );
                    })
                ) : (
                    <li className={classes.listElement}>No books found</li>
                )}
                {myBooks[0] !== 0 ? (
                    myBooks.map((book, index) => {
                        return (
                            <div key={index}>
                                <li className={classes.listElement}>
                                    {book['title'] +
                                        ' ' +
                                        book['author'] +
                                        ' ' +
                                        book['type'] +
                                        ', Status: ' +
                                        book['status']}
                                </li>
                                <IconButton
                                    value={index.toString()}
                                    className={classes.searchIconButton}
                                    onClick={deleteBook}
                                >
                                    <RemoveIcon className={classes.addIcon} />
                                </IconButton>
                            </div>
                        );
                    })
                ) : (
                    <li className={classes.listElement}>
                        You have no books saved
                    </li>
                )}
            </div>
        </div>
    );
}

export default App;
