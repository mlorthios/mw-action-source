import React from 'react';

import styles from '../../App.css';
import bootstrap from '../../Bootstrap.css';

class HomeReportsComponent extends React.Component {
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
            <div className={styles.box}>
                <div className={bootstrap.row}>
                    <div className={bootstrap.colMd12}>
                        <div className={styles.heading}>
                            Rapports de signalement
                        </div>
                        <div className={styles.content}>
                            <ul className={styles.report}>
                                <li>
                                    <div className={styles.limit}>
                                        De <span className={styles.username}>Arwantys</span> - <span className={styles.type}>Message de discussion</span>
                                    </div>
                                    <div className={styles.time}>Il y a 5 minutes</div>
                                </li>
                                <li>
                                    <div className={styles.limit}>
                                        De <span className={styles.username}>Arwantys</span> - <span className={styles.type}>Message de discussion</span>
                                    </div>
                                    <div className={styles.time}>Il y a 5 minutes</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomeReportsComponent;
