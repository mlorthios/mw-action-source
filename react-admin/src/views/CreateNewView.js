import React, {useState} from 'react';
import NavigationNavbarComponent from "../components/Navigation/Navbar";
import ReactTimeAgo from 'react-time-ago'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import { Dots } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import axios from 'axios';
import cookie from 'react-cookies';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import fr from '@ckeditor/ckeditor5-build-classic/build/translations/fr';

const useStyles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    activeTabOne: {
        backgroundColor: 'yellow'
    },
    activeTabTwo: {
        backgroundColor: 'yellow'
    }
});

class CreateNewView extends React.Component {
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
            },
            tab: 1
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

    a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    render() {
        const { tab } = this.state;
        const { classes } = this.props;
        return(
            <div className={classes.root}>
                <NavigationNavbarComponent/>
                <main className={classes.content}>
                    <div style={{minHeight: 45}}/>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                        <Tabs value={tab} onChange={this.handleChangeTab} aria-label="simple tabs example">
                            <Tab style={{outline: 'none', textDecoration: 'none'}} component={Link} to="/news/manage" label="Gérer" />
                            <Tab style={{outline: 'none', textDecoration: 'none'}} component={Link} to="/news/create" label="Créer" />
                        </Tabs>
                        </Grid>
                    </Grid>
                </main>
            </div>
        )
    }
}

export default withStyles(useStyles)(CreateNewView);