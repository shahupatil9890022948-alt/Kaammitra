import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { log } from '../utils/logger';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Top-level crash guard. A render error anywhere below would otherwise leave a
 * blank white screen on device; instead we catch it, log it, and offer a
 * "Try again" that re-mounts the tree. Styling is intentionally hard-coded
 * (no theme/i18n) so the fallback still renders even if those layers threw.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown) {
    log.error('crash', 'Unhandled render error', error);
  }

  reset = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: '#FBF7F0', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🙏</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#241E17', textAlign: 'center' }}>
          Something went wrong
        </Text>
        <Text style={{ fontSize: 15, color: '#7A6F61', textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
          Your data is safe. Please try again.
        </Text>
        <Pressable
          onPress={this.reset}
          style={{ backgroundColor: '#E2640D', borderRadius: 999, paddingVertical: 14, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}
