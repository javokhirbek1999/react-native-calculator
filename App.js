import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';



const {width,height} = Dimensions.get('window')

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('')
  const [lastNumber, setLastNumber] = useState('');
  const [lastButtonPressed, setLastButtonPressed] = useState('');
  const buttons = ['C', 'DEL', '/', 7, 8, 9, '*', 4, 5, 6, '-', 1, 2, 3, '+', 0, '.', '='];

  const styles = StyleSheet.create({
    results: {
      backgroundColor: darkMode ? '#282f3b' : '#f5f5f5',
      maxWidth: '100%',
      minHeight: '35%',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    resultText: {
      maxHeight: 45,
      color: '#FF6666',
      margin: 15,
      fontSize: 35,
    },
    historyText: {
      color: darkMode ? '#B5B7BB' : '#7c7c7c',
      fontSize: 20,
      marginRight: 10,
      alignSelf: 'flex-end',
    },
    themeButton: {
      alignSelf: 'flex-start',
      bottom: '5%',
      margin: 15,
      backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    buttons: {
      width: '100%',
      height: '35%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      borderColor: darkMode ? '#3f4d5b' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24%',
      minHeight: '54%',
      flex: 2,
    },
    textButton: {
      color: darkMode ? '#b5b7bb' : '#7c7c7c',
      fontSize: 28,
    }
  })

  const handleInput = (btnPressed) => {

    btnPressed = btnPressed.toString()

    switch (btnPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.substring(0, (currentNumber.length - 1)))
        setLastButtonPressed(btnPressed)
        return
      case 'C':
        setLastNumber('');
        setCurrentNumber('');
        setLastButtonPressed(btnPressed)
        return
      case '=':
        setLastNumber(currentNumber);
        setLastButtonPressed(btnPressed)
        calculate()
        return;
    }
    
    if (lastButtonPressed === '=') {
      if (currentNumber.length > 0) {
        const lastChar = currentNumber[currentNumber.length-1]

        if (lastChar !== '+' && lastChar !== '/' && lastChar !== '*' && lastChar !== '.' && lastChar !== '-') {
          if (btnPressed !== '+' && btnPressed !== '/' && btnPressed !== '*' && btnPressed !== '.' && btnPressed !== '-') {
            setCurrentNumber(btnPressed)
          } else {
            setCurrentNumber(currentNumber + btnPressed)
          }
        }
      }
    
      setLastButtonPressed(btnPressed)

      return
    }

    if (currentNumber.length == 0) {
      if (btnPressed !== '+' && btnPressed !== '-' && btnPressed !== '*' && btnPressed !== '/' && btnPressed !== '=' && btnPressed !== '.' && btnPressed !== 'DEL' && btnPressed !== 'C') {
        setCurrentNumber(currentNumber + btnPressed)
      }
      return
    } else {

      const lastChar = currentNumber[currentNumber.length-1]

      if (lastChar === '+' || lastChar === '-' || lastChar === '/' || lastChar == '*') {
        if (btnPressed === '+' || btnPressed === '-' || btnPressed === '/' || btnPressed === '*') {
          setCurrentNumber(currentNumber.substring(0,currentNumber.length-1) + btnPressed)
        } else {
          setCurrentNumber(currentNumber + btnPressed)
          return
        }
      }

    }

    if (currentNumber.length == 0) {
      if (btnPressed !== '+' || btnPressed !== '-' || btnPressed !== '/' || btnPressed !== '*' || btnPressed !== '=' || btnPressed !== '.') {
        setCurrentNumber(currentNumber + btnPressed)
      }
    } else {

      const lastCharacter = currentNumber[currentNumber.length-1]

      if (lastCharacter === '+' || lastCharacter === '-' || lastCharacter === '/' || lastCharacter === '.' || lastCharacter === '*' || lastCharacter === '=') {
        if (btnPressed !== '+' && btnPressed !== '-' && btnPressed !== '*' && btnPressed !== '/' && btnPressed !== '=' && btnPressed !== '.') {
          setCurrentNumber(currentNumber + btnPressed)
        }
        return
      } else {
        // console.log(typeof btnPressed, typeof currentNumber)
        setCurrentNumber(currentNumber + btnPressed)
      }
    }
    
  }

  const calculate = () => {
    let lastArr = currentNumber[currentNumber.length - 1]
    if (lastArr === '/' || lastArr === '*' || lastArr === '-' || lastArr === '+' || lastArr === '.') {
      setCurrentNumber(currentNumber);
    }
    else {
      let result = eval(currentNumber).toString();
      setCurrentNumber(result);
      return;
    }
  }

  return (
    <View>
      <View style={styles.results}>
        <TouchableOpacity style={styles.themeButton}>
          <Icon name={darkMode ? 'light-up' : 'moon'} size={24}
            color={darkMode ? 'white' : 'black'}
            onPress={() => darkMode ? setDarkMode(false) : setDarkMode(true)}
          />
        </TouchableOpacity>
        <Text style={styles.historyText}>{lastNumber}</Text>
        <Text style={styles.resultText}>{currentNumber}</Text>
      </View>
      <View style={styles.buttons}>
        {buttons.map((btn) =>
          btn === '=' || btn === '/' || btn === '*' || btn === '-' || btn === '+' ?
            <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: '#FF6666' }]} onPress={() => handleInput(btn)}>
              <Text style={[styles.textButton, { color: 'white', fontSize: 28 }]}>{btn}</Text>
            </TouchableOpacity>
            : btn === 0 ?
              <TouchableOpacity key={btn} style={[styles.button, {
                backgroundColor: typeof (btn) === 'number' ?
                  darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed', minWidth: '36%'
              }]} onPress={() => handleInput(btn)}>
                <Text style={styles.textButton}>{btn}</Text>
              </TouchableOpacity>
              : btn === '.' || btn === 'DEL' ?
                <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: btn === '.' ? darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed', minWidth: '37%' }]}
                  onPress={() => handleInput(btn)}
                >
                  <Text style={styles.textButton}>{btn}</Text>
                </TouchableOpacity>
                : btn === 'C' ?
                  <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: typeof (btn) === 'number' ? darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed', minWidth: '36%' }]}
                    onPress={() => handleInput(btn)}
                  >
                    <Text style={styles.textButton}>{btn}</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity key={btn} style={[styles.button, { backgroundColor: typeof (btn) === 'number' ? darkMode ? '#303946' : '#fff' : darkMode === true ? '#414853' : '#ededed' }]}
                    onPress={() => handleInput(btn)}
                  >
                    <Text style={styles.textButton}>{btn}</Text>
                  </TouchableOpacity>

        )}
      </View>
    </View>
  )
}