import React from 'react';
import NavigationNavbarComponent from "../components/Navigation/Navbar";
import axios from "axios";
import ReactTimeAgo from 'react-time-ago'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

const useStyles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
});

class ManageNewView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            tab: 0
        }

        this.handleChangeTab = this.handleChangeTab.bind(this);
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

    handleChangeTab(value, newValue) {
        this.setState({tab: newValue});
    }

    a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    render() {
        const { news, tab } = this.state;
        const { classes } = this.props;
        return(
            <div className={classes.root}>
                <NavigationNavbarComponent/>
                <main className={classes.content}>
                    <div style={{minHeight: 45}}/>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                        <Tabs value={tab} onChange={this.handleChangeTab} aria-label="simple tabs example">
                            <Tab style={{outline: 'none', textDecoration: 'none'}} component={Link} to="/news/manage" label="Gérer" {...this.a11yProps(0)} />
                            <Tab style={{outline: 'none', textDecoration: 'none'}} component={Link} to="/news/create" label="Créer" {...this.a11yProps(1)} />
                        </Tabs>
                        </Grid>
                    </Grid>
                </main>
            </div>
        )
    }
}

export default withStyles(useStyles)(ManageNewView);
