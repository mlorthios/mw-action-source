import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBars, faCog } from '@fortawesome/free-solid-svg-icons'

import styles from '../../App.css';

import { Menu as MenuMaterial, 
        Close as CloseMaterial
        } from '@material-ui/icons';

class NavigationNavbar2Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return(
            <>
                <nav className={styles.navRed}>
                    <Link to="/articles" style={{fontSize: 20, color: '#fff', paddingTop: '6px', marginRight: 15}}><CloseMaterial/></Link>
                    <span className={styles.title}>{this.props.title}</span>
                </nav>
            </>
        )
    }
}

export default NavigationNavbar2Component;