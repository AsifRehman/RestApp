import { useState } from 'react';
import { Button, SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
        <Text style={{ color: 'blue' }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 20 }}>Home Screen</Text>
      <TouchableOpacity
        style={[styles.button, isHovered && styles.buttonHovered]}
        onPress={() => navigation.navigate('Profile')}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      >
      <Text style={styles.buttonText}>Go to Jane's profile</Text>
    </TouchableOpacity>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginTop: '50%',
    padding: 10,
    backgroundColor: 'gray',
  },
  buttonHovered: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
});


export default HomeScreen;