import { makeStyles } from '@material-ui/core/styles';

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
        marginTop: '12vh',
        marginLeft: '45vw',
        position: 'absolute',
        backgroundColor: '#FEC524',
        width: '10vw',
    },
}));

export default useStyles