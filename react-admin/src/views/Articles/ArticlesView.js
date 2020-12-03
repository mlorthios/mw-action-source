import React from 'react';
import { BounceLoader } from "react-spinners";
import { withRouter } from 'react-router-dom';

import NavigationNavbarComponent from "../../components/Navigation/Navbar";
import NavigationSidebarComponent from "../../components/Navigation/Sidebar";

import ArticlesStatistiquesComponent from '../../components/Articles/Statistiques';
import ArticlesListComponent from '../../components/Articles/List';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';

import axios from 'axios';
import cookie from 'react-cookies';

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doc: null,
            notFound: false,
            news: [],
            news_loaded: false
        }
    }

    componentDidMount(){
        document.title = "Administration MW Action"
        this.loadNews();
    }

    loadNews() {
        const url = 'http://localhost:4001/v1/admin/news/fetchall';
        
        const options = {
            method: 'GET',
            headers: { 'Authorization': cookie.load('token') }
        }

        axios.get(url, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    news: response.data.response,
                    news_loaded: true
                })
            } else {
            }
        });
    }

    render() {
        return(
            <>
                <NavigationNavbarComponent/>
                <div className={styles.wrapper}>
                    <NavigationSidebarComponent active_page="articles" />
                    <main>
                        <div className={styles.mainCenter}>
                            <div className={styles.width2}>
                                {this.state.news_loaded ? (
                                    <>
                                    <div className={styles.titlePage}>
                                        Articles
                                    </div>
                                    <div className={bootstrap.row}>
                                        <div className={bootstrap.colMd12}>
                                            <ArticlesStatistiquesComponent news_count={this.state.news.length}/>
                                        </div>
                                    </div>
                                    <div className={bootstrap.row}>
                                        <div className={bootstrap.colMd12}>
                                            <ArticlesListComponent news={this.state.news}/>
                                        </div>
                                    </div>
                                    </>
                                ) : (
                                    <div className={styles.loading}>
                                        <BounceLoader
                                            size={40}
                                            color={"#c1c1c1"}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </>
        )
    }
}

export default withRouter(HomeView)
