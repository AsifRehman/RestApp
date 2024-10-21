import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../api'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';

const ProductsScreen = () => {

  const route = useRoute();
  const { prodTypeId } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      try {
            const cri = prodTypeId > 0 ? `ProdTypeId=${prodTypeId}` : ""
          const response = await api.get(`/products/productslist?cri=${cri}`);
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
                <View style={styles.item} onTouchEnd={() => navigation.navigate('products', { ProdTypeId: item.value })}>
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


export default ProductsScreen