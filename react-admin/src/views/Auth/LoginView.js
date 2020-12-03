import React from 'react';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { LoginData } from '../../actions/login';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mwaction.app">
          MW Action
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  });

class AuthLoginView extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: '',
            submitted: false,
            login_message: '',
            login_status: null,
            login_success: false,
            dialog: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        const {email, password} = this.state;
        if (email && password) {
            LoginData(email, password).then((result) => {
                let responseJson = result;
                if(responseJson['status'] === 'success') {
                    this.props.history.push("/");
                } else {
                    this.setState({login_message: responseJson['response']});
                    this.setState({login_status: 'alert alert-danger'})
                }

            }).catch((error) => {
                this.setState({login_message: error['response']});
                this.setState({login_status: 'alert alert-danger'})
            });
        } else {
            this.setState({login_message: null})
        }
    }

    render() {
        const { email, password, submitted, login_message } = this.state;
        const { classes } = this.props;
        return(
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Connexion à l'administration
                    </Typography>
                    {login_message && submitted &&
                        <div style={{width: '100%', marginBottom: 0, marginTop: 7}} className={this.state.login_status}>{this.state.login_message}</div>
                    }
                    <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                        {submitted && !email ? (
                            <TextField
                                error
                                helperText="Veuillez enter une adresse email"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="E-mail"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={this.handleChange}
                            />
                        ) : (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="E-mail"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={this.handleChange}
                            />
                        )}
                        
                        {submitted && !password ? (
                            <TextField
                                error
                                helperText="Veuillez enter un mot de passe"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Mot de passe"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={this.handleChange}
                            />
                        ) : (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Mot de passe"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={this.handleChange}
                            />
                        )}
                        <Button
                            disabled={email && password ? false : true}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{outline: 'none'}}
                            className={classes.submit}
                        >
                            Se connecter
                        </Button>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        )
    }
}

export default withRouter(withStyles(useStyles)(AuthLoginView))
