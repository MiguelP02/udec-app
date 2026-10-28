import { Pressable, View } from 'react-native';
import { Text } from './ui/text';

export type SegmentedOption = { key: string; label: string };

export type SegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (key: string) => void;
  accessibilityLabel?: string;
};

export function SegmentedControl({ options, value, onChange, accessibilityLabel }: SegmentedControlProps) {
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center rounded-card border border-udec-border bg-udec-surface p-1"
    >
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.key)}
            className={`min-h-[44px] flex-1 items-center justify-center rounded-control ${
              active ? 'bg-udec-background' : 'active:bg-udec-border'
            }`}
          >
            <Text weight={active ? 'bold' : 'medium'} className={`text-sm ${active ? 'text-udec-primary' : 'text-udec-muted'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
