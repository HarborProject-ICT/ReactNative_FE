import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/auth-context';

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView,  } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { auth } from '../firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const WelcomeScreen = () => {
/*
    const [fetchedMessage, setFetchedMesssage] = useState('');

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios
      .get(
        'https://testproject-a435c-default-rtdb.firebaseio.com/message.json?auth=' +
          token
      )
      .then((response) => {
        setFetchedMesssage(response.data);
      });
  }, [token]);
  */

  

 
  class Cargo {
    constructor(name, ship, port) {
      this.name = name;
      this.ship = ship;
      this.port = port;
    }
  }

  const cargoList = [
    new Cargo("P1234567", "V GLOBAL", "동원"),
    new Cargo("CMD2482", "POLAR", "신흥사"),
    new Cargo("DNS3436", "우진 파이오니어호", "신흥사"),
    new Cargo("BDK7912", "GAS DEFIANCE", "동원"),
    new Cargo("BDK7912", "GAS DEFIANCE", "동원"),
  ];

  const navigation = useNavigation();

  const handleButtonPress = (cargo) => {
    navigation.navigate('화물 배정 시간 예약', { cargo })
  };

    return (
        
    <ScrollView>
    <View style={styles.container}>
        {cargoList.map((cargo, index) => (
        <View style={styles.inContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.freigtText}>{cargo.name}</Text>
                <View style={{marginTop : 40}}>
                    <Text style={styles.aboutfreigtText}>선박 : {cargo.ship}</Text>
                    <Text style={styles.aboutfreigtText}>하역사 : {cargo.port}</Text>
                </View>
            </View>
            <TouchableOpacity key={index}
            onPress={() => handleButtonPress(cargo)} underlayColor="white">
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>예약</Text>
            </View>
            </TouchableOpacity>
        </View>
        ))} 
    </View>
    </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    },
    inContainer: {
        flex: 1,
        marginTop: 30,
        width : 340,
        height : 150,
        borderWidth : 2,
        borderColor: '#0a75ad',
        flexDirection: 'row'
    },
    textContainer: {
        width : 260,
        margin : 10
    },
    buttonContainer: {
        backgroundColor: '#DCDCDC',
        height : 30,
        width : 50,
        alignItems: 'center',
        justifyContent : 'center',
        marginTop : 110,
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
    freigtText: {
        fontSize : 25,
        color: 'black',
        fontStyle : 'bold'
    },
    aboutfreigtText: {
        color: '#63ace5',
        fontSize : 20,
        fontStyle : 'bold',
    }
});

export default WelcomeScreen;