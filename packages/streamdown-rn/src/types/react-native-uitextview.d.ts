/**
 * Type declarations for react-native-uitextview
 */

declare module 'react-native-uitextview' {
  import { ComponentType, ReactNode } from 'react';
  import { TextProps } from 'react-native';

  export interface UITextViewProps extends TextProps {
    /** Enable text selection */
    selectable?: boolean;
    /** Use native UITextView on iOS for proper partial text selection */
    uiTextView?: boolean;
    /** Explicit text color (UITextView may not inherit from style.color) */
    textColor?: string;
    children?: ReactNode;
  }

  export const UITextView: ComponentType<UITextViewProps>;
}
