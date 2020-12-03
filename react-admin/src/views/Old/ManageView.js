import React from 'react';
import { Container, Row, Col, Form, Butto, Table } from "react-bootstrap";
import {Link} from "react-router-dom";
import NavigationNavbarComponent from "../components/navigation/Navbar";
import axios from "axios";
import ReactTimeAgo from 'react-time-ago'

export default class ManageNewView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: []
        }
    }

    componentDidMount(){
        document.title = "Gérer les actualités"
        axios.get('https://api.mwactu.fr/v1/news/').then((response) => {
            this.setState({
                news: response.data
            });
        });
    }

    DateConvert(mysql_string)
    {
        var t, result = null;

        if( typeof mysql_string === 'string' )
        {
            t = mysql_string.split(/[- :]/);

            //when t[3], t[4] and t[5] are missing they defaults to zero
            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }

        return result;
    }

    render() {
        const { news } = this.state;
        return(
            <div>
                <NavigationNavbarComponent/>
                <Container>
                    <div style={{fontSize: 23, fontWeight: '500', marginBottom: 15}}>
                        Gérer les actualités
                    </div>
                    {news.length === 0 ? (
                        <div>Chargement</div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th style={{width: '65%'}}>Titre</th>
                                <th>Publié</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {news.map(news =>
                                <tr key={news.id}>
                                    <td>{news.id}</td>
                                    <td>{news.title}</td>
                                    <td><ReactTimeAgo date={this.DateConvert(news.created_at)} locale="fr"/></td>
                                    <td><Link to={{pathname: "/news/manage/edit/"+news.id}}>Modifier</Link> - <Link to={{pathname: "/news/manage/delete/"+news.id}}>Supprimer</Link></td>
                                </tr>
                                )}
                                </tbody>
                                </Table>
                                )}

                </Container>
            </div>
        )
    }
}
