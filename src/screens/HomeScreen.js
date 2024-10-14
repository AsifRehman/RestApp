import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Use Ionicons from react-native-vector-icons

const HomeScreen = ({ navigation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Control menu visibility

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value) {
        console.log('user login');
      } else {
        console.log('user not login');
        navigation.navigate('Login');
      }
    } catch (e) {
      console.log('error reading value', e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={32} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Home Screen</Text>

        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Icon name="ellipsis-vertical" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menu}>
            <Pressable
              onPress={() => {
                setIsMenuVisible(false);
                navigation.navigate('TodaySales');
              }}
            >
              <Text style={styles.menuItem}>Today's Sales</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.button, isHovered && styles.buttonHovered]}
        onPress={() => navigation.navigate('Profile')}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
      >
        <Text style={styles.buttonText}>GO TO MENU</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonHovered, { marginTop: 20 }]}
        onPress={() => navigation.navigate('Blue')}
      >
        <Text style={styles.buttonText}>GO TO BLUE SCREEN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    fontSize: 24,
    alignSelf: 'center',
    marginTop: '50%',
    padding: 50,
    backgroundColor: 'gray',
  },
  buttonHovered: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    backgroundColor: 'white',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default HomeScreen;
