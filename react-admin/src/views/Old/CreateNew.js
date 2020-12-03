import React, {useState} from 'react';
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import NavigationNavbarComponent from "../components/navigation/Navbar";
import { Dots } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import axios from 'axios';
import cookie from 'react-cookies';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import fr from '@ckeditor/ckeditor5-build-classic/build/translations/fr';

export default class CreateNewView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            caract: {
                title: 75,
                description: 110
            },
            title: '',
            description: '',
            category: 'multiplayer',
            content: '',
            image: [],
            imageValue: '',
            loading: false,
            publish: false,
            message: null,
            error_type: null,
            config_editor: {
                language: "fr",
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.redirectAfterCreate = this.redirectAfterCreate.bind(this);

    }

    redirectAfterCreate(){
        this.props.history.push('/news/manage')
    }

    handleModelChange(event) {
        this.setState({
            content: event
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleChangeImage(e) {
        this.setState({image:e.target.files[0], imageValue: e.target.value});
    }

    handlePublish = (event) => {
        this.setState({loading: true})
        event.preventDefault();
        const data = new FormData();
        data.append('token', cookie.load('token'))
        data.append('image', this.state.image);
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        data.append('content', this.state.content);
        data.append('category', this.state.category);
        // '/files' is your node.js route that triggers our middleware
        axios.post('https://api.mwactu.fr/v1/panel/news/create', data).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                    title: '',
                    description: '',
                    image: '',
                    imageValue: '',
                    content: ''
                });
                setTimeout(this.redirectAfterCreate, 1000);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    componentDidMount(){
        document.title = "Créer une actualité"
    }

    render() {
        return(
            <div>
                <NavigationNavbarComponent/>
                <Container>
                    <div style={{fontSize: 23, fontWeight: '500', marginBottom: 15}}>
                        Créer une actualité
                    </div>
                    {this.state.publish &&
                        <Alert variant={this.state.error_type == 'error' ? 'danger' : 'success'}>{this.state.message}</Alert>
                    }
                    <form onSubmit={this.handlePublish}>
                        <Form.Group controlId="title">
                            <Form.Label>Titre</Form.Label>
                            <Form.Control disabled={this.state.loading ? true : false} maxLength="75" name="title" type="text" placeholder="Titre" value={this.state.title} onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                                {this.state.caract.title - this.state.title.length}
                                {(this.state.caract.title - this.state.title.length) > 1 ? (
                                    <span> caractères</span>
                                ) : (
                                    <span> caractère</span>
                                )}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control disabled={this.state.loading ? true : false} maxLength="110" name="description" type="text" placeholder="Description"  value={this.state.description} onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                                {this.state.caract.description - this.state.description.length}
                                {(this.state.caract.description - this.state.description.length) > 1 ? (
                                    <span> caractères</span>
                                ) : (
                                    <span> caractère</span>
                                )}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="category">
                            <Form.Label>Catégorie</Form.Label>
                            <Form.Control disabled={this.state.loading ? true : false} name="category" as="select" onChange={this.handleChange}>
                                <option value="multiplayer">Multijoueur</option>
                                <option value="coop">Coop</option>
                                <option value="campaign">Campagne</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control value={this.state.imageValue} disabled={this.state.loading ? true : false} name="image[]" onChange={this.handleChangeImage} type="file"/>
                            <Form.Text className="text-muted">
                                Utilisez une image 1080x1920 ou 1920x1080
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="content">
                            <Form.Label>Contenu</Form.Label>
                            <CKEditor
                                editor={ ClassicEditor }
                                data={this.state.content}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    this.handleModelChange(data)
                                } }
                            />

                        </Form.Group>

                        <Button disabled={this.state.loading ? true : false} variant="primary" type="submit">
                            {this.state.loading ? (
                                <Dots color="#fff"/>
                            ) : (
                                <span>Publier</span>
                            )}
                        </Button>
                    </form>
                </Container>
            </div>
        )
    }
}
