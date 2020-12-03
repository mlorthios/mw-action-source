import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBars, faCog } from '@fortawesome/free-solid-svg-icons'

import styles from '../../App.css';

import { Home as HomeMaterial, 
         ListAlt as ListAltMaterial, 
         Equalizer as EqualizerMaterial, 
         Message as MessageMaterial, 
         People as PersonsMaterial,
         PieChart as ChartMaterial,
         Update as UpdateMaterial,
         Settings
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
                <sidebar className={styles.navbarLeft}>
                    <ul>
                        <Link to="/"><li className={this.props.active_page == 'home' ? styles.active : ''}><HomeMaterial style={{fontSize: 20, marginRight: 13}} /> Accueil</li></Link>
                        <Link to="/articles"><li className={this.props.active_page == 'articles' ? styles.active : ''}><ListAltMaterial style={{fontSize: 20, marginRight: 13}} /> Articles</li></Link>
                        <Link to="/"><li><EqualizerMaterial style={{fontSize: 20, marginRight: 13}} /> Sondages</li></Link>
                        <Link to="/"><li><MessageMaterial style={{fontSize: 20, marginRight: 13}} /> Chat</li></Link>
                        <Link to="/"><li><PersonsMaterial style={{fontSize: 20, marginRight: 13}} /> Utilisateurs</li></Link>
                        <li className={styles.separe}></li>
                        <Link to="/"><li><ChartMaterial style={{fontSize: 20, marginRight: 13}} /> Statistiques</li></Link>
                        <Link to="/"><li><UpdateMaterial style={{fontSize: 20, marginRight: 13}} /> Historique</li></Link>
                        <Link to="/"><li><Settings icon={faCog} style={{fontSize: 20, marginRight: 13}} /> Paramètres</li></Link>
                    </ul>
                </sidebar>
            </>
        )
    }
}

export default NavigationNavbarComponent;