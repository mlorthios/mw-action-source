import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBars, faCog } from '@fortawesome/free-solid-svg-icons'

import styles from '../../App.css';

import { Menu as MenuMaterial, 
        } from '@material-ui/icons';

class NavigationNavbarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return(
            <>
                <nav className={styles.navLight}>
                    <span style={{fontSize: 20, color: 'rgba(117, 117, 117, 1)', paddingTop: '7px'}}><MenuMaterial/></span>
                    <span className={styles.logo}></span>
                </nav>
            </>
        )
    }
}

export default NavigationNavbarComponent;