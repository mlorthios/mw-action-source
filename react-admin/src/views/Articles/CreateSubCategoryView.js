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
                subcateg: 15,
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
            subcategory: '',
            subcategory_list: [],
            subcategory_loaded: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.redirectAfterCreate = this.redirectAfterCreate.bind(this);
    }

    componentDidMount(){
        document.title = "Administration MW Action"
        this.loadCategory();
    }

    loadCategory() {
        const url = 'http://localhost:4001/v1/admin/news/fetchcategory';
        
        const options = {
            method: 'GET',
            headers: { 'Authorization': cookie.load('token') }
        }

        axios.get(url, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.loadSubCategory(response.data.response[0].name);
                this.setState({
                    category: response.data['response'],
                    category_loaded: true,
                    category_active: response.data.response[0].name
                });
            } else {
                
            }
        });
    }

    loadSubCategory(active) {
        const url = 'http://localhost:4001/v1/admin/news/fetchallsubcategory';
        
        const options = {
            method: 'GET',
            headers: { 'Authorization': cookie.load('token') }
        }

        axios.get(url, options).then((response) => {
            if(response.data['status'] === 'success') {
                this.setState({
                    subcategory_list: response.data['response'],
                    subcategory_loaded: true

                });
            
            } else {
            }
        });
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

    handleChangeImage(e) {
        this.setState({image:e.target.files[0], imageValue: e.target.value, imageName: e.target.files[0].name});
    }

    handlePublish = (event) => {
        console.log(this.state.category_active)
        this.setState({loading: true})
        event.preventDefault();
        const data = new FormData();
        data.append('category_name', this.state.category_active)
        data.append('display_name', this.state.subcategory);

        const url = 'http://localhost:4001/v1/admin/news/createsubcategory';

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token')  },
            
        }

        axios.post(url, data, options).then((response) => {
            if(response.data['status'] === 'success') {
                const p = {
                    _id: response.data.data._id,
                    display_name: response.data.data.display_name,
                    category: {
                        _id: response.data.category._id,
                        display_name: response.data.category.display_name
                    }
                }
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                    subcategory: '',
                    subcategory_list: [...this.state.subcategory_list, p]
                });
                setTimeout(this.redirectAfterCreate, 1500);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    deleteSubCategory(id) {
        const dataa = this.state.subcategory_list;

        var messages = [];

        dataa.map(k => {
            if(k._id == id) {

            } else {
                const msg = {
                    _id: k._id,
                    display_name: k.display_name,
                    category: {
                        _id: k.category._id,
                        display_name: k.category.display_name
                    }
                }
                messages.push(msg)
            }
        })

        this.setState({subcategory_list: messages})

        const data = new FormData();
        data.append('sub_category_name', id);

        const url = 'http://localhost:4001/v1/admin/news/deletesubcategory';

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
                <NavigationNavbar2Component title="Créer une sous-catégorie d'article"/>
                <div className={styles.wrapper}>
                    <main>
                        <div className={styles.mainCenter}>
                            <div className={styles.mainWidth}>
                            {this.state.publish &&
                                <div className={this.state.error_type == 'error' ? styles.alertRed : styles.alertGreen}>{this.state.message}</div>
                            }
                            {this.state.category_loaded && this.state.subcategory_loaded ? (
                            <div>
                                <div className={styles.box}>
                                    <form onSubmit={this.handlePublish}>
                                        <div className={bootstrap.row}>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label>Catégorie</label>
                                                    <select disabled={this.state.loading ? true : false} name="category_active" onChange={this.handleChange} className={styles.select}>
                                                        {this.state.category.length != 0 &&
                                                            this.state.category.map(categ => {
                                                                return(
                                                                    <option value={categ.name}>{categ.display_name}</option>
                                                                )
                                                            })
                                                        }
                                                        </select>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Nom de la sous-catégorie</label>
                                                    <input disabled={this.state.loading ? true : false} maxLength="15" name="subcategory" value={this.state.subcategory} onChange={this.handleChange} placeholder="Nom de la sous-catégorie" className={styles.input}/>
                                                    <label style={{fontSize: 12, color: 'rgba(0,0,0,0.6)'}}>
                                                        {this.state.caract.subcateg - this.state.subcategory.length}
                                                        {(this.state.caract.subcateg - this.state.subcategory.length) > 1 ? (
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
                                                Sous-catégories existantes
                                            </div>
                                            <div className={styles.content}>
                                                <ul className={styles.report}>
                                                    {this.state.subcategory_list.length != 0 ? (
                                                        this.state.subcategory_list.map(subc => (
                                                            <li>
                                                                <div style={{display: 'inline-block'}}>
                                                                    <div className={styles.limit}>
                                                                        {subc.display_name}
                                                                    </div>
                                                                    <div className={styles.time}>Enfant de <strong>{subc.category['display_name']}</strong></div>
                                                                </div>
                                                                <div onClick={() => this.deleteSubCategory(subc._id)} style={{float: 'right', marginTop: 6, color: '#085192', fontWeight: '500', cursor: 'pointer'}}>
                                                                    <span>Supprimer</span>
                                                                </div>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li></li>
                                                    )}
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
