import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentNumber, setCurrentNumber] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [lastButtonPressed, setLastButtonPressed] = useState('');
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCalculation, setNewCalculation] = useState(false); // Track if the last button pressed was =

  const buttons = [
    'C', 'DEL', 'π', 'x^2',
    7, 8, 9, '/',
    4, 5, 6, '*',
    1, 2, 3, '-',
    0, '.', '=', '+',
    'HISTORY' // Add the history button
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    results: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      padding: 20,
      width: '100%',
    },
    resultText: {
      color: '#000000',
      fontSize: 40,
    },
    historyText: {
      color: '#7c7c7c',
      fontSize: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      backgroundColor: '#e6e6e6',
      margin: width * 0.02,
    },
    longButton: {
      width: width * 0.44 + width * 0.04, // Span the width of two normal buttons plus margin
      height: width * 0.2,
      borderRadius: width * 0.1,
      backgroundColor: '#FF6666', // Same color as C and DEL
      margin: width * 0.02,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 28,
      color: '#000000',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      backgroundColor: '#FF6666',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    historyItem: {
      fontSize: 18,
      marginVertical: 5,
    },
  });

  const handleInput = (btnPressed) => {
    btnPressed = btnPressed.toString();
  
    switch (btnPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1));
        setLastButtonPressed(btnPressed);
        setNewCalculation(false);
        break;
      case 'C':
        setLastNumber('');
        setCurrentNumber('');
        setLastButtonPressed(btnPressed);
        setNewCalculation(false);
        break;
      case '=':
        setLastNumber(currentNumber);
        setLastButtonPressed(btnPressed);
        calculate();
        setNewCalculation(true);
        break;
      case 'x^2':
        setCurrentNumber((prev) => (Math.pow(parseFloat(prev), 2)).toString());
        setLastButtonPressed(btnPressed);
        setNewCalculation(true);
        break;
      case 'π':
        setCurrentNumber((prev) => prev + Math.PI.toString());
        setLastButtonPressed(btnPressed);
        setNewCalculation(false);
        break;
      case 'HISTORY':
        setModalVisible(true);
        break;
      default:
        if (newCalculation && !isNaN(btnPressed)) {
          setCurrentNumber(btnPressed);
          setNewCalculation(false);
        } else {
          // Check if the last button pressed was an operator
          const lastButtonIsOperator = ['/', '*', '-', '+'].includes(lastButtonPressed);
          if (lastButtonIsOperator && ['/', '*', '-', '+'].includes(btnPressed)) {
            // Replace the previous operator with the new one
            setCurrentNumber((prev) => prev.substring(0, prev.length - 1) + btnPressed);
          } else {
            setCurrentNumber((prev) => prev + btnPressed);
          }
        }
        setLastButtonPressed(btnPressed);
        if (['/', '*', '-', '+'].includes(btnPressed)) {
          setNewCalculation(false);
        }
        break;
    }
  };
  

  const calculate = () => {
    let lastArr = currentNumber[currentNumber.length - 1];
    if (['/', '*', '-', '+', '.'].includes(lastArr)) {
      setCurrentNumber(currentNumber);
    } else {
      let result = eval(currentNumber).toString();
      setHistory((prevHistory) => [...prevHistory, `${currentNumber} = ${result}`]);
      setCurrentNumber(result);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.results}>
        <Text style={styles.historyText}>{lastNumber}</Text>
        <Text style={styles.resultText}>{currentNumber}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {buttons.map((btn, index) => {
          const isOperationButton = ['/', '*', '-', '+', 'π', 'x^2'].includes(btn);
          return (
            <TouchableOpacity
              key={index}
              style={[
                btn === 'HISTORY' ? styles.longButton : styles.button,
                btn === 'C' || btn === 'DEL' || btn === '=' || btn === 'HISTORY' ? { backgroundColor: '#FF6666' } : null,
                isOperationButton ? { backgroundColor: '#FFA500' } : null // Orange color for operation buttons
              ]}
              onPress={() => handleInput(btn)}
            >
              <Text style={[
                styles.buttonText,
                btn === 'C' || btn === 'DEL' || btn === '=' || btn === 'HISTORY' ? { color: '#ffffff' } : null
              ]}>
                {btn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <ScrollView>
            {history.map((item, index) => (
              <Text key={index} style={styles.historyItem}>{item}</Text>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
