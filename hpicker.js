import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

const defaultForegroundColor = '#444';
const defaultItemWidth = 30;

const itemPropTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  style: View.propTypes.style,
  foregroundColor: PropTypes.string,
};
const itemDefaultProps = {
  foregroundColor: defaultForegroundColor,
};

class HorizontalPickerItem extends Component {

  constructor(props) {
    super(props);
    this.state = intialState;
  }
}

const propTypes = {
  style: View.propTypes.style,
  selectedValue: PropTypes.any,
  children: PropTypes.array, // TODO: Make it HorizontalPicker.Item[]
  itemWidth: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  renderOverlay: PropTypes.func,
  foregroundColor: PropTypes.string
};

const defaultProps = {
  foregroundColor: defaultForegroundColor,
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
    this.isScrolling = false;
    this.scrollX = -1;
    this.ignoreNextScroll = false;
    this.snapDelay = 200;
  }

  static Item = HorizontalPickerItem

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps (isScrolling:', this.isScrolling, ')', this.props.selectedValue, '->', nextProps.selectedValue);
    const valueChanged = this.props.selectedValue !== nextProps.selectedValue;

    const index = this.getIndexForValue(nextProps.selectedValue, nextProps.children);
    const previousIndex = this.getIndexForValue(this.props.selectedValue, this.props.children);
    const rangeChanged = index !== previousIndex;
    console.log('current index', index);
    console.log('previous index', previousIndex);

    console.log('x:', this.scrollX);
    console.log('current value:', nextProps.selectedValue);
    const visibleValue = this.getValueAt(this.scrollX);
    const visualsChanged = nextProps.selectedValue !== visibleValue;
    console.log('visible value:', visibleValue);

    console.log('valueChanged:', valueChanged);
    console.log('rangeChanged:', rangeChanged);
    console.log('visualsChanged:', visualsChanged);

    if (rangeChanged) {
      // The given children have changed
      this.onChange(nextProps.selectedValue);
    } else if (valueChanged) {
      this.scrollToIndex(index, true);
    } else if (!this.isScrolling && visualsChanged) {
      // Check if the current value is even possible.
      // If not, we don't know where to scroll, so ignore.
      const indexForSelectedValue = this.getIndexForValue(nextProps.selectedValue, nextProps.children);
      console.log('indexForSelectedValue', indexForSelectedValue);
      if (indexForSelectedValue !== -1) {
        this.scrollToIndex(indexForSelectedValue, true);
      }
    }
  }

  componentDidMount() {
    this.scrollToValue(this.props.selectedValue, false);
  }

  getItemWidth = () => this.props.itemWidth && this.props.itemWidth > 0
    ? this.props.itemWidth : defaultItemWidth;

  getComponentWidth = () =>
    this.state.bounds ? this.state.bounds.width : 0;

  getValueAt = (x) => {
    const child = this.getChildren()[this.getIndexAt(x)];
    return child ? child.props.value : null;
  }

  getIndexAt = (x) => {
    const dx = this.getComponentWidth() / 2 - this.state.padding.left;
    return Math.floor((x + dx) / this.getItemWidth());
  }

  getIndexForValue = (item, children = this.getChildren()) => {
    const index = children.findIndex(e => e.props.value === item);
    console.log('getIndexForValue, value:', item, 'index:', index);
    return index;
  }

  getChildren = (children = this.props.children) => React.Children.toArray(children);

  scrollToValue = (itemValue, animated = true) => {
    const index = this.getIndexForValue(itemValue);
    this.scrollToIndex(index, animated);
  }

  scrollToIndex = (index, animated = true, initial = false) => {
    // Just ditch the functional paradigms.
    var scrollIndexChanged = false;
    var nextIndex = index;
    if (index === null || index < 0) {
      nextIndex = 0;
      scrollIndexChanged = true;
    }

    const snapX = nextIndex * this.getItemWidth();
    // Make sure the component hasn't been unmounted
    if (this.refs.scrollview) {
      console.log('scroll ->', snapX);
      if (animated) {
        this.refs.scrollview.scrollTo({x: snapX, y: 0, animated});
      }

      if (scrollIndexChanged) {
        // TODO: Scroll to the item.
        //const valueAtIndex = this.getChildren()[nextIndex];
        //this.props.onChange(valueAtIndex);
      }

      // iOS fix
      if (!initial && Platform.OS === 'ios') {
        console.log('ignoreNextScroll');
        this.ignoreNextScroll = true;
      }
    }
  }

  onScroll = (event) => {
    // Sometimes onMomentumScrollBegin event seems to be missing and onMomentumScrollEnd
    // is sent twice. However, if we receive an onScroll after onMomentumScrollEnd, we
    // can assume that the momentum scroll is continued.
    this.isScrolling = true;
    this.scrollX = event.nativeEvent.contentOffset.x;
    //console.log('onScroll, x:', this.scrollX);
    this.cancelDelayedSnap();
  }

  onScrollBeginDrag = (event) => {
    //console.log('onScrollBeginDrag', this.scrollStart);
    this.isScrolling = true;
    this.scrollStart = event.nativeEvent.contentOffset.x;
    this.cancelDelayedSnap();
    this.ignoreNextScroll = false;
  }

  onScrollEndDrag = (/*event*/) => {
    //console.log('onScrollEnd');
    this.isScrolling = false;
    if (this.ignoreNextScroll) {
      //console.log('onScrollEnd, ignored');
      this.ignoreNextScroll = false;
      return;
    }
    this.delayedSnap();
  }

  onMomentumScrollBegin = (event) => {
    //console.log('onMomentumScrollBegin', event.nativeEvent);
    this.isScrolling = true;
    this.cancelDelayedSnap();
  }

  onMomentumScrollEnd = (/*event*/) => {
    //console.log('onMomentumScrollEnd');
    this.isScrolling = false;
    if (this.ignoreNextScroll) {
      //console.log('onMomentumScrollEnd, ignored');
      this.ignoreNextScroll = false;
      return;
    }
    this.delayedSnap();
  }

  delayedSnap = () => {
    console.log('delayedSnap, cancelling previous...');
    this.cancelDelayedSnap();
    console.log('scheduling the snap');
    console.log('delayedSnap');
    this.snapNoMomentumTimeout =
      setTimeout(() => {
        console.log('doing the snap');
        const index = this.getIndexAt(this.scrollX);
        const item = this.getChildren()[index];
        this.onChange(item.props.value);
        this.scrollToIndex(index);
      }, this.snapDelay);
  }

  cancelDelayedSnap = () => {
    if (this.snapNoMomentumTimeout) {
      console.log('cancelled the delayed snap');
      console.log('cancelDelayedSnap');
      clearTimeout(this.snapNoMomentumTimeout);
      this.snapNoMomentumTimeout = null;
    }
  }

  onChange = (itemValue) => {
    console.log('onChange', itemValue);
    if (this.props.onChange) {
      this.props.onChange(itemValue);
    }
  }

  handleItemPress = (value) => {
    return () => {
      if (value && this.props.onChange) {
        this.props.onChange(value);
      }
    };
  }

  renderChildren = (children) => {
    return children.map(this.renderChild);
  }

  renderChild = (child) => {
    const itemValue = child.props.value;
    const color = this.props.foregroundColor || defaultForegroundColor;
    return (
      <TouchableWithoutFeedback key={itemValue} onPress={v => this.handleItemPress(v)}>
        <View style={[styles.itemContainer, {width: this.getItemWidth()}]}>
          <Text style={[styles.itemText, child.props.style, {color}]}>{child.props.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  onLayout = (event) => {
    const {nativeEvent: {layout: {x, y, width, height}}} = event;
    const bounds = {width, height};
    const leftItemWidth = this.getItemWidth();
    const rightItemWidth = this.getItemWidth();
    const padding = {
      left: !bounds ? 0 : ((bounds.width - leftItemWidth) / 2),
      right: !bounds ? 0 : ((bounds.width - rightItemWidth) / 2)
    };

    this.setState({
      bounds,
      padding
    });

    const index = this.getIndexForValue(this.props.selectedValue);
    this.scrollToIndex(index, false);
  }

  renderDefaultOverlay = () => {
    const color = this.props.foregroundColor;
    return (
      <View style={{flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: color}} />
    );
  }

  getInitialContentOffset = () => {
    const index = this.getIndexForValue(this.props.selectedValue, this.props.children);
    const x = index * this.getItemWidth();
    return {x, y: 0};
  }

  render() {
    const bounds = this.state.bounds;
    const renderOverlay = this.props.renderOverlay || this.renderDefaultOverlay;
    return (
      <View style={[this.props.style]}>
        <ScrollView
          ref='scrollview'
          decelerationRate={'fast'}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingLeft: this.state.padding.left, paddingRight: this.state.padding.right}}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentOffset={this.getInitialContentOffset()}
          onScroll={this.onScroll}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onLayout={this.onLayout}
          style={this.scrollView}>
          <View style={styles.contentContainer}>
            {bounds && this.renderChildren(this.props.children)}
          </View>
        </ScrollView>
        <View style={styles.overlay} pointerEvents='none'>
          <View style={[{flex: 1, width: this.getItemWidth()}]}>
            {renderOverlay()}
          </View>
        </View>
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
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row'
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'yellow'
  },
  itemText: {
    fontSize: 20,
    textAlign: 'center'
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center'
  }
});

HorizontalPickerItem.propTypes = itemPropTypes;
HorizontalPickerItem.defaultProps = itemDefaultProps;

HorizontalPicker.propTypes = propTypes;
HorizontalPicker.defaultProps = defaultProps;

export default HorizontalPicker;
