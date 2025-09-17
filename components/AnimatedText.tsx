import React, { forwardRef } from 'react';
import { Text, TextProps } from 'react-native';
import Animated from 'react-native-reanimated';

export interface AnimatedTextProps extends TextProps {
  children?: React.ReactNode;
}

export const AnimatedText = forwardRef<Text, AnimatedTextProps>(
  (props, ref) => {
    return <Animated.Text ref={ref} {...props} />;
  }
);