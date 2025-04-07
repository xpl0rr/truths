import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, ...otherProps }: ThemedViewProps) {
  // Always use light theme
  const backgroundColor = lightColor || '#ffffff';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
