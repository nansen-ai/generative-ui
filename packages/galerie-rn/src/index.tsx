import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export interface CanvasProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

export const Canvas = ({ width, height, children }: CanvasProps) => {
  return (
    <ScrollView 
      horizontal 
      contentContainerStyle={{ width: width || 2000, height: height || 2000 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ width: width || 2000, height: height || 2000 }}>
        <View style={[styles.canvas, { width, height }]}>
          {children}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    backgroundColor: '#f5f5f5',
    position: 'relative',
  }
});

export const CanvasComponent = ({ x, y, width, height, children }: { x: number, y: number, width: number, height: number, children: React.ReactNode }) => {
  return (
    <View style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      overflow: 'hidden',
    }}>
      {children}
    </View>
  );
};
