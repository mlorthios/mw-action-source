import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import { LoginData } from '../actions/login';

class LoginView extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            username: '',
            password: '',
            submitted: false,
            login_message: '',
            login_status: null,
            login_success: false
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
        const {username, password} = this.state;
        if (username && password) {
            LoginData(username, password).then((result) => {
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
        const { username, password, submitted, login_message } = this.state;
        return(
            <div style={{marginTop: 35}}>
                <Container>
                    <Row>
                        <Col sm={6}>
                            <div style={{fontSize: 23, fontWeight: '500', marginBottom: 15}}>
                                Connexion à MW Actu
                            </div>
                            {login_message && submitted &&
                            <div className={this.state.login_status}>{this.state.login_message}</div>
                            }

                            <form name="form" onSubmit={this.handleSubmit}>
                                <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                                    <label htmlFor="username">Nom d'utilisateur</label>
                                    <input type="text" className="form-control" name="username" value={username}
                                           onChange={this.handleChange}/>
                                    {submitted && !username &&
                                    <div className="help-block">Veuillez entrer un nom d'utilisateur</div>
                                    }
                                </div>
                                <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                                    <label htmlFor="password">Mot de passe</label>
                                    <input type="password" className="form-control" name="password" value={password}
                                           onChange={this.handleChange}/>
                                    {submitted && !password &&
                                    <div className="help-block">Veuillez entrer un mot de passe</div>
                                    }
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary">Se connecter</button>
                                    <Link to="/user/register" className="btn btn-link">Register</Link>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withRouter(LoginView)
