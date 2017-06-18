import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Picker,
  View,
  Device
} from 'react-native';
import HorizontalPicker from 'react-native-hpicker';

const initialState = {
  pickerValue: 0,
  picker2Value: 1,
  picker3Value: 2,
  items: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
}

export default class PickerExample extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  update = (pickerValue) => {
    this.setState({pickerValue});
  }

  renderItem = (item) => {
    const isSelected = item == this.state.pickerValue;
    const style = {}; //isSelected ? {backgroundColor: 'orange'} : {};
    return (
      <HorizontalPicker.Item key={item} label={`${item}`} value={item} style={{height: 50}}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Horizontal Picker Example
        </Text>

        <Text style={styles.instructions}>
          The default style
        </Text>
        <View style={styles.pickerContainer}>
          <HorizontalPicker
            style={styles.picker}
            itemWidth={70}
            selectedValue={this.state.pickerValue}
            onChange={this.update}>
            {this.state.items.map(item =>
              <HorizontalPicker.Item key={item} label={`${item}`} value={item}/>
            )}
          </HorizontalPicker>
        </View>

        <Text style={styles.instructions}>
          Different color
        </Text>
        <View style={styles.pickerContainer}>
          <HorizontalPicker
            style={styles.picker}
            itemWidth={70}
            selectedValue={this.state.picker2Value}
            foregroundColor='pink'
            onChange={i => this.setState({picker2Value: i})}>
            {this.state.items.map(item =>
              <HorizontalPicker.Item key={item} label={`${item}`} value={item}/>
            )}
          </HorizontalPicker>
        </View>

        <Text style={styles.instructions}>
          Different style
        </Text>
        <View style={styles.pickerContainer}>
          <HorizontalPicker
            style={styles.picker}
            itemWidth={70}
            selectedValue={this.state.picker3Value}
            onChange={i => this.setState({picker3Value: i})}
            foregroundColor='pink'>
            {this.state.items.map(item =>
              <HorizontalPicker.Item key={item} label={`${item}`} value={item} style={{height: 50}}/>
            )}
          </HorizontalPicker>
        </View>

        <Text style={styles.instructions}>
          Original picker
        </Text>
        <View style={styles.pickerContainer2}>
          <Picker selectedValue={this.state.pickerValue}
              onValueChange={(itemValue, itemIndex) => {
                console.log('item', itemValue);
                this.setState({pickerValue: itemValue})
                }}>
              {this.state.items.map(item =>
                <Picker.Item key={item} label={`${item}`} value={item}/>
              )}
          </Picker>
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
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection:'row'
  },
  pickerContainer2: {
    height: 200,
    width: 200
  },
  picker: {
    flex: 1,
  }
});
