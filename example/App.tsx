import * as ExpoLeaflet from 'expo-leaflet';
import { ExpoLeafletView } from 'expo-leaflet';
import { Button, SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react'; // Make sure this is imported

const TypedExpoLeafletView = ExpoLeafletView as React.ComponentType<any>;

export default function App() {
  const [changeValue, setChangeValue] = useState<string>(''); // Add state

  useEffect(() => {
    const subscription = ExpoLeaflet.addListener('onChange', (event: any) => {
      setChangeValue(event.value);
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Constants">
          <Text>{ExpoLeaflet.PI ?? 'PI constant not available'}</Text>
        </Group>
        <Group name="Functions">
          <Text>{ExpoLeaflet.hello?.() ?? 'hello function not available'}</Text>
        </Group>
        <Group name="Async functions">
          <Button
            title="Set value"
            onPress={async () => {
              await ExpoLeaflet.setValueAsync?.('Hello from JS!');
            }}
          />
        </Group>
        <Group name="Events">
          {/* CHANGE THIS LINE: Use changeValue instead of onChangePayload */}
          <Text>{changeValue || 'No events received'}</Text>
        </Group>
        <Group name="Views">
          <TypedExpoLeafletView
            url="https://www.example.com"
            onLoad={({ nativeEvent }: { nativeEvent: { url: string } }) => 
              console.log(`Loaded: ${nativeEvent.url}`)
            }
            style={styles.view}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 400,
    width: '100%',
    backgroundColor: '#111',
  },
});