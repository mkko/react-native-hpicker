import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Platform,
} from 'react-native';

class HorizontalPickerItem extends Component {

  constructor(props) {
    super(props);
    this.state = intialState;
  }

  render() {
    return (<Text style={[styles.itemText, this.props.style]}>{this.props.label}</Text>);
  }
}

HorizontalPickerItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  style: View.propTypes.style,
};
HorizontalPickerItem.defaultProps = {};

const propTypes = {
  style: View.propTypes.style,
  selectedValue: PropTypes.string,
  children: PropTypes.array, // TODO: Make it HorizontalPicker.Item[]
  itemWidth: PropTypes.number, // TODO: Get rid of this at some point.
  onChange: PropTypes.func
};

const defaultProps = {
};

const intialState = {
  selectedItem: null,
  bounds: null,
  padding: {left: 0, right: 0}

};

class HorizontalPicker extends Component {

  constructor(props) {
    super(props);
    this.state = intialState;
    this.scrollX = 0;
    this.ignoreNextScroll = false;
  }

  static Item = HorizontalPickerItem

  getCurrentIndex = () => {
    const {itemWidth} = this.props;
    return Math.ceil(this.scrollX / itemWidth);
  }

  getIndexAt = (x) => {
    const {itemWidth} = this.props;
    const dx = this.state.bounds.width / 2 - this.state.padding.left;
    return Math.floor((x + dx) / itemWidth);
  }

  getChildren = () => React.Children.toArray(this.props.children);

  snap = (delta) => {

    // When using momentum and releasing the touch with
    // no velocity, scrollEndActive will be undefined (iOS)
    if (!this._scrollEndActive && this._scrollEndActive !== 0 && Platform.OS === 'ios') {
      this._scrollEndActive = this._scrollStartActive;
    }

    this.snapToItem(this.getCurrentIndex());
  }

  snapToItem = (index, animated = true, fireCallback = true, initial = false) => {
    console.log('snapToItem:', index);
    const itemsCount = this.props.children.length;

    if (!index) {
      index = 0;
    }

    if (index >= itemsCount) {
      index = itemsCount - 1;
      fireCallback = false;
    } else if (index < 0) {
      index = 0;
      fireCallback = false;
    } else if (index === this.state.oldItemIndex) {
      fireCallback = false;
    }

    const snapX = index * this.props.itemWidth;

    // Make sure the component hasn't been unmounted
    if (this._scrollview) {
      console.log('snap ->', snapX);
      this._scrollview.scrollTo({x: snapX, y: 0, animated });
      //this.props.onSnapToItem && fireCallback && this.props.onSnapToItem(index);
      this.setState({ oldItemIndex: index });

      // iOS fix
      if (!initial && Platform.OS === 'ios') {
        console.log('ignoreNextScroll');
        this.ignoreNextScroll = true;
      }
    }
  }

  handleScroll = (event) => {
    this.scrollX = event.nativeEvent.contentOffset.x;
    const index = this.getIndexAt(this.scrollX);
    const item = this.getChildren()[index];
    if (item && this.props.onChange) {
      this.props.onChange(item.props.value);
    }
  }

  onScrollBegin(event) {
    console.log('onScrollBegin');
    this.scrollStart = event.nativeEvent.contentOffset.x;
    this.ignoreNextScroll = false;
  }
  
  onScrollEnd = (event) => {
    if (this.ignoreNextScroll) {
      console.log('onScrollEndDrag, ignored');
      this.ignoreNextScroll = false;
      return;
    }
    console.log('onScrollEndDrag');
    const scrollEnd = event.nativeEvent.contentOffset.x;
    const delta = scrollEnd - this.scrollStart;

    //this.snap(delta);
  }

  onMomentumScrollBegin(event) {
    console.log('onMomentumScrollBegin');
  }

  renderChildren = (children) => {
    return children.map(this.renderChild);
  }

  renderChild = (child) => {
    console.log('child.value', child.value);
    return (
      <View key={child.value} style={{width: this.props.itemWidth}}>{child}</View>
    );
  }

  onLayout = (event) => {
    const {nativeEvent: {layout: {x, y, width, height}}} = event;
    //this.calculatePositions();
    // TODO: Also snap to item.
    const bounds = {width, height};
    const leftItemWidth = this.props.itemWidth;
    const rightItemWidth = this.props.itemWidth;
    const padding ={
      left: !bounds ? 0 : ((bounds.width - leftItemWidth) / 2),
      right: !bounds ? 0 : ((bounds.width - rightItemWidth) / 2)
    } 

    this.setState({
      bounds,
      padding
    });
    console.log('this.state.bounds', this.state.bounds);
  }

  calculatePositions = () => {
    const { itemWidth } = this.props;

    this.getChildren().map((item, index) => {
      const _index = this._getCustomIndex(index, props);
      this._positions[index] = {
        start: _index * itemWidth,
        end: _index * itemWidth + itemWidth
      };
    });
  }

  render() {
    const bounds = this.state.bounds;
    return (
      <View style={[this.props.style]}>
        <ScrollView
          ref={(scrollview) => { this._scrollview = scrollview; }}
          decelerationRate={'fast'}
          scrollEventThrottle={100}
          contentContainerStyle={{paddingLeft: this.state.padding.left, paddingRight: this.state.padding.right}}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          onScroll={this.handleScroll}
          onScrollBeginDrag={this.onScrollBegin}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onScrollEnd}
          onScrollEndDrag={this.onScrollEnd}
          onLayout={this.onLayout}
          style={{flex: 1, backgroundColor: 'cyan'}}>
          <View style={{flexDirection: 'row', backgroundColor: 'yellow'}}>
            {bounds && this.renderChildren(this.props.children)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  image: {
    flex: 1
  },
  touchArea: {
    flex: 1,
    alignSelf: 'stretch',
  },
  itemText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

HorizontalPicker.propTypes = propTypes;
HorizontalPicker.defaultProps = defaultProps;

export default HorizontalPicker;
