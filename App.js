import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { captureRef } from 'react-native-view-shot'
import { WebView } from 'react-native-webview'

import Button from './components/Button'
import ImageViewer from './components/ImageViewer'
import CircleButton from './components/CircleButton'
import IconButton from './components/IconButton'
import EmojiPicker from './components/EmojiPicker'
import { useRef, useState } from 'react'
import EmojiList from './components/EmojiList'
import EmojiSticker from './components/EmojiSticker'

const PlaceholderImage = require('./assets/images/background-image.png')

export default function App () {
  const [webview, setWebview] = useState(true)
  const imageRef = useRef()
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const [pickedEmoji, setPickedEmoji] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showAppOptions, setShowAppOptions] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  if (status === null) {
    requestPermission()
  }
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert('You did not select any image.')
    }
  }
  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      })

      await MediaLibrary.saveToLibraryAsync(localUri)
      if (localUri) {
        alert('Saved!')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const toggleWebview = () => {
    setWebview(!webview)
  }
  const webviewRef = useRef(null)

  const sendMessageToWebView = (message) => {
    webviewRef.current.postMessage(message)
    console.log('Message sent to webview:', message)
    toggleWebview()
  }

  return (
    webview ?
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="auto"/>
        <WebView
          className='flex-1 mb-8'
          ref={webviewRef}
          source={{ uri: 'https://app-2056.vercel.app/' }}
//          source={{ uri: 'http://127.0.0.1:3005/square' }}
//          source={{ uri: 'https://www.google.com' }}
//          source={{ uri: 'https://www.baidu.com' }}
//          style={{ flex: 1 }}
          onMessage={sendMessageToWebView}
        />
      </SafeAreaView>
      :
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <View ref={imageRef} collapsable={false}>
              <ImageViewer
                placeholderImageSource={PlaceholderImage}
                selectedImage={selectedImage}
              />
              {pickedEmoji &&
                <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
            </View>
          </View>
          {showAppOptions ? (
            <View style={styles.optionsContainer}>
              <View style={styles.optionsRow}>
                <IconButton icon="refresh" label="Reset" onPress={onReset}/>
                <CircleButton onPress={onAddSticker}/>
                <IconButton icon="save-alt" label="Save"
                            onPress={onSaveImageAsync}/>
              </View>
            </View>
          ) : (
            <View style={styles.footerContainer}>
              <Button theme="primary" label="Choose a photo"
                      onPress={pickImageAsync}/>
              <Button label="Use this photo"
                      onPress={() => setShowAppOptions(true)}/>
            </View>
          )}
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
          </EmojiPicker>
          <StatusBar style="auto"/>
        </View>
      </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#000000',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
