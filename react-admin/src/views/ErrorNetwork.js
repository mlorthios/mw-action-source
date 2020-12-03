import React from 'react';
import { Container, Row, Col, Alert } from "react-bootstrap";

export default class ErrorNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doc: null,
            notFound: false,
            posts: [],
        }
    }

    render() {
        return(
            <div>
                <Container>
                    <Alert variant="danger">
                        Une erreur réseau est survenu.
                    </Alert>
                </Container>
            </div>
        )
    }
}
