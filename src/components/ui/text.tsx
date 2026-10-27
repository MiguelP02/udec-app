import { Text as NativeText, type TextProps } from 'react-native';
import { fonts, type FontWeight } from '../../theme';

type Props = TextProps & { weight?: FontWeight };

export function Text({ weight = 'regular', style, ...props }: Props) {
  return <NativeText style={[{ fontFamily: fonts[weight] }, style]} {...props} />;
}
