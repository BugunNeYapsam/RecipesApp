import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  Platform,
  StatusBar,
  Switch,
  Dimensions, // Import Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import whatsappIcon from '../assets/whatsapp.png';
import xIcon from '../assets/x.png';
import linkedinIcon from '../assets/linkedin.png';
import * as Clipboard from 'expo-clipboard';
import { useAppContext } from '../Context/AppContext';

// Get screen width and define breakpoint
const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth > 600; // Adjust breakpoint as needed

export default function Settings() {
  const [toastVisible, setToastVisible] = useState(false);
  const {
    isDarkMode,
    setIsDarkMode,
    selectedLanguage,
    setSelectedLanguage,
    languageStore,
    appSettings,
  } = useAppContext();

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

  const handleModalOpen = () => {
    setModalVisible(true);
    StatusBar.setBackgroundColor(isDarkMode ? '#101010' : '#7A7A7A');
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  };

  const handleModalClose = () => {
    setModalVisible(false);
    StatusBar.setBackgroundColor(isDarkMode ? '#2D2D2D' : '#EEEEEE');
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  };

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE',
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f',
  };

  const dynamicRowWrapperStyle = {
    backgroundColor: isDarkMode ? '#CCCCCC' : '#FFFFFF',
  };

  const openShareUrl = (platform) => {
    let url = '';
    const appLink = appSettings?.appLink;
    const shareMessage =
      selectedLanguage == 'tr'
        ? 'Bu harika uygulamayı denemelisiniz!'
        : 'Check out this awesome app!';

    switch (platform) {
      case 'whatsapp':
        url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}%20${encodeURIComponent(
          appLink
        )}`;
        break;
      case 'twitter':
        url = `twitter://post?message=${encodeURIComponent(shareMessage)}%20${encodeURIComponent(
          appLink
        )}`;
        break;
      case 'linkedin':
        url = `linkedin://shareArticle?mini=true&url=${encodeURIComponent(
          appLink
        )}&title=Awesome%20App&summary=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        url = '';
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Application not installed or URL is incorrect');
      }
    });
  };

  const handleCopyToClipboard = async () => {
    const appLink = appSettings?.appLink;
    if (appLink) {
      await Clipboard.setStringAsync(appLink);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <Text style={[styles.text, dynamicPageTitleStyle]}>
        {languageStore[selectedLanguage]['settings']?.toUpperCase()}
      </Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 11 }]} />
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]['contact']}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? '#222222' : '#BCBCBC'}
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={isLargeScreen ? 22 : 19}
                />
              </TouchableOpacity>
              {isExpanded && (
                <>
                  <Text style={styles.expandedTextTitle}>
                    {languageStore[selectedLanguage]['contact_message']}
                  </Text>
                  <View style={styles.expandedContent}>
                    <Text style={styles.expandedText}>{appSettings?.email}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={[styles.rowWrapper, dynamicRowWrapperStyle]}>
              <TouchableOpacity
                onPress={() => {
                  const url = appSettings?.playStoreAppId;
                  Linking.openURL(url).catch((err) =>
                    console.error('Failed to open Play Store', err)
                  );
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>
                  {languageStore[selectedLanguage]['rate_us']}
                </Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? '#222222' : '#BCBCBC'}
                  size={isLargeScreen ? 22 : 19}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowLast]}>
              <TouchableOpacity onPress={handleModalOpen} style={styles.row}>
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]['share']}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? '#222222' : '#BCBCBC'}
                  name="share"
                  size={isLargeScreen ? 22 : 19}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, dynamicRowWrapperStyle, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() =>
                  setIsLanguageOptionsExpanded(!isLanguageOptionsExpanded)
                }
                style={styles.row}
              >
                <Text style={styles.rowLabel}>
                  {languageStore[selectedLanguage]['languages']}
                </Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={isDarkMode ? '#222222' : '#BCBCBC'}
                  name={isLanguageOptionsExpanded ? 'chevron-up' : 'chevron-down'}
                  size={isLargeScreen ? 22 : 19}
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
                      source={require('../assets/flags/tr_flag.jpg')}
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
                      source={require('../assets/flags/en_flag.jpg')}
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
                <Text style={styles.rowLabel}>{languageStore[selectedLanguage]['theme']}</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowLabel}>
                  {isDarkMode
                    ? languageStore[selectedLanguage]['dark_theme']
                    : languageStore[selectedLanguage]['light_theme']}
                </Text>
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
        onRequestClose={handleModalClose}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetContent}>
            <TouchableOpacity
              onPress={() => openShareUrl('whatsapp')}
              style={styles.bottomSheetButton}
            >
              <Image source={whatsappIcon} style={styles.bottomSheetIcon} />
              <Text style={styles.bottomSheetButtonText}>
                {languageStore[selectedLanguage]['share_via_whatsapp']}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openShareUrl('twitter')}
              style={styles.bottomSheetButton}
            >
              <Image source={xIcon} style={styles.bottomSheetIcon} />
              <Text style={styles.bottomSheetButtonText}>
                {languageStore[selectedLanguage]['share_via_twitter']}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openShareUrl('linkedin')}
              style={styles.bottomSheetButton}
            >
              <Image source={linkedinIcon} style={styles.bottomSheetIcon} />
              <Text style={styles.bottomSheetButtonText}>
                {languageStore[selectedLanguage]['share_via_linkedin']}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCopyToClipboard}
              style={styles.bottomSheetButton}
            >
              <MaterialIcons
                name="content-copy"
                size={isLargeScreen ? 35 : 30}
                color="#6B2346"
                style={styles.bottomSheetIcon}
              />
              <Text style={styles.bottomSheetButtonText}>
                {languageStore[selectedLanguage]['copy_link']}
              </Text>
              {toastVisible && (
                <View style={styles.inlineToast}>
                  <Text style={styles.inlineToastText}>
                    {languageStore[selectedLanguage]['link_copied']}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleModalClose}
            activeOpacity={1}
            style={styles.bottomSheetCloseButton}
          >
            <Text style={styles.bottomSheetCloseButtonText}>
              {languageStore[selectedLanguage]['close']}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    padding: isLargeScreen ? 30 : 20,
    borderTopLeftRadius: isLargeScreen ? 25 : 20,
    borderTopRightRadius: isLargeScreen ? 25 : 20,
  },
  bottomSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: isLargeScreen ? 20 : 15,
  },
  bottomSheetIcon: {
    width: isLargeScreen ? 35 : 30,
    height: isLargeScreen ? 35 : 30,
    marginRight: isLargeScreen ? 20 : 15,
  },
  bottomSheetButtonText: {
    fontSize: isLargeScreen ? 24 : 18,
    color: '#000',
  },
  bottomSheetCloseButton: {
    alignItems: 'center',
    padding: isLargeScreen ? 20 : 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  bottomSheetCloseButtonText: {
    fontSize: isLargeScreen ? 24 : 18,
    color: '#6B2346',
  },
  toastContainer: {
    position: 'absolute',
    top: isLargeScreen ? 110 : 100,
    left: '50%',
    transform: [{ translateX: -100 }],
    backgroundColor: '#333',
    paddingVertical: isLargeScreen ? 12 : 10,
    paddingHorizontal: isLargeScreen ? 25 : 20,
    borderRadius: isLargeScreen ? 25 : 20,
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    fontSize: isLargeScreen ? 18 : 16,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingVertical: isLargeScreen ? 25 : 20,
    paddingHorizontal: isLargeScreen ? 24 : 16,
    paddingBottom: '20%',
  },
  text: {
    fontWeight: 'bold',
    marginTop: isLargeScreen ? 40 : 30,
    marginLeft: isLargeScreen ? 30 : 20,
    fontSize: isLargeScreen ? 22 : 18,
  },
  section: {
    paddingVertical: isLargeScreen ? 5 : 3,
  },
  sectionBody: {
    borderRadius: isLargeScreen ? 15 : 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: isLargeScreen ? 2 : 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: isLargeScreen ? 1.8 : 1.41,
    elevation: isLargeScreen ? 3 : 2,
  },
  row: {
    height: isLargeScreen ? 50 : 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: isLargeScreen ? 15 : 12,
  },
  rowWrapper: {
    paddingLeft: isLargeScreen ? 20 : 16,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: isLargeScreen ? 15 : 12,
    borderTopRightRadius: isLargeScreen ? 15 : 12,
  },
  rowLabel: {
    fontSize: isLargeScreen ? 20 : 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowLast: {
    borderBottomLeftRadius: isLargeScreen ? 15 : 12,
    borderBottomRightRadius: isLargeScreen ? 15 : 12,
  },
  expandedContent: {
    marginRight: isLargeScreen ? 20 : 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isLargeScreen ? 15 : 10,
    backgroundColor: '#f2f2f2',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: isLargeScreen ? 15 : 10,
    paddingHorizontal: isLargeScreen ? 20 : 15,
    backgroundColor: '#e0e0e0',
  },
  languageText: {
    fontSize: isLargeScreen ? 20 : 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  selected: {
    backgroundColor: '#6B2346',
  },
  flag: {
    width: isLargeScreen ? 35 : 30,
    height: isLargeScreen ? 35 : 30,
    marginLeft: isLargeScreen ? -20 : -15,
    marginRight: isLargeScreen ? 15 : 10,
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
    padding: isLargeScreen ? 25 : 20,
    borderTopLeftRadius: isLargeScreen ? 20 : 15,
    borderTopRightRadius: isLargeScreen ? 20 : 15,
    alignItems: 'center',
  },
  modalIconsContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    paddingVertical: isLargeScreen ? 15 : 10,
    paddingHorizontal: isLargeScreen ? 20 : 15,
  },
  modalIcon: {
    width: isLargeScreen ? 55 : 50,
    height: isLargeScreen ? 55 : 50,
  },
  closeButton: {
    marginTop: isLargeScreen ? 20 : 17,
    paddingVertical: isLargeScreen ? 10 : 7,
  },
  modalButtonText: {
    fontSize: isLargeScreen ? 20 : 18,
    color: '#6B2346',
    backgroundColor: '#ffdddd',
    padding: isLargeScreen ? 10 : 7,
    paddingHorizontal: isLargeScreen ? 20 : 15,
    borderRadius: isLargeScreen ? 12 : 9,
  },
  expandedTextTitle: {
    color: '#6B2346',
    paddingVertical: isLargeScreen ? 7 : 5,
    fontSize: isLargeScreen ? 20 : 14,
  },
  expandedText: {
    fontSize: isLargeScreen ? 20 : 16,
  },
  inlineToast: {
    marginLeft: 'auto',
    backgroundColor: '#6B2346',
    paddingVertical: isLargeScreen ? 7 : 5,
    paddingHorizontal: isLargeScreen ? 15 : 10,
    borderRadius: isLargeScreen ? 12 : 10,
  },
  inlineToastText: {
    color: '#fff',
    fontSize: isLargeScreen ? 16 : 14,
  },
});