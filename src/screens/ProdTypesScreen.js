import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../api'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ProdTypesScreen = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const fetchData = async () => {
      try {
          const response = await api.get('/prodtype/prodtypeslist');
          setData(response.data);
          console.log(response.data)
      } catch (error) {
          Alert.alert('Error', JSON.stringify(error));
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView>
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.item} onTouchEnd={() => navigation.navigate('products', { prodTypeId: item.value })}>
                    <Text style={styles.item}>{item.label}</Text>
                </View>
            )}
        />
      
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { color: 'black', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between' },
  netAmount: { fontWeight: 'bold', fontSize: 16, color: 'green' },
});


export default ProdTypesScreen