import React from 'react';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';

class HomeStatistiquesComponent extends React.Component {
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
            <div className={styles.boxDark}>
                <div className={bootstrap.row}>
                    <div className={bootstrap.colMd12}>
                        <div className={styles.heading}>
                            Statistiques
                        </div>
                    </div>
                </div>
                <div className={bootstrap.row}>
                    <div className={bootstrap.colMd3}>
                        <div className={styles.title}>
                            Nombre d'inscrits
                        </div>
                        <div className={styles.body}>
                            0
                        </div>
                    </div>
                    <div className={bootstrap.colMd3}>
                        <div className={styles.title}>
                            Nombre de connectés
                        </div>
                        <div className={styles.body}>
                        0
                        </div>
                    </div>
                    <div className={bootstrap.colMd3}>
                        <div className={styles.title}>
                            Nombre d'articles
                        </div>
                        <div className={styles.body}>
                            0
                        </div>
                    </div>
                    <div className={bootstrap.colMd3}>
                        <div className={styles.title}>
                            Nombre de sondages
                        </div>
                        <div className={styles.body}>
                            0
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomeStatistiquesComponent;
