import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#1D428A',
        width: '100vw',
        height: '100vh',
        position: 'relative',
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
      position: 'absolute'
    }
}));

function App() {
    const classes = useStyles();

    const [book, setBook] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event) => {
        setBook(event.target.value);
    };

    const handleSubmit = () => {
        axios
            .post('/search-book', { book: book })
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                setSearchResults(data);
                console.log(data);
            });
    };

    return (
        <div className={classes.root}>
            <form className={classes.form}>
                <TextField
                    label="Book"
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
                {searchResults.map((book) => {
                    return (
                        <li style={{ color: '#fff'}}>
                            {book[0] +
                                ' ' +
                                book[1] +
                                ' ' +
                                book[2] +
                                ', Status: ' +
                                book[3]}
                        </li>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
