import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Picker,
  View,
  ScrollView,
  Device
} from 'react-native';
import HorizontalPicker from 'react-native-hpicker';

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return index + start;  
  });
};

const initialState = {
  pickerValue: 5,
  picker2Value: 'e',
  picker3Value: 5,
  dynamicPickerValue: 0,
  items: range(0, 10),
  letters: ['a','b','c','d','e','f','g','h','i','j','k','l','m'],
  dynamicPickerMinValue: 0,
  dynamicPickerMaxValue: 9,
  dynamicItems: range(0, 9),
};

export default class PickerExample extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  updateDynamic = (newState) => {
    const nextState = {...this.state, ...newState};
    const dynamicPickerMaxValue = Math.max(nextState.dynamicPickerMinValue, nextState.dynamicPickerMaxValue);
    const dynamicItems = range(nextState.dynamicPickerMinValue, dynamicPickerMaxValue);
    this.setState({...newState, dynamicItems});
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
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Horizontal Picker Examples
          </Text>

          <Text style={styles.header}>
            The default style
          </Text>
          <View style={styles.pickerContainer}>
            <HorizontalPicker
              style={styles.picker}
              itemWidth={70}
              selectedValue={this.state.pickerValue}
              onChange={i => this.setState({pickerValue: i})}>
              {this.state.items.map(item =>
                <HorizontalPicker.Item key={item} label={`${item}`} value={item}/>
              )}
            </HorizontalPicker>
          </View>

          <Text style={styles.header}>
            Different color
          </Text>
          <View style={styles.pickerContainer}>
            <HorizontalPicker
              style={styles.picker}
              itemWidth={70}
              selectedValue={this.state.picker2Value}
              foregroundColor='pink'
              onChange={i => this.setState({picker2Value: i})}>
              {this.state.letters.map(item =>
                <HorizontalPicker.Item key={item} label={`${item}`} value={item}/>
              )}
            </HorizontalPicker>
          </View>

          <Text style={styles.header}>
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

          <Text style={styles.header}>
            A dynamic example
          </Text>
          <View style={styles.dynamicPickerContainer}>
            <HorizontalPicker
              style={styles.dynamicPicker}
              itemWidth={70}
              selectedValue={this.state.dynamicPickerValue}
              onChange={i => this.setState({dynamicPickerValue: i})}>
              {this.state.dynamicItems.map(item =>
                <HorizontalPicker.Item key={item} label={`${item}`} value={item}/>
              )}
            </HorizontalPicker>
          </View>
          <View style={styles.dynamicControlsContainer}>
            <Picker
                style={styles.dynamicControl}
                selectedValue={this.state.dynamicPickerMinValue}
                onValueChange={(itemValue) => this.updateDynamic({dynamicPickerMinValue: itemValue})}>
                {this.state.items.map(item =>
                  <Picker.Item key={item} label={`${item}`} value={item}/>
                )}
            </Picker>
            <Picker
                style={styles.dynamicControl}
                selectedValue={this.state.dynamicPickerValue}
                onValueChange={(itemValue) => this.updateDynamic({dynamicPickerValue: itemValue})}>
                {this.state.items.map(item =>
                  <Picker.Item key={item} label={`${item}`} value={item}/>
                )}
            </Picker>
            <Picker
                style={styles.dynamicControl}
                selectedValue={this.state.dynamicPickerMaxValue}
                onValueChange={(itemValue) => this.updateDynamic({dynamicPickerMaxValue: itemValue})}>
                {this.state.items.map(item =>
                  <Picker.Item key={item} label={`${item}`} value={item}/>
                )}
            </Picker>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#F5FCFF',
  },
  container: {
    marginTop: 100,
    marginBottom: 100,
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
  header: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection:'row',
    marginBottom: 40
  },
  dynamicPickerContainer: {
    flexDirection:'row'
  },
  dynamicPicker: {
    height: 50
  },
  dynamicControlsContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 200
  },
  dynamicControl: {
    flex: 1
  },
  picker: {
    flex: 1,
  }
});
