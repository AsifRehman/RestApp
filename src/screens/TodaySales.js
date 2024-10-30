import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Animated, RefreshControl, TouchableOpacity, BackHandler } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import api from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const TodaySales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const fetchData = async (sDate = startDate, eDate = endDate) => {
    try {
      const formattedStartDate = sDate.toISOString().split('T')[0];
      const formattedEndDate = eDate.toISOString().split('T')[0];
      console.log("`/stk/salsum?sdate=${formattedStartDate}&edate=${formattedEndDate}&orderby=VocNo`", `/stk/salsum?sdate=${formattedStartDate}&edate=${formattedEndDate}&orderby=VocNo`);
      const response = await api.get(`/stk/salsum?sdate=${formattedStartDate}&edate=${formattedEndDate}&orderby=VocNo`);
      setData(response?.data?.table || []);
      console.log("response.data.table", response?.data?.table);
    } catch (error) {
      console.log("error", error);
      
      // Alert.alert('Error', JSON.stringify(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    fetchData();  
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    fetchData(currentDate, endDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    fetchData(startDate, currentDate);
  };

  const showStartDatePicker = () => {
    DateTimePickerAndroid.open({ value: startDate || new Date(), onChange: onChangeStartDate, mode: 'date', is24Hour: true });
  };

  const showEndDatePicker = () => {
    DateTimePickerAndroid.open({ value: endDate || new Date(), onChange: onChangeEndDate, mode: 'date', is24Hour: true });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>Today Sales</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={showStartDatePicker}>
                <Text style={styles.dateButtonText}>{startDate.toISOString().split('T')[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateButton} onPress={showEndDatePicker}>
                <Text style={styles.dateButtonText}>{endDate.toISOString().split('T')[0]}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Invoice</Text>
              <Text style={styles.headerText}>Table No</Text>
              <Text style={styles.headerText}>Product</Text>
              <Text style={styles.headerText}>Price</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Animated.View style={[styles.item, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} onTouchEnd={() => navigation.navigate('HomeStack', {
            screen: 'SaleDetails',
            params: { vocNo: item.VocNo },
          })}>
            <Text style={styles.cellText}>{item.VocNo}</Text>
            <Text style={styles.cellText}>{item.TblNo}</Text>
            <Text style={styles.cellText}>{item.CntProds} Product(s)</Text>
            <Text style={styles.cellText}>{item.NetAmount}</Text>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff3d00',
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateButtonText: {
    color: '#ff3d00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3d00',
    flex: 1,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
  },
  cellText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
});

export default TodaySales;
