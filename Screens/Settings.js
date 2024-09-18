import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Share,
  Image,
  Linking,
  Platform,
  StatusBar
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import whatsappIcon from '../assets/whatsapp.png';
import instagramIcon from '../assets/instagram.png';
import twitterIcon from '../assets/twitter.png';
import linkedinIcon from '../assets/linkedin.png';

export default function Settings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async (platform) => {
    try {
      const message = 'Bu harika uygulamayı denemelisiniz!';
      const url = 'https://www.example.com'; // Uygulama linkini buraya ekleyin

      if (platform === 'copy') {
        await Share.share({
          message,
        });
      } else {
        await Share.share({
          message,
          url,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const openShareUrl = (platform) => {
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = 'whatsapp://send?text=Bu%20harika%20uygulamayı%20denemelisiniz!%20https://www.example.com';
        break;
      case 'instagram':
        url = 'instagram://';
        break;
      case 'twitter':
        url = 'twitter://post?message=Bu%20harika%20uygulamayı%20denemelisiniz!%20https://www.example.com';
        break;
      case 'linkedin':
        url = 'linkedin://shareArticle?mini=true&url=https://www.example.com&title=Harika%20Uygulama&summary=Bu%20harika%20uygulamayı%20denemelisiniz!';
        break;
    }
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Application not installed or URL is incorrect');
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.text}>AYARLAR</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 11 }]} />
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.row}>
                <Text style={styles.rowLabel}>İletişim</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color="#bcbcbc"
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={19}
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedText}>bugunneyapsamQgmail.com</Text>
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
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.row}>
                <Text style={styles.rowLabel}>Paylaş</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color="#bcbcbc"
                  name="share"
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

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView horizontal={true} contentContainerStyle={styles.modalIconsContainer}>
              <TouchableOpacity
                onPress={() => openShareUrl('whatsapp')}
                style={styles.modalButton}>
                <Image source={whatsappIcon} style={styles.modalIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openShareUrl('instagram')}
                style={styles.modalButton}>
                <Image source={instagramIcon} style={styles.modalIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openShareUrl('twitter')}
                style={styles.modalButton}>
                <Image source={twitterIcon} style={styles.modalIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openShareUrl('linkedin')}
                style={styles.modalButton}>
                <Image source={linkedinIcon} style={styles.modalIcon} />
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.modalButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
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
  content: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: "20%"
  },
  text: {
    color: '#65d6',
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
  },
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
  expandedContent: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginRight: 15
  },
  expandedText: {
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: "20%"
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  modalIconsContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalIcon: {
    width: 50,
    height: 50,
  },
  closeButton: {
    marginTop: 17,
    paddingVertical: 7,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#6B2346',
    backgroundColor: '#ffdddd',
    padding: 7,
    paddingHorizontal: 15,
    borderRadius: 9
  },
});
