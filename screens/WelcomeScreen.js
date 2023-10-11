import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/auth-context';
import LoadingOverlay from '../components/ui/LoadingOverlay';
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

  const INITIAL_ITEM_COUNT = 30; // 초기에 표시할 항목 개수
  const LOAD_MORE_COUNT = 30; // 한 번에 로드할 항목 개수

  const [cargoList, setCargoList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [visibleItems, setVisibleItems] = useState([]);
  const [totalItems, setTotalItems] = useState(cargoList.length);
  const [loadMoreCount, setLoadMoreCount] = useState(INITIAL_ITEM_COUNT);

  const navigation = useNavigation();

  const handleButtonPress = (cargo) => {
    navigation.navigate('화물 배정 시간 예약', { cargo })
  };

  const onPressHandler = () => {
    navigation.navigate('소켓 연결')
  };

  const handleLoadMore = () => {
    if (loadMoreCount + LOAD_MORE_COUNT <= totalItems) {
      const newLoadMoreCount = loadMoreCount + LOAD_MORE_COUNT;
      setVisibleItems(cargoList.slice(0, newLoadMoreCount));
      setLoadMoreCount(newLoadMoreCount);
    }
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
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data from Firestore:', error);
        setLoading(false);
      });

    setVisibleItems(cargoList.slice(0, loadMoreCount));
  },[]);

  if (loading) {
    return <LoadingOverlay message="화물 배정중..." />;
  }
  else {
    return (
    <ScrollView>
    <View style={styles.container}>
        {visibleItems.map((cargo, index) => (
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
        {loadMoreCount < totalItems && ( //30개씩 나오게 하는 코드.. 없애두됨
        <TouchableOpacity onPress={handleLoadMore}>
          <View style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>더 보기</Text>
          </View>
        </TouchableOpacity>
        )}
    </View>
  </ScrollView>
    );
  }
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
    },
    loadMoreButton: {
      marginTop: 30,
      width : 340,
      height : 80,
      backgroundColor: '#d6d6d6',
      borderRadius: 5,
      flexDirection: 'row'
    },
    loadMoreText: {
      flex:1,
      flexDirection: 'row'
    }
});

export default WelcomeScreen;