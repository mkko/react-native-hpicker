import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Picker,
  View,
  Device
} from 'react-native';
import HorizontalPicker from './hpicker';

const initialState = {
  pickerValue: 4,
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
        <View style={styles.pickerContainer}>
          <HorizontalPicker
            style={styles.picker}
            itemWidth={70}
            selectedValue={this.state.pickerValue}
            foregroundColor='#999'
            onChange={this.update}>
            {this.state.items.map(this.renderItem)}
          </HorizontalPicker>
        </View>
        <Text style={styles.instructions}>
          Picker Value: {this.state.pickerValue}
        </Text>
        <View style={styles.pickerContainer2}>
          <Picker selectedValue={this.state.pickerValue}
              onValueChange={(itemValue, itemIndex) => {
                console.log('item', itemValue);
                this.setState({pickerValue: itemValue})
                }}>
              <Picker.Item label='1' value={1} />
              <Picker.Item label='2' value={2} />
              <Picker.Item label='3' value={3} />
          </Picker>
        </View>
        <Text style={styles.instructions}>
          Picker Value: {this.state.itemValue}
        </Text>
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
