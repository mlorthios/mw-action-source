import React from 'react';
import {Container, Row, Col, Form, Button, Alert} from "react-bootstrap";
import { useParams } from 'react-router-dom';
import NavigationNavbarComponent from "../components/Navigation/Navbar";
import axios from "axios";
import {Dots} from "react-activity";
import cookie from "react-cookies";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import fr from '@ckeditor/ckeditor5-build-classic/build/translations/fr';

export default class EditNewView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            caract: {
                title: 75,
                description: 110
            },
            title: '',
            description: '',
            category: '',
            content: '',
            image: [],
            imageValue: '',
            loading: false,
            publish: false,
            message: null,
            error_type: null,
            loading_new: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.redirectAfterEdit = this.redirectAfterEdit.bind(this);
    }

    redirectAfterEdit() {
        this.props.history.push('/news/manage');
    }

    loadNew() {
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        axios.get('https://api.mwactu.fr/v1/news/?id='+id).then((response) => {
            this.setState({
                title: response.data[0].title,
                description: response.data[0].description,
                category: response.data[0].category_id,
                content: response.data[0].content,
                loading_new: true

            });
        });
    }

    componentDidMount(){
        document.title = "Modification de l'actualité : 1"
        this.loadNew();
    }

    handleModelChange(model) {
        this.setState({
            content: model
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
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        this.setState({loading: true})
        event.preventDefault();
        const data = new FormData();
        data.append('token', cookie.load('token'));
        data.append('id', id)
        data.append('image', this.state.image);
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        data.append('content', this.state.content);
        data.append('category', this.state.category);
        // '/files' is your node.js route that triggers our middleware
        axios.post('https://api.mwactu.fr/v1/panel/news/edit', data).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                });

                setTimeout(this.redirectAfterEdit, 1000);
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
                    <div style={{fontSize: 23, fontWeight: '500', marginBottom: 15}}>
                        Modification de l'actualité : #{id}
                    </div>
                    {this.state.loading_new ? (

                        <form onSubmit={this.handlePublish}>
                            {this.state.publish &&
                                <Alert variant={this.state.error_type == 'error' ? 'danger' : 'success'}>{this.state.message}</Alert>
                            }
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
                                    <option value="1">Multijoueur</option>
                                    <option value="2">Coop</option>
                                    <option value="3">Campagne</option>
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
                    ) : (
                        <div>Chargement ...</div>
                    )}
                </Container>
            </div>
        )
    }
}
