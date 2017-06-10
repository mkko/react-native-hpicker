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
    snapDelay = 100;
  }

  static Item = HorizontalPickerItem

  getIndexAt = (x) => {
    const {itemWidth} = this.props;
    const dx = this.state.bounds.width / 2 - this.state.padding.left;
    return Math.floor((x + dx) / itemWidth);
  }

  getChildren = () => React.Children.toArray(this.props.children);

  snap = () => {
    const index = this.getIndexAt(this.scrollX);
    this.snapToItem(index);
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
      console.log('--------');
      console.log('! SNAP ! ->', snapX);
      console.log('--------');
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

  onScroll = (event) => {
    this.scrollX = event.nativeEvent.contentOffset.x;
    const index = this.getIndexAt(this.scrollX);
    const item = this.getChildren()[index];
    console.log('onScroll', index);
    if (item && this.props.onChange) {
      this.props.onChange(item.props.value);
    }
    this.cancelDelayedSnap();
  }

  onScrollBegin = (event) => {
    this.scrollStart = event.nativeEvent.contentOffset.x;
    this.cancelDelayedSnap();
    this.ignoreNextScroll = false;
    console.log('onScrollBegin', this.scrollStart);
  }
  
  onScrollEndDrag = (event) => {
    if (this.ignoreNextScroll) {
      console.log('onScrollEnd, ignored');
      this.ignoreNextScroll = false;
      return;
    }
    //const scrollEnd = event.nativeEvent.contentOffset.x;
    // const scrollDirection = Math.sign(scrollEnd - this.scrollStart);
    console.log('onScrollEnd');
    this.delayedSnap();
  }

  onMomentumScrollBegin = (event) => {
    console.log('onMomentumScrollBegin', event.nativeEvent);
    this.cancelDelayedSnap();
    console.log('..');
  }

  onMomentumScrollEnd = (event) => {
    if (this.ignoreNextScroll) {
      console.log('onMomentumScrollEnd, ignored');
      this.ignoreNextScroll = false;
      return;
    }
    this.delayedSnap();
  }

  delayedSnap = (item) => {
    console.log('delayedSnap, cancelling previous...');
    this.cancelDelayedSnap();
    console.log('delayedSnap');
    this.snapNoMomentumTimeout =
      setTimeout(() => {
        console.log('snap');
        this.snap();
      }, this.snapDelay);
  }

  cancelDelayedSnap = () => {
    if (this.snapNoMomentumTimeout) {
      console.log('cancelDelayedSnap');
      clearTimeout(this.snapNoMomentumTimeout);
    }
  }

  renderChildren = (children) => {
    return children.map(this.renderChild);
  }

  renderChild = (child) => {
    return (
      <View key={child.props.value} style={{width: this.props.itemWidth}}>{child}</View>
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
          scrollEventThrottle={16}
          contentContainerStyle={{paddingLeft: this.state.padding.left, paddingRight: this.state.padding.right}}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          onScroll={this.onScroll}
          onScrollBeginDrag={this.onScrollBegin}
          onScrollEndDrag={this.onScrollEndDrag}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
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
