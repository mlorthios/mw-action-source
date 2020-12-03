import React from 'react';
import {Container, Row, Col, Form, Button, Alert} from "react-bootstrap";
import { useParams, withRouter, Link } from 'react-router-dom';
import NavigationNavbarComponent from "../components/Navigation/Navbar";
import cookie from "react-cookies";
import axios from "axios";

class DeleteNewView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            loading_new: false,
            loading: false,
            publish: false,
            message: '',
            error_type: '',
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.redirectAfterDelete = this.redirectAfterDelete.bind(this);
    }

    loadNew() {
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        axios.get('https://api.mwactu.fr/v1/news/?id='+id).then((response) => {
            if(response.data != 0) {
                this.setState({
                    title: response.data[0].title,
                    loading_new: true

                });
            } else {
                this.redirectAfterDelete()
            }
        });
    }

    componentDidMount(){
        document.title = "Suppression de l'actualité : 1"
        this.loadNew();
    }

    redirectAfterDelete(){
        this.props.history.push('/news/manage')
    }

    handleDelete(e) {
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        this.setState({loading: true})
        e.preventDefault();
        const data = new FormData();
        data.append('token', cookie.load('token'));
        data.append('id', id)
        // '/files' is your node.js route that triggers our middleware
        axios.post('https://api.mwactu.fr/v1/panel/news/delete', data).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                });
                setTimeout(this.redirectAfterDelete, 1000)
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    render() {
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        return(
            <div>
                <NavigationNavbarComponent/>
                <Container>
                    {this.state.loading_new ? (
                        <div>
                            <div style={{fontSize: 23, fontWeight: '500', marginBottom: 15}}>
                                Suppression de l'actualité : {this.state.title}
                            </div>
                            <div>
                                {this.state.publish &&
                                <Alert variant={this.state.error_type == 'error' ? 'danger' : 'success'}>{this.state.message}</Alert>
                                }
                                <Button onClick={this.handleDelete} disabled={this.state.loading ? true : false} variant="danger">Valider la suppression</Button>
                            </div>
                        </div>
                    ) : (
                        <div>Chargement</div>
                    )}
                </Container>
            </div>
        )
    }
}

export default withRouter(DeleteNewView)
