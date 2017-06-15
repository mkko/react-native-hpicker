# react-native-hpicker

`<HorizontalPicker/>` is a horizontally scrolling picker component. The goal of this component is to be a drop-in replacement for the bundled `<Picker/>`, but to introduce a nicer and more compact layout.

## Installation

You install the picker by running `npm install --save react-native-hpicker`. Then, simply import the component: `import HorizontalPicker from 'react-native-hpicker';` and you're good to go.

## Example

```
import HorizontalPicker from 'react-native-hpicker';

/* ... */

<HorizontalPicker
  style={/* Whatever you want */}
  itemWidth={70}
  selectedValue={this.state.pickerValue}
  foregroundColor='gray'
  onChange={(pickerValue) => this.setState({pickerValue})}>
  <HorizontalPicker.Item label={1} value={1} />
  <HorizontalPicker.Item label={2} value={2} />
  <HorizontalPicker.Item label={3} value={3} />
</HorizontalPicker>

```

## Component properties

**TODO:** List the props here.

## TODOs

- Make it jump to the specified value by tapping
- Improve docs
- Add tests
