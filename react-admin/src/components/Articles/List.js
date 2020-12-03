import React from 'react';
import { Link } from 'react-router-dom';

import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.module.css';

import { Lens as LensMaterial,
        MoreHoriz as MoreHorizMaterial
   } from '@material-ui/icons';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';

import ReactTimeAgo from 'react-time-ago'

class ArticlesListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doc: null,
            notFound: false,
            posts: [],
            currentPage: 1,
            newsPerPage: 10
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, event2) {
        this.setState({
            currentPage: Number(event)
        });
    }

    render() {

        const { currentPage, newsPerPage } = this.state;
        const { news } = this.props;

        const indexOfLastNews = currentPage * newsPerPage;
        const indexOfFirstNews = indexOfLastNews - newsPerPage;
        const currentNewss = news.slice(indexOfFirstNews, indexOfLastNews);

        const renderNews = currentNewss.map((news, index) => {
        return (
            <tr key={index}>
               <td className={styles.borderTable}>
               <Link to={'/articles/edit/'+news._id} className={styles.viewTable}>Voir</Link>
               </td>
               <td className={styles.borderTable}><div><LensMaterial style={{color: news.disabled == true ? '#ff2424' : '#0a9113', fontSize: 17}}/></div></td>
               <td className={styles.borderTable}>{news.title}</td>
               <td className={styles.borderTable}>{news.category.display_name}</td>
               <td className={styles.borderTable}>{news.subcategory.display_name}</td>
               <td className={styles.borderTable}>0</td>
               <td className={styles.borderTable}>0</td>
               <td className={styles.borderTable}>0</td>
               <td className={styles.borderTable}><ReactTimeAgo date={new Date(news.created_at)} locale="fr"/></td>
            </tr>
            );
        });

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(news.length / newsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li key={number} id={number} onClick={this.handleClick}>
                    {number}
                </li>
            );
        });

        return(
            <>
                <div className={styles.box} style={{paddingLeft:0, paddingRight: 0 }}>
                    <div className={styles.btn}>
                        <Link to="/articles/create" className={styles.btnCreate}>Créer un article</Link>
                        <Link to="/articles/category/create" className={styles.btnTransparent}>Gérer les catégories</Link>
                        <Link to="/articles/subcategory/create" className={styles.btnTransparent}>Gérer les sous-catégorie</Link>
                    </div>
                    <div className={styles.list}>
                        <table style={{width: '100%', fontSize: 12}}>
                            <tr>
                                <td className={styles.borderTable}></td>
                                <td className={styles.borderTable}></td>
                                <td style={{fontWeight: '500'}} className={styles.borderTable}>Titre</td>
                                <td style={{fontWeight: '500'}}  className={styles.borderTable}>Catégorie</td>
                                <td style={{fontWeight: '500'}}  className={styles.borderTable}>Sous-catégorie</td>
                                <td style={{fontWeight: '500'}}  className={styles.borderTable}>Réactions</td>
                                <td style={{fontWeight: '500'}}  className={styles.borderTable}>Commentaires</td>
                                <td style={{fontWeight: '500'}}  className={styles.borderTable}>Vues</td>
                                <td style={{fontWeight: '500'}}  className={styles.borderTable}>Posté</td>
                            </tr>
                            {renderNews}
                        </table>
                        <div className={styles.pagination}>
                            <Pagination className="ant-pagination" onChange={this.handleClick} pageSize={newsPerPage} defaultCurrent={this.state.currentPage} total={news.length} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ArticlesListComponent;
