import React from 'react';
import { withRouter } from 'react-router-dom';

import NavigationNavbar2Component from '../../components/Navigation/Navbar2';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';

import { BounceLoader } from "react-spinners";

import axios from 'axios';
import cookie from 'react-cookies';

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            caract: {
                categ: 15,
            },
            doc: null,
            notFound: false,
            error_type: '',
            publish: false,
            loading: false,
            category_name: '',
            category: [],
            category_active: '',
            category_loaded: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.redirectAfterCreate = this.redirectAfterCreate.bind(this);
    }

    loadCategory() {
        const url = 'http://localhost:4001/v1/admin/news/fetchcategory';
        
        const options = {
            method: 'GET',
            headers: { 'Authorization': cookie.load('token') }
        }

        axios.get(url, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    category: response.data['response'],
                    category_loaded: true,
                    category_active: response.data.response[0]['name']
                });
            } else {
            }
        });
    }

    componentDidMount(){
        document.title = "Administration MW Action"
        this.loadCategory();
    }

    redirectAfterCreate(){
        this.setState({publish: false, error_type: ''})
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

    handlePublish = (event) => {
        this.setState({loading: true})
        event.preventDefault();
        const data = new FormData();
        data.append('display_name', this.state.category_name);

        const url = 'http://localhost:4001/v1/admin/news/createcategory';

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token')  },
            
        }

        axios.post(url, data, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                    category_name: '',
                    category: [...this.state.category, response.data.data]
                });
                setTimeout(this.redirectAfterCreate, 1500);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    deleteCategory(id) {
        const dataa = this.state.category;

        var messages = [];

        dataa.map(k => {
            if(k._id == id) {

            } else {
                const msg = {
                    _id: k._id,
                    name: k.name,
                    display_name: k.display_name,
                }
                messages.push(msg)
            }
        })

        this.setState({category: messages})

        const data = new FormData();
        data.append('category_name', id);

        const url = 'http://localhost:4001/v1/admin/news/deletecategory';

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token')  },
            
        }

        axios.post(url, data, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    publish: false
                });
                setTimeout(this.redirectAfterCreate, 1500);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    render() {
        return(
            <>
                <NavigationNavbar2Component title="Créer une catégorie d'article"/>
                <div className={styles.wrapper}>
                    <main>
                        <div className={styles.mainCenter}>
                            <div className={styles.mainWidth}>
                            {this.state.publish &&
                                <div className={this.state.error_type == 'error' ? styles.alertRed : styles.alertGreen}>{this.state.message}</div>
                            }
                                {this.state.category_loaded ? (
                                <div>
                                    <div className={styles.box}>
                                        <form onSubmit={this.handlePublish}>
                                            <div className={bootstrap.row}>
                                                <div className={bootstrap.colMd12}>
                                                    <div className={styles.formGroup}>
                                                        <label>Nom de la catégorie</label>
                                                        <input placeholder="Nom de la catégorie" disabled={this.state.loading ? true : false} maxLength="15" name="category_name" type="text" value={this.state.category_name} onChange={this.handleChange} className={styles.input}/>
                                                        <label style={{fontSize: 12, color: 'rgba(0,0,0,0.6)'}}>
                                                            {this.state.caract.categ - this.state.category_name.length}
                                                            {(this.state.caract.categ - this.state.category_name.length) > 1 ? (
                                                                <span> caractères</span>
                                                            ) : (
                                                                <span> caractère</span>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className={bootstrap.colMd12}>
                                                    <div className={styles.formGroup}>
                                                        <button type="submit" className={styles.buttonPublish}>Ajouter</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className={styles.box}>
                                        <div className={bootstrap.row}>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.heading}>
                                                    Catégories existantes
                                                </div>
                                                <div className={styles.content}>
                                                    <ul className={styles.report}>
                                                        {this.state.category.length != 0 &&
                                                            this.state.category.map(categ => (
                                                                <li>
                                                                    <div style={{display: 'inline-block'}}>
                                                                        <div className={styles.limit}>
                                                                            {categ.display_name}
                                                                        </div>
                                                                    </div>
                                                                    <div onClick={() => this.deleteCategory(categ._id)} style={{float: 'right', color: '#085192', fontWeight: '500', cursor: 'pointer'}}>
                                                                        <span>Supprimer</span>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
