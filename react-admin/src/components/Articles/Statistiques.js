import React from 'react';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';

class ArticlesStatistiquesComponent extends React.Component {
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
            <>
                <div className={styles.tabs}>
                    <ul>
                        <li className={styles.active}>Aujourd'hui</li>
                        <li>Cette semaine</li>
                        <li>Ce mois-ci</li>
                        <li>Cette année</li>
                        <li>Depuis toujours</li>
                    </ul>
                </div>
                <div className={styles.box}>
                    <div className={bootstrap.row}>
                        <div className={bootstrap.colMd3}>
                            <div className={styles.title}>
                                Nombre d'articles
                            </div>
                            <div className={styles.body}>
                                {this.props.news_count}
                            </div>
                        </div>
                        <div className={bootstrap.colMd3}>
                            <div className={styles.title}>
                                Nombre de réactions
                            </div>
                            <div className={styles.body}>
                            0
                            </div>
                        </div>
                        <div className={bootstrap.colMd3}>
                            <div className={styles.title}>
                                Nombre de commentaires
                            </div>
                            <div className={styles.body}>
                                0
                            </div>
                        </div>
                        <div className={bootstrap.colMd3}>
                            <div className={styles.title}>
                                Nombre de vues
                            </div>
                            <div className={styles.body}>
                                0
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ArticlesStatistiquesComponent;
