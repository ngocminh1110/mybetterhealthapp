import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fontSize } from '@/theme';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption';

interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
  bold?: boolean;
  color?: string;
}

export function AppText({ variant = 'body', muted, bold, color, style, ...rest }: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        muted && styles.muted,
        bold && styles.bold,
        color ? { color } : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { color: colors.text, fontSize: fontSize.body },
  display: { fontSize: fontSize.display, fontWeight: '700' },
  title: { fontSize: fontSize.title, fontWeight: '700' },
  subtitle: { fontSize: fontSize.subtitle, fontWeight: '600' },
  body: { fontSize: fontSize.body, lineHeight: 21 },
  caption: { fontSize: fontSize.caption },
  muted: { color: colors.textMuted },
  bold: { fontWeight: '700' },
});
