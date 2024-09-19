import React, { useState, useEffect } from 'react';
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
  StatusBar,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import FeatherIcon from 'react-native-vector-icons/Feather';
import whatsappIcon from '../assets/whatsapp.png';
import instagramIcon from '../assets/instagram.png';
import twitterIcon from '../assets/twitter.png';
import linkedinIcon from '../assets/linkedin.png';
import { useAppContext } from '../Context/AppContext';

export default function Settings() {
  const { isDarkMode, setIsDarkMode, selectedLanguage, setSelectedLanguage, languageStore } = useAppContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLanguageOptionsExpanded, setIsLanguageOptionsExpanded] = useState(false);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
    } catch (e) {
      console.error('Failed to save dark mode preference.', e);
    }
  };

  const toggleLanguage = async (selected_language) => {
    setSelectedLanguage(selected_language);
    try {
      await AsyncStorage.setItem('appLanguage', JSON.stringify(selected_language));
    } catch (e) {
      console.error('Failed to save language preference.', e);
    }
  };

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f'
  };

  const dynamicRowWrapperStyle = {
    backgroundColor: isDarkMode ? '#CCCCCC' : '#FFFFFF'
  };

  const handleShare = async (platform) => {
    try {
      const message = 'Bu harika uygulamayı denemelisiniz!';
      const url = 'https://www.example.com';

      await Share.share({
        message,
        url,
      });
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
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["settings"].toUpperCase()}</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 11 }]} />
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.row}>
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]["contact"]}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? "#222222" : "#BCBCBC"}
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={19}
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedText}>bugunneyapsam@gmail.com</Text>
                </View>
              )}
            </View>

            <View style={[styles.rowWrapper, dynamicRowWrapperStyle]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]["rate_us"]}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? "#222222" : "#BCBCBC"}
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.row}>
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]["share"]}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? "#222222" : "#BCBCBC"}
                  name="share"
                  size={19}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => setIsLanguageOptionsExpanded(!isLanguageOptionsExpanded)}
                style={styles.row}>
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]["languages"]}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? "#222222" : "#BCBCBC"}
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={19}
                />
              </TouchableOpacity>
              {isLanguageOptionsExpanded && (
                <View style={styles.expandedContent}>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      selectedLanguage === 'tr' ? styles.selected : null,
                    ]}
                    onPress={() => toggleLanguage('tr')}
                  >
                    <Image
                      source={require('../assets/flags/tr_flag.png')}
                      style={styles.flag}
                    />
                    <Text
                      style={[
                        styles.languageText,
                        selectedLanguage === 'tr' ? styles.selectedText : null,
                      ]}
                    >
                      Türkçe
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      selectedLanguage === 'en' ? styles.selected : null,
                    ]}
                    onPress={() => toggleLanguage('en')}
                  >
                    <Image
                      source={require('../assets/flags/en_flag.png')}
                      style={styles.flag}
                    />
                    <Text
                      style={[
                        styles.languageText,
                        selectedLanguage === 'en' ? styles.selectedText : null,
                      ]}
                    >
                      English
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowLast]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]["theme"]}</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowLabel}>{isDarkMode ? languageStore[selectedLanguage]["dark_theme"] : languageStore[selectedLanguage]["light_theme"]}</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#767577', true: '#7E405E' }}
                  thumbColor={isDarkMode ? '#6B2346' : '#f4f3f4'}
                />
              </View>
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
              <Text style={styles.modalButtonText}>{languageStore[selectedLanguage]["close"]}</Text>
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
  content: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: '20%',
  },
  text: {
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
  },
  section: {
    paddingVertical: 3,
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
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  expandedContent: {
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e0e0e0',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  selected: {
    backgroundColor: '#6B2346',
  },
  flag: {
    width: 30,
    height: 30,
    marginLeft: -15,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: '20%',
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
    borderRadius: 9,
  },
});
