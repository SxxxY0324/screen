// taro-ui.d.ts
// 为Taro UI组件添加额外的类型声明

declare module 'taro-ui' {
  import { ComponentClass, Component } from 'react';
  import { StandardProps } from '@tarojs/components/types/common';

  // AtList组件
  export interface AtListProps extends StandardProps {
    hasBorder?: boolean;
  }

  // AtListItem组件
  export interface AtListItemProps extends StandardProps {
    title: string;
    note?: string;
    thumb?: string;
    arrow?: 'up' | 'down' | 'right';
    extraText?: string;
    disabled?: boolean;
    hasBorder?: boolean;
    onClick?: (event) => void;
  }

  // AtSearchBar组件
  export interface AtSearchBarProps extends StandardProps {
    value: string;
    placeholder?: string;
    maxLength?: number;
    fixed?: boolean;
    focus?: boolean;
    disabled?: boolean;
    showActionButton?: boolean;
    actionName?: string;
    onChange: (value: string, event) => void;
    onFocus?: (event) => void;
    onBlur?: (event) => void;
    onConfirm?: (event) => void;
    onActionClick?: (event) => void;
    onClear?: (event) => void;
  }

  // AtButton组件
  export interface AtButtonProps extends StandardProps {
    size?: 'normal' | 'small';
    type?: 'primary' | 'secondary';
    circle?: boolean;
    full?: boolean;
    loading?: boolean;
    disabled?: boolean;
    onClick?: (event) => void;
  }

  // AtCard组件
  export interface AtCardProps extends StandardProps {
    title?: string;
    note?: string;
    extra?: string;
    thumb?: string;
    isFull?: boolean;
    onClick?: (event) => void;
  }

  // AtDivider组件
  export interface AtDividerProps extends StandardProps {
    content?: string;
    height?: number;
    fontColor?: string;
    fontSize?: number;
    lineColor?: string;
  }

  // AtGrid组件
  export interface AtGridItem {
    image?: string;
    value?: string;
    iconInfo?: {
      prefixClass?: string;
      value?: string;
      size?: number;
      color?: string;
    };
  }

  export interface AtGridProps extends StandardProps {
    data: AtGridItem[];
    columnNum?: number;
    hasBorder?: boolean;
    mode?: 'square' | 'rect';
    onClick?: (item: AtGridItem, index: number) => void;
  }

  // 声明组件类型
  export const AtList: ComponentClass<AtListProps>;
  export const AtListItem: ComponentClass<AtListItemProps>;
  export const AtSearchBar: ComponentClass<AtSearchBarProps>;
  export const AtButton: ComponentClass<AtButtonProps>;
  export const AtCard: ComponentClass<AtCardProps>;
  export const AtDivider: ComponentClass<AtDividerProps>;
  export const AtGrid: ComponentClass<AtGridProps>;
} 