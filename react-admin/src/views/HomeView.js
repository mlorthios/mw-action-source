import React from 'react';
import { withRouter } from 'react-router-dom';

import NavigationNavbarComponent from "../components/Navigation/Navbar";
import NavigationSidebarComponent from "../components/Navigation/Sidebar";

import HomeStatistiquesComponent from '../components/Home/Statistiques';
import HomeReportsComponent from '../components/Home/Reports';


import styles from '../App.css';
import bootstrap from '../Bootstrap.css';

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doc: null,
            notFound: false,
            posts: [],
        }
    }

    componentDidMount(){
        document.title = "Administration MW Action"
    }

    render() {
        return(
            <>
                <NavigationNavbarComponent/>
                <div className={styles.wrapper}>
                    <NavigationSidebarComponent active_page="home" />
                    <main>
                        <div className={styles.mainCenter}>
                            <div className={styles.mainWidth}>
                                <div className={styles.titlePage}>
                                    Accueil
                                </div>
                                <div className={bootstrap.row}>
                                    <div className={bootstrap.colMd12}>
                                        <HomeStatistiquesComponent/>
                                    </div>
                                </div>
                                <div className={bootstrap.row}>
                                    <div className={bootstrap.colMd6}>
                                        <HomeReportsComponent/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        )
    }
}

export default withRouter(HomeView)
