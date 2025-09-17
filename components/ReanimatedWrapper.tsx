import React, { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

export interface ReanimatedWrapperProps extends ViewProps {
  children?: React.ReactNode;
}

export const ReanimatedWrapper = forwardRef<View, ReanimatedWrapperProps>(
  (props, ref) => {
    return <Animated.View ref={ref} {...props} />;
  }
);