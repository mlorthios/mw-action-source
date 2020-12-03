import React from 'react';
import { withRouter } from 'react-router-dom';

import NavigationNavbar2Component from '../../components/Navigation/Navbar2';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';
import { Dot } from 'react-animated-dots';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import fr from '@ckeditor/ckeditor5-build-classic/build/translations/fr';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { BounceLoader } from "react-spinners";

import axios from 'axios';
import cookie from 'react-cookies';

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            caract: {
                title: 75,
                description: 110
            },
            publish: false,
            message: null,
            error_type: null,
            loaded: false,
            title: '',
            description: '',
            category: [],
            category_active: '',
            category_loaded: false,
            subcategory: [],
            subcategory_loaded: false,
            subcategory_active: '',
            subcategory_change: false,
            content: '',
            image: [],
            imageValue: '',
            imageName: '',
            ckeditor: null,
            ckeditor_loading: false,
            news_loaded: false,
            disabled: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.redirectAfterCreate = this.redirectAfterCreate.bind(this);
        this.loadCKEditor = this.loadCKEditor.bind(this);
        this.beforeLoadCKEditor = this.beforeLoadCKEditor.bind(this);
        this.afterLoadCKEditor = this.afterLoadCKEditor.bind(this);

    }

    componentDidMount(){
        document.title = "Administration MW Action"
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        this.loadNews(id);
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
                    category_loaded: true
                });
                this.loadSubCategory(this.state.category_active);
            } else {
                console.log(response.data['response'])
            }
        });
    }

    loadSubCategory(active) {
        const url = 'http://localhost:4001/v1/admin/news/fetchsubcategory?category='+active;
        
        const options = {
            method: 'GET',
            headers: { 'Authorization': cookie.load('token') }
        }

        axios.get(url, options).then((response) => {
            if(response.data['status'] == 'success') {
                if(response.data.response.length !== 0) {
                    this.setState({
                        subcategory: response.data['response'],
                        subcategory_loaded: true,
                        subcategory_change: false
                    });
                } else {
                    this.setState({
                        subcategory_loaded: true,
                        subcategory_change: false,
                        subcategory: [],
                    });
                }
            
            } else {
               
            }
        });
    }

    loadNews(id) {
        const url = 'http://localhost:4001/v1/admin/news/fetch?id='+id;
        
        const options = {
            method: 'GET',
            headers: { 'Authorization': cookie.load('token') }
        }

        axios.get(url, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    title: response.data.response[0].title,
                    description: response.data.response[0].description,
                    content: response.data.response[0].content,
                    category_active: response.data.response[0].category.name,
                    subcategory_active: response.data.response[0].subcategory.name,
                    disabled: response.data.response[0].disabled,
                    news_loaded: true,
                });
                this.loadCategory();
                this.beforeLoadCKEditor();
            } else {
            }
        });
    }

    loadCKEditor(e) {
        const ck =  <CKEditor                              
                        editor={ ClassicEditor }
                        data={this.state.content}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.handleModelChange(data)
                            }
                        }
                    />;

    this.setState({ckeditor: ck})
    }

    afterLoadCKEditor() {
        this.setState({ckeditor_loading: true})
    }

    beforeLoadCKEditor() {
        this.loadCKEditor();
        setTimeout(this.afterLoadCKEditor, 1);
    }

    redirectAfterCreate(){
        this.props.history.push('/articles')
    }

    handleChangeCategory(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            subcategory_change: true
        });

        this.loadSubCategory(value)
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
        this.setState({loading: true})
        event.preventDefault();
        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;
        const data = new FormData();
        data.append('image', this.state.image);
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        data.append('content', this.state.content);
        data.append('category', this.state.category_active);
        data.append('sub_category', this.state.subcategory_active);
        data.append('id', id);

        const url = 'http://localhost:4001/v1/admin/news/update';

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
                    image: '',
                    imageValue: '',
                });
                setTimeout(this.redirectAfterCreate, 1000);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    handleDelete() {
        const url = 'http://localhost:4001/v1/admin/news/delete';

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token')  },
            
        }

        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;

        const data = new FormData();
        data.append('id', id);

        axios.post(url, data, options).then((response) => {
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                });
                setTimeout(this.redirectAfterCreate, 1000);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    handleDisable() {
        const url = 'http://localhost:4001/v1/admin/news/disable';

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token')  },
            
        }

        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;

        const data = new FormData();
        data.append('id', id);

        axios.post(url, data, options).then((response) => {
            console.log(response)
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                });
                setTimeout(this.redirectAfterCreate, 1000);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    handleActive() {
        const url = 'http://localhost:4001/v1/admin/news/active';

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token')  },
            
        }

        const { match = {} } = this.props;
        const { params = {} } = match;
        const id = params.id;

        const data = new FormData();
        data.append('id', id);

        axios.post(url, data, options).then((response) => {
            console.log(response)
            if(response.data['status'] == 'success') {
                this.setState({
                    loading: false,
                    publish: true,
                    message: response.data['response'],
                    error_type: response.data['status'],
                });
                setTimeout(this.redirectAfterCreate, 1000);
            } else {
                this.setState({loading: false, publish: true, message: response.data['response'], error_type: response.data['status']});
            }

        });
    }

    render() {
        return(
            <>
                <NavigationNavbar2Component title={'Modifier l\'article : '+this.state.title}/>
                <div className={styles.wrapper}>
                    <main>
                        <div className={styles.mainCenter}>
                            <div className={styles.mainWidth}>
                            {this.state.publish &&
                                <div className={this.state.error_type == 'error' ? styles.alertRed : styles.alertGreen}>{this.state.message}</div>
                            }
                                <div style={{marginBottom: 15}}>
                                    {this.state.disabled === true ? (
                                        <span onClick={() => this.handleActive()}  className={styles.buttonActive}>Activer</span>
                                    ) : this.state.disabled === false ? (
                                        <span onClick={() => this.handleDisable()}  className={styles.buttonDisable}>Désactiver</span>
                                    ) : (
                                        <span></span>
                                    )}
                                    <span onClick={() => this.handleDelete()} className={styles.buttonDelete}>Supprimer</span>
                                </div>
                                {this.state.ckeditor_loading && this.state.news_loaded  && this.state.category_loaded && this.state.subcategory_loaded ? (
                                <div className={styles.box}>
                                    <form onSubmit={this.handlePublish}>
                                        <div className={bootstrap.row}>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label>Titre</label>
                                                    <input disabled={this.state.loading ? true : false} maxLength="75" name="title" type="text" placeholder="Titre" value={this.state.title} onChange={this.handleChange} className={styles.input}/>
                                                    <label style={{fontSize: 12, color: 'rgba(0,0,0,0.6)'}}>
                                                    {this.state.caract.title - this.state.title.length}
                                                    {(this.state.caract.title - this.state.title.length) > 1 ? (
                                                        <span> caractères</span>
                                                    ) : (
                                                        <span> caractère</span>
                                                    )}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label>Description</label>
                                                    <input disabled={this.state.loading ? true : false} maxLength="110" name="description" type="text" placeholder="Description"  value={this.state.description} onChange={this.handleChange} className={styles.input}/>
                                                    <label style={{fontSize: 12, color: 'rgba(0,0,0,0.6)'}}>
                                                    {this.state.caract.description - this.state.description.length}
                                                    {(this.state.caract.description - this.state.description.length) > 1 ? (
                                                        <span> caractères</span>
                                                    ) : (
                                                        <span> caractère</span>
                                                    )}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label>Catégorie</label>
                                                    <select disabled={this.state.loading ? true : false} name="category_active" onChange={this.handleChangeCategory} className={styles.select}>
                                                        {this.state.category.length != 0 &&
                                                            this.state.category.map(categ => (
                                                                <option selected={this.state.category_active === categ.name ? true : false} value={categ.name} key={categ._id}>{categ.display_name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label>Sous-catégorie</label>
                                                    {this.state.subcategory_change == false ? (
                                                        <select disabled={this.state.loading ? true : false} name="subcategory_active" onChange={this.handleChange} className={styles.select}>
                                                        {this.state.subcategory.length != 0 &&
                                                            this.state.subcategory.map(subcateg => (
                                                                <option value={subcateg.name} selected={this.state.subcategory_active === subcateg.name ? true : false} key={subcateg._id}>{subcateg.display_name}</option>
                                                            ))
                                                        }
                                                        </select>
                                                    ) : (
                                                        <div style={{fontSize: 12, color: 'rgba(0, 0, 0, 0.7)'}}>Chargement</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label style={{display: 'block'}}>Image</label>
                                                    <label className={styles.inputFile}>
                                                        {this.state.imageName ? (
                                                            this.state.imageName
                                                        ) : (
                                                            <span>Choisir une image</span>
                                                        )}
                                                        <input  value={this.state.imageValue} name="image[]" onChange={this.handleChangeImage} type="file"/>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <label style={{display: 'block', marginBottom: 5}}>Contenu</label>
                                                    {this.state.ckeditor}
                                                </div>
                                            </div>
                                            <div className={bootstrap.colMd12}>
                                                <div className={styles.formGroup}>
                                                    <div className={styles.containerButtonPublish}>
                                                        <button disabled={this.state.loading ? true : false} type="submit" className={styles.buttonPublish}>
                                                        {this.state.loading ? (
                                                            <span>
                                                                Chargement
                                                                <Dot>.</Dot>
                                                                <Dot>.</Dot>
                                                                <Dot>.</Dot>
                                                            </span>
                                                        ) : (
                                                            <span>Publier</span>
                                                        )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                   </form>
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
