import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getUserEmail, firestore } from '../firebaseConfig';

const ReserveScreen = ({ route }) => {

  const navigation = useNavigation();
    const { cargo } = route.params;

    class selectedCargo {
      constructor(name, ship, port, hour, time) {
        this.name = name;
        this.ship = ship;
        this.port = port;
        this.hour = hour;
        this.time = time;
      }
    }

    var now = new Date();
    var year = now.getFullYear();
    var todayMonth = now.getMonth() + 1;
    var todayDate = now.getDate();

    const week = ['일', '월', '화', '수', '목', '금', '토'];
    var dayOfWeek = week[now.getDay()];


    const [reservations, setReservations] = useState(Array(20).fill(Array(6).fill(false)));

    useEffect(() => {
      loadReservations();
    }, []);

    useEffect(() => {
      saveReservations();
    }, [reservations]);

    const userEmail = getUserEmail();
    
    const loadReservations = async () => {
      try {
        const storedReservations = await AsyncStorage.getItem('reservations');
        if (storedReservations) {
          setReservations(JSON.parse(storedReservations));
        }
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    };
  
    const saveReservations = async () => {
      try {
        await AsyncStorage.setItem('reservations', JSON.stringify(reservations));
      } catch (error) {
        console.error('Error saving reservations:', error);
      }
    };

    
    const selectHandler = () => {
      navigation.goBack();
    }

    const handleReservation = (rowIndex, columnIndex) => {
      const updatedReservations = [...reservations];
      updatedReservations[rowIndex] = updatedReservations[rowIndex].map((isReserved, index) => index === columnIndex);
      setReservations(updatedReservations);

      const selectedHour = `${rowIndex + 5}`;
      const selectedTime = `${columnIndex * 10}`;

      const selectedCargoObj = new selectedCargo(
        cargo.name,
        cargo.ship,
        cargo.port,
        selectedHour,
        selectedTime,
      );    
      
       //firestore에 선택한 화물 정보 저장
       const saveSelectedCargo = async (userEmail, selectedCargoObj) => {
        try {
          // userEmail을 사용하여 해당 사용자의 컬렉션에 데이터를 추가
          await firestore.collection('users').doc(userEmail).collection('cargos').add({
            cargoName: selectedCargoObj.name,
            cargoPort: selectedCargoObj.port,
            cargoShip: selectedCargoObj.ship,
            selectedHour: selectedCargoObj.hour,
            selectedTime: selectedCargoObj.time,
          });
          
          console.log('Selected cargo added to Firestore successfully');
        } catch (error) {
          console.error('Error adding selected cargo to Firestore:', error);
        }
      };

      Alert.alert('예약 확인',`${selectedHour}시 ${selectedTime}분에 예약하시겠습니까?`,[
        {
          text: '확인',
          onPress: () => {
            // 여기서 selectedCargo 데이터를 다른 페이지로 전달할 수 있음
            navigation.goBack(),
            console.log(selectedCargoObj),
            saveSelectedCargo(userEmail, selectedCargoObj)
          },
        },
        {text: '취소', onPress: () => navigation.goBack(),
        style: 'cancel'},
      ]);
      console.log(rowIndex+5, columnIndex*10);
    };
  
    const renderTimeSlot = (rowIndex) => {
      const hour = rowIndex + 5;
    
    return (
      <View>
        <View style={styles.reserveContainer}>
          <View key={rowIndex} style={styles.row}>
          <Text style={styles.timeLabel}>{hour < 10 ? `0${hour}` : hour}시</Text>
          {reservations[rowIndex].map((isReserved, columnIndex) => (
          <TouchableOpacity
            key={columnIndex}
            style={[styles.slot, isReserved ? styles.reservedSlot : styles.availableSlot]}
            onPress={() => handleReservation(rowIndex, columnIndex)}
          >
          </TouchableOpacity>
        ))}
          </View>
        </View>
      </View>
      );
    };
    return (
      <View style={styles.container}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{year}년 {todayMonth}월 {todayDate}일 ({dayOfWeek})</Text>
        </View>
        <ScrollView>
        <View style={styles.timeHeader}>
          <Text style={styles.timeLabel}>시</Text>
          {Array(6).fill().map((_, index) => (
            <Text key={index} style={styles.timeLabel}>
              {index * 10}
            </Text>
          ))}
        </View>
        {Array(20).fill().map((_, index) => renderTimeSlot(index))}
        </ScrollView>
      </View>
    );
  };
  
 
  


  
  
  
  
  
  

const styles = StyleSheet.create({
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  reserveContainer: {

  },
  dayText: {
    fontStyle: 'bold',
    fontSize: 20
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  timeHeader: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  timeLabel: {
    width: 50,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  slot: {
    width: 50,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  reservedSlot: {
    backgroundColor: '#0a75ad',
  },
  availableSlot: {
    backgroundColor: '#DCDCDC',
  },
  slotText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ReserveScreen;