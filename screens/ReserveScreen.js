import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getUserEmail, firestore } from '../firebaseConfig';
import { getLocationDuration } from '../util/location';

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

    const userEmail = getUserEmail();

    const [reservations, setReservations] = useState(Array(20).fill(Array(6).fill(false)));
    const [longtermlist, setLongtermlist] = useState(Array(108).fill(0));


    useEffect(() => {
      const fetchData = async () => {
        const longtermlistData = await getLongtermlist();
        setLongtermlist(longtermlistData);
      };
    
      fetchData();
    }, []);
    
    useEffect(() => {
      updateReservations();
    }, [longtermlist]);
    
    const updateReservations = () => {
      const updatedReservations = Array(20).fill().map(() => Array(6).fill(false));
    
      for (let i = 0; i < longtermlist.length; i++) {
        if (longtermlist[i] === 0) {
          const hour = Math.floor(i / 6);
          const min = i % 6;
    
          // Set reservations[hour][min] to true in the updated array
          updatedReservations[hour][min] = true;
        }
      }
    
      // Update the state with the new array
      setReservations(updatedReservations);
    }; // Use a useEffect Hook to execute this side effect
    
    const getLongtermlist = async () => {
      try {
        const cityRef = firestore.collection('longtermlist').doc('mG0bZ5sgSx0XkuhYwZlq');
        const doc = await cityRef.get();
        if (!doc.exists) {
          console.log('No such document!');
          return [];
        } else {
          console.log('Document data:', doc.data().longtermlist);
          return doc.data().longtermlist;
        }
      } catch (error) {
        console.error('Error getting longtermlist:', error);
        return [];
      }
    };

    const handleReservation = (rowIndex, columnIndex) => {
      const index = rowIndex*6 + columnIndex;
      if(longtermlist[index] == 0) {
        Alert.alert('예약 불가', '예약이 완료된 시간대입니다.',[
          {
            text: '확인',
          }
        ]);
      } else {
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
            await firestore.collection('users').doc(userEmail).update({
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

        const deleteFromCargo = async (selectedCargoObj) => {
          try {
            const cargoName = selectedCargoObj.name;
            await firestore.collection('cargos').doc(cargoName).delete();
            console.log('Selected cargo deleted from Firestore successfully');
          } catch (error) {
            console.error('Error deleteting selected cargo from Firestore:', error);
          }
        };
      

      Alert.alert('예약 확인',`${selectedHour}시 ${selectedTime}분에 예약하시겠습니까?`,[
        {
          text: '확인',
          onPress: () => {
            // 여기서 selectedCargo 데이터를 다른 페이지로 전달할 수 있음
            navigation.goBack(),
            console.log(selectedCargoObj),
            saveSelectedCargo(userEmail, selectedCargoObj),
            deleteFromCargo(selectedCargoObj)
            const updatedLongtermlist = [...longtermlist];

            // Decrement the value at the specified index
            updatedLongtermlist[index]--;

            console.log("updatedLongtermlist"+updatedLongtermlist);

            setLongtermlist(updatedLongtermlist);

            const cityRef = firestore.collection('longtermlist').doc('mG0bZ5sgSx0XkuhYwZlq');
              cityRef.update({ longtermlist: updatedLongtermlist })
                .then(() => {
                  console.log('Updated longtermlist in Firestore successfully');
                })
                .catch((error) => {
                  console.error('Error updating longtermlist in Firestore:', error);
                });
          },
        },
        {text: '취소', onPress: () => navigation.navigate('화물 배정'),
        style: 'cancel'},
      ]);
      console.log(rowIndex+5, columnIndex*10);
    }
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
        <View style={styles.timeHeader}>
          <Text style={styles.timeLabel}>시</Text>
          {Array(6).fill().map((_, index) => (
            <Text key={index} style={styles.timeLabel}>
              {index * 10}
            </Text>
          ))}
        </View>
        {Array(18).fill().map((_, index) => renderTimeSlot(index))}
      </View>
    );
  };
  
  
  


  
  
  
  
  
  

const styles = StyleSheet.create({
  dayContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveContainer: {

  },
  dayText: {
    fontWeight: 'bold',
    fontSize: 25
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  timeHeader: {
    flexDirection: 'row',
    marginTop: 40,
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
    borderColor: 'white',
  },
  reservedSlot: {
    backgroundColor: '#515151',
  },
  availableSlot: {
    backgroundColor: '#d6d6d6',
  },
  slotText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ReserveScreen;