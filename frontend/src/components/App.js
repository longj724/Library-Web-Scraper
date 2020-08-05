import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#1D428A',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflowY: 'auto',
    },
    form: {
        position: 'absolute',
        marginTop: '20vh',
        marginLeft: '40vw',
    },
    textField: {
        backgroundColor: '#fff',
        width: '20vw',
        borderRadius: '10px',
        color: 'black',
    },
    searchIconButton: {
        color: '#000',
        backgroundColor: '#fff',
        '&:hover': {
            backgroundColor: '#FEC524',
        },
        marginLeft: '10px',
    },
    searchIcon: {
        fontSize: 30,
    },
    bookDiv: {
        width: '20vw',
        height: '70vh',
        marginTop: '30vh',
        marginLeft: '40vw',
        position: 'absolute',
    },
    listElement: {
        color: '#fff',
        marginBottom: '1vh',
        marginTop: '1vh',
    },
    addIcon: {
        fontSize: 10,
    },
    addIconButton: {
        color: '#000',
        backgroundColor: '#fff',
        '&:hover': {
            backgroundColor: '#FEC524',
        },
        marginLeft: '10px',
        display: 'inline',
        marginBottom: '1vh',
    },
    myBook: {
        marginTop: '120px',
        marginLeft: '45vw',
        position: 'absolute',
        backgroundColor: '#FEC524',
        width: '10vw',
    },
}));

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

    const addBook = (event) => {
        let bookIndex = parseInt(event.target.value);
        axios
            .post('/add-book', { book: searchResults[bookIndex] })
            .then((res) => {
                console.log(res);
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
                data.length !== 0
                    ? setMyBooks(data)
                    : setMyBooks([0]);
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
                                    onClick={(e) => addBook(e)}
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
