import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function Example({ navigation }) {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.headerTitle}>
          Ayarlar
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 11 }]} />

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>İletişim</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color="#bcbcbc"
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={19}
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedText}>
                    bugunneyapsamQgmail.com
                  </Text>
                </View>
              )}
            </View>  

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Play Store - Derecelendirme</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color="#bcbcbc"
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Şartlar ve Gizlilik</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color="#bcbcbc"
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={19}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
    paddingTop: 23
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  /** Section */
  section: {
    paddingVertical: 3,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  /** Expanded Content */
  expandedContent: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginRight: 15
  },
  expandedText: {
    fontSize: 14,
    color: '#000',
  },
});
