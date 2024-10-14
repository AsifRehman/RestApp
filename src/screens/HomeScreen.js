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
});


export default HomeScreen;