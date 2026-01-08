import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { StreamdownRN } from '@nansen-ai/streamdown-rn';
import { debugComponentRegistry } from '@darkresearch/debug-components';
import { ListPickerScreen, ListType } from './screens/ListPickerScreen';
import { ChatTestScreen } from './screens/ChatTestScreen';

const WS_URL = 'ws://localhost:3001';

type AppMode =
  | { type: 'debugger' }
  | { type: 'list-picker' }
  | { type: 'chat-test'; listType: ListType };

// Note: Unistyles is configured in unistyles.config.ts (imported by index.js)

export default function App() {
  const [mode, setMode] = useState<AppMode>({ type: 'debugger' });
  const [content, setContent] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only connect to WebSocket in debugger mode
    if (mode.type !== 'debugger') return;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let hasConnectedOnce = false;

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          setConnected(true);
          if (!hasConnectedOnce) {
            console.log('Connected to debugger');
            hasConnectedOnce = true;
          }
        };

        ws.onclose = () => {
          setConnected(false);
          if (hasConnectedOnce) {
            console.log('Disconnected from debugger');
            hasConnectedOnce = false;
          }
          reconnectTimeout = setTimeout(connect, 1000);
        };

        ws.onerror = () => {
          setConnected(false);
        };

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            setContent(data.content || '');
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };
      } catch (error) {
        setConnected(false);
        reconnectTimeout = setTimeout(connect, 1000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [mode.type]);

  // List Picker Screen
  if (mode.type === 'list-picker') {
    return (
      <ListPickerScreen
        onSelect={(listType) => setMode({ type: 'chat-test', listType })}
        onBack={() => setMode({ type: 'debugger' })}
      />
    );
  }

  // Chat Test Screen
  if (mode.type === 'chat-test') {
    return (
      <ChatTestScreen
        listType={mode.listType}
        onBack={() => setMode({ type: 'list-picker' })}
      />
    );
  }

  // Default: Debugger Mode
  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <Text style={[styles.dot, connected && styles.dotConnected]}>●</Text>
        <Text style={styles.statusText}>
          {connected ? 'Connected to debugger' : 'Waiting for debugger...'}
        </Text>
        <Pressable
          onPress={() => setMode({ type: 'list-picker' })}
          style={styles.modeButton}
        >
          <Text style={styles.modeButtonText}>Test Chats</Text>
        </Pressable>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {content ? (
          <StreamdownRN componentRegistry={debugComponentRegistry}>
            {content}
          </StreamdownRN>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholder}>
              Waiting for content from web debugger...
            </Text>
            <Text style={styles.hint}>
              Or tap "Test Chats" to test list rendering
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingTop: UnistylesRuntime.insets.top,
    paddingBottom: UnistylesRuntime.insets.bottom,
  },
  statusBar: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.statusBg,
  },
  dot: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginRight: 8,
  },
  dotConnected: {
    color: theme.colors.connected,
  },
  statusText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  modeButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modeButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  placeholder: {
    color: theme.colors.placeholder,
    fontSize: 16,
    textAlign: 'center',
  },
  hint: {
    color: theme.colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
}));
