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
  PermissionsAndroid,
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

export default class App extends Component {

  timer = { 
    hour: 0, 
    minute: 0, 
    seconds: 0, 
    running: false 
  }

  state = {
    timer: this.timer,
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    finished: false,
    audioPath: AudioUtils.DocumentDirectoryPath + '/rctnrec_',
    hasPermission: undefined,
    buttonImage:require('./record.png')
  };


  constructor(props) {
    super(props);
  }

  prepareRecordingPath(audioPath){
    audioPath = audioPath+Date.now()+".aac";
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }

  componentDidMount() {
    this._checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
    });
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'AudioExample needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  async _stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
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
      this._stop();
    }
    else {
      this._record();
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
