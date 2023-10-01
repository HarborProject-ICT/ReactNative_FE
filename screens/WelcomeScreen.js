import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/auth-context';

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore, addRandomData } from '../firebaseConfig';

const WelcomeScreen = () => {
  class Cargo {
    constructor(name, ship, port) {
      this.name = name;
      this.ship = ship;
      this.port = port;
    }
  }

  const [cargoList, setCargoList] = useState([]);
  const navigation = useNavigation();

  const handleButtonPress = (cargo) => {
    navigation.navigate('화물 배정 시간 예약', { cargo })
  };

  const onPressHandler = () => {
    navigation.navigate('소켓 연결')
  };

  useEffect(()=> {
    const cargoData = [];
    firestore.collection('cargos')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          cargoData.push(new Cargo(data.cargoName, data.cargoShip, data.cargoPort));
        });
        // Set the fetched data in the state
        setCargoList(cargoData);
      })
      .catch((error) => {
        console.error('Error fetching data from Firestore:', error);
      });
  },[]);

  async function addRandomData() {
    for (let i = 0; i < 10; i++) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const portChar = ['동원', '신흥사', '쌍용', 'kctc', '고려항만', '동방', '세방', '대한통운', '태영화학', 'CJ', '대주', '울산해상', '영인산업', '영인', '(주)글로벌'];
      let cargoName = '';
      let cargoPort = '';
      let cargoShip = '';
  
      // 원하는 길이만큼 무작위 문자 선택
      for (let i = 0; i < 6; i++) {
        cargoName += characters.charAt(Math.floor(Math.random() * characters.length));
        cargoShip += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      // 랜덤한 인덱스 생성
      const randomIndex = Math.floor(Math.random() * portChar.length);

      // 랜덤한 값을 가져오기
      cargoPort = portChar[randomIndex];
  
      // Firestore에 데이터 추가
      await firestore.collection('cargos').doc(cargoName).set({
        cargoName: cargoName,
        cargoPort: cargoPort,
        cargoShip: cargoShip
      }).then(() => {
        console.log(`Data ${i + 1} 추가됨`);
      })
      .catch((error) => {
        console.error('데이터 추가 중 오류 발생:', error);
      });
    }
  }
/*
  useEffect(() => {
    addRandomData()
      .then(() => {
        console.log('데이터 생성이 완료되었습니다.');
      })
      .catch((error) => {
        console.error('데이터 생성 중 오류 발생:', error);
      });
  },[]);
*/

    return (
    <ScrollView>
    <View style={styles.container}>
    <Button
      title="button"
                onPress={onPressHandler}
                color="#841584"
              />
        {cargoList.map((cargo, index) => (
        <View style={styles.inContainer} key={cargo.name}>
            <View style={styles.textContainer}>
              <View style={styles.freigtContainer}>
                <Text style={styles.freigtText}>{cargo.name}</Text>
              </View>
              <View style={styles.aboutfreigtContainer}>
                <Text style={styles.aboutfreigtText}>{cargo.ship}</Text>
                <Text style={styles.aboutfreigtText}>{cargo.port}</Text>
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
        fontSize: 27,
        textAlign: 'center',
        alignItems : 'center'
    },
    inContainer: {
        flex: 1,
        marginTop: 30,
        width : 340,
        height : 80,
        backgroundColor: '#d6d6d6',
        borderRadius: 5,
        flexDirection: 'row'
    },
    textContainer: {
        flex:1,
        flexDirection: 'row'
    },
    buttonContainer: {
        backgroundColor: 'white',
        height : 30,
        width : 50,
        alignItems: 'center',
        justifyContent : 'center',
        marginTop : 30,
        marginRight : 10,
        borderRadius : 5
    },
    freigtContainer: {
      flex : 0.4,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft : 10
    },
    aboutfreigtContainer: {
      flex : 0.6,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
        fontSize: 15,
        color: 'gray'
    },
    freigtText: {
        fontSize : 20,
        color: '#7198F4',
        fontWeight : 'bold',
    },
    aboutfreigtText: {
        color: 'black',
        fontSize : 17,
    }
});

export default WelcomeScreen;