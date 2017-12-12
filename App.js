/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bezel}>
          <View style={styles.bezelInner}>
            <View style={styles.clock}>
              <Text style={styles.number}>00</Text>
              <Text style={styles.indicator}>H</Text>
              <Text style={styles.number}>00</Text>
              <Text style={styles.indicator}>m</Text>
              <Text style={styles.number}>00</Text>
              <Text style={styles.indicator}>s</Text>
            </View>
            <Button 
              style={styles.record} 
              title="record"
              color= 'red'
              />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe5bf',
  },
  bezel: {
    width: 350,
    height: 350,
    justifyContent: "center",
    borderRadius: 350,
    alignItems: 'center',
    backgroundColor: 'lightblue'
  },
  bezelInner: {
    width: 330,
    height: 330,
    borderRadius: 300,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#ffe5bf'
  },
  clock: {
    width: 300,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  number: {
    fontSize: 40,
  },
  indicator: {
    fontSize: 15,
    marginRight: 20,
    marginBottom:10,
  },
  record:{
    width:200,
    height:200,
    borderRadius:100
  }
});
