// TodaySales.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

const SaleDetails = () => {
    const route = useRoute();
    const { vocNo } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/sal/' + vocNo);
            setData(response.data[0]);
            console.log(response.data[0])
        } catch (error) {
            console.log(vocNo)

            Alert.alert('Error', JSON.stringify(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (index) => {
        const updatedData = [...data.Trans];
        updatedData[index].isDeleted = 1;
        setData({ ...data, Trans: updatedData });
    };

    const handleQtyChange = (index, change) => {
        const updatedData = [...data.Trans];
        updatedData[index].PQty += change;
        updatedData[index].Qty += change;
        updatedData[index].NetAmount = updatedData[index].Qty * updatedData[index].Rate;

        if (updatedData.PType === 1 || updatedData.PType === 2) 
            updatedData.SCharges = (updatedData.reduce((sum, item) => sum + item.NetAmount, 0) * 7 / 100)?.toFixed(0);
        else
            updatedData.SCharges = 0;

        if (updatedData[index].Qty < 0) {
            updatedData[index].Qty = 0;
        }
        setData({ ...data, Trans: updatedData });
    };

    const handleSave = () => {
        api.put('/sal', data)
            .then(response => Alert.alert('Success', 'Sale details saved successfully'))
            .catch(error => Alert.alert('Error', JSON.stringify(error)));
        console.log(data);
    };


    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }
    const onRefresh = () => {
        setLoading(true);
        fetchData();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={data.Trans}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={onRefresh}
                refreshing={loading}
                ListHeaderComponent={() => (
                    <>
                        <View style={{ padding: 15 }}>
                            <Text>VocNo: {data.VocNo}</Text>
                            <Text>Date: {data.Date}</Text>
                            <Text>TblNo: {data.TblNo}</Text>
                            <Text>PType: {data.PType}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ flex: 4, fontWeight: 'bold' }}>Product</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Qty</Text>
                            <Text style={{ flex: 2, fontWeight: 'bold', textAlign: 'right' }}>Amount</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'right' }}>Act</Text>
                        </View>
                    </>
                )}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <Text style={{ flex: 4 }}>{item.ProdName}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text
                                style={{ color: item.Qty === 0 ? 'gray' : 'white', backgroundColor: 'red', padding: 10, borderRadius: 5, textAlign: 'center' }}
                                onPress={() => item.Qty > 0 && handleQtyChange(index, -1)}
                            >
                                -
                            </Text>
                            <Text style={{ marginHorizontal: 5 }}>{item.Qty}</Text>
                            <Text
                                style={{ color: 'white', backgroundColor: 'darkgreen', padding: 10, borderRadius: 5, textAlign: 'center' }}
                                onPress={() => handleQtyChange(index, 1)}
                            >
                                +
                            </Text>
                        </View>
                        <Text style={{ flex: 2, textAlign: 'right' }}>{item.NetAmount}</Text>
                        <Text style={{ flex: 1, color: 'red', textAlign: 'right' }} onPress={() => handleDelete(index)}>Del</Text>
                    </View>
                )}
                ListFooterComponent={() => {
                    const totalQty = data.Trans.reduce((sum, item) => sum + item.Qty, 0);
                    const totalNetAmount = data.Trans.reduce((sum, item) => sum + item.NetAmount, 0);
                    return (
                        <>
                            <View style={{ flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                <Text style={{ flex: 4, fontWeight: 'bold', fontSize: 16 }}>Total</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{totalQty}</Text>
                                <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 16, textAlign: 'right' }}>{totalNetAmount}</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}></Text>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                <Text style={{ flex: 4, fontWeight: 'bold', fontSize: 16 }}>SCharges</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}></Text>
                                <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 16, textAlign: 'right' }}>{data.SCharges || 0}</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}></Text>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                <Text style={{ flex: 4, fontWeight: 'bold', fontSize: 16 }}>G.Total</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}></Text>
                                <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 16, textAlign: 'right' }}>{totalNetAmount + (data.SCharges || 0)}</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}></Text>
                            </View>
                        </>
                    );
                }}
                
            />
            <View style={{ padding: 15 }}>
                <Text
                    style={{ backgroundColor: 'blue', color: 'white', padding: 15, textAlign: 'center', borderRadius: 5 }}
                    onPress={() =>  handleSave() }
                >
                    Save
                </Text>
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between' },
});

export default SaleDetails;
