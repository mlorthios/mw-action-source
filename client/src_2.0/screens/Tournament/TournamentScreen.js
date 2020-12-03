import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions} from 'react-native';
import convertSize from '../../utils/convertSize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const marginTopSize = new convertSize().MarginTopResponsive()

class TournamentScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerH1View}>
                    <Text style={styles.headerH1Text}>Tournois</Text>
                </View>
                <View style={styles.marginCorner}>
                    <View style={styles.cardBoxShadow}>
                        <TouchableOpacity style={{marginBottom: 5}}>
                            <View style={{backgroundColor: '#404040', padding: 13, borderRadius: 10}}>
                                <Text style={{color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center'}}>Rechercher un tournoi</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardBoxShadow}>
                        <TouchableOpacity style={{marginBottom: 5}}>
                            <View style={{backgroundColor: '#0da61f', padding: 13, borderRadius: 10}}>
                                <Text style={{color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center'}}>Créer un tournoi</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardBoxShadow}>
                        <TouchableOpacity style={{marginBottom: 5}}>
                            <View style={{backgroundColor: '#fff', padding: 13, borderRadius: 10}}>
                                <Text style={{color: '#000', fontSize: 17, fontWeight: '600', textAlign: 'center'}}>Gérer mes tournois</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardBoxShadow}>
                        <TouchableOpacity>
                            <View style={{backgroundColor: '#1a8db8', padding: 13, borderRadius: 10}}>
                                <Text style={{color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center'}}>Mes tournois</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.headerH2View}>
                    <Text style={styles.headerH2Text}>Tournois Publique</Text>
                    <TouchableOpacity>
                        <Text style={styles.headerH2Filter}>Filtrer</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <TouchableOpacity style={styles.marginCorner}>
                        <View style={{backgroundColor: 'rgba(220, 220, 220, 1)', padding: 16, borderRadius: 10}}>
                            <Text style={{fontSize: 17, fontWeight: '600', marginBottom: 7}}><FontAwesome5 name={'arrow-right'}/> Arwantys Tournoi</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{marginRight: 8}}>
                                    <FontAwesome5 name={'unlock-alt'}/> Publique
                                </Text>
                                <Text style={{fontWeight: '400'}}><FontAwesome5 solid name={'street-view'}/> 5/8</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: marginTopSize,
    },
    headerH1View: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 25
    },
    headerH1Text: {
        fontWeight: 'bold',
        fontSize: 34,
        marginBottom: 10
    },
    headerH2View: {
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerH2Text: {
        fontWeight: '600',
        fontSize: 25,
        marginBottom: 10
    },
    headerH2Filter: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingLeft: 9,
        paddingRight: 9,
        paddingTop: 5, 
        paddingBottom: 5,
        borderRadius: 10,
        overflow: 'hidden',
        color: '#fff',
        fontWeight: '500'
    },
    cardBoxShadow: {
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowOffset: {
	        width: 0,
	        height: 0,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3.62,
         elevation: 4,
    },
    marginCorner: {
        marginLeft: 20,
        marginRight: 20
    }
})

export default TournamentScreen;