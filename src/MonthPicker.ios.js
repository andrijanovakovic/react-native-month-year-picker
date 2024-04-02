import invariant from 'invariant';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNMonthPickerView from './RNMonthPickerNativeComponent';
import {
  ACTION_DATE_SET,
  ACTION_DISMISSED,
  DEFAULT_MODE,
  NATIVE_FORMAT,
} from './constants';

const { width, height } = Dimensions.get('screen');

const BORDER_RADIUS = 13;
const ANIMATION_DURATION = 300;
const UNDERLAY_COLOR = '#ebebeb';
const BUTTON_HEIGHT = 57;

const MonthPicker = ({
  isVisible,
  value,
  minimumDate,
  maximumDate,
  onChange: onAction,
  locale = '',
  mode = DEFAULT_MODE,
  autoTheme = true,
  confirmTextIOS = 'Confirm',
  cancelTextIOS = 'Cancel',
}) => {
  invariant(value, 'value prop is required!');

  const [opacity] = useState(new Animated.Value(0));
  const [selectedDate, setSelectedDate] = useState(value);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isVisible) {
      slideIn();
    }
  }, [isVisible]);

  const onChangeInternal = useCallback(
    ({ nativeEvent: { newDate } }) =>
      setSelectedDate(moment(newDate, NATIVE_FORMAT).toDate()),
    [],
  );

  const slideIn = useCallback(
    callback =>
      Animated.timing(opacity, {
        easing: Easing.inOut(Easing.quad),
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }).start(callback),
    [],
  );

  const slideOut = useCallback(
    callback =>
      Animated.timing(opacity, {
        easing: Easing.inOut(Easing.quad),
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }).start(callback),
    [],
  );

  const onDone = useCallback(() => {
    slideOut(() => onAction(ACTION_DATE_SET, selectedDate));
  }, [selectedDate]);

  const onCancel = useCallback(() => {
    slideOut(() => onAction(ACTION_DISMISSED, undefined));
  }, []);

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
          },
        ]}>
        <View style={[styles.safeArea, { marginBottom: insets.bottom || 10 }]}>
          <View style={styles.dismissArea} onTouchEnd={onCancel} />
          {/* Picker container */}
          <Animated.View
            style={{
              transform: [
                {
                  translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
              ],
            }}>
            <View style={styles.pickerContainer}>
              {/* Picker */}
              <RNMonthPickerView
                {...{
                  locale,
                  mode,
                  onChange: onChangeInternal,
                  onDone,
                  onCancel,
                  autoTheme,
                }}
                style={styles.picker}
                value={value.getTime()}
                minimumDate={minimumDate?.getTime() ?? null}
                maximumDate={maximumDate?.getTime() ?? null}
              />

              {/* Confirm button */}
              <TouchableHighlight
                style={styles.confirmButton}
                underlayColor={UNDERLAY_COLOR}
                onPress={onDone}>
                <Text style={styles.confirmText}>{confirmTextIOS}</Text>
              </TouchableHighlight>
            </View>

            {/* Cancel button */}
            <TouchableHighlight
              style={styles.cancelButton}
              underlayColor={UNDERLAY_COLOR}
              onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelTextIOS}</Text>
            </TouchableHighlight>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default MonthPicker;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginBottom: 10,
  },
  dismissArea: { flex: 1 },
  container: {
    flex: 1,
    width,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerContainer: {
    width: width - 20,
    height: 278,
    margin: 10,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
  },
  confirmButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#d5d5d5',
    backgroundColor: '#fff',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
  },
  confirmText: {
    textAlign: 'center',
    color: '#007ff9',
    fontSize: 20,
    backgroundColor: 'transparent',
  },
  cancelButton: {
    width: width - 20,
    marginHorizontal: 10,
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#fff',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
  },
  cancelText: {
    textAlign: 'center',
    color: '#007ff9',
    fontSize: 20,
    fontFamily: 'Inter600',
    backgroundColor: 'transparent',
  },
});
