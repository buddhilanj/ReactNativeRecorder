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
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

export default class App extends Component<{}> {

  constructor(props) {
    super(props)
    this.timer = { hour: 0, minute: 0, seconds: 0, running: false }
    this.state = {timer:this.timer, buttonImage:require('./record.png')};
  }


  onPress = () => {
    this.timer.running = !this.timer.running;
    if (!this.timer.running) {
      if (this._interval != null)
        clearInterval(this._interval);
      this.timer.hour = 0;
      this.timer.minute = 0;
      this.timer.seconds = 0;
      this.setState({timer:this.timer, buttonImage:require('./record.png')})
      
    }
    else {
      this.setState({timer:this.timer, buttonImage:require('./stop.png')});      
      this._interval = setInterval(() => {
        this.timer.seconds++;
        if (this.timer.seconds >= 60) {
          this.timer.seconds = 0;
          this.timer.minute++;
        }
        if (this.timer.minute >= 60) {
          this.timer.minute = 0;
          this.timer.hour++;
        }
        this.setState({timer:this.timer, buttonImage:require('./stop.png')});
      }, 1000);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bezel}>
          <View style={styles.bezelInner}>
            <View style={styles.clock}>
              <Text style={styles.number}>{this.state.timer.hour}</Text>
              <Text style={styles.indicator}>H</Text>
              <Text style={styles.number}>{this.state.timer.minute}</Text>
              <Text style={styles.indicator}>m</Text>
              <Text style={styles.number}>{this.state.timer.seconds}</Text>
              <Text style={styles.indicator}>s</Text>
            </View>
            <TouchableOpacity onPress={this.onPress}>
              <Image
                style={styles.button}
                source={this.state.buttonImage}
              />
            </TouchableOpacity>
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
    marginLeft: 10
  },
  indicator: {
    fontSize: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  record: {
    width: 100,
    height: 100,
    margin: 50
  }
});
