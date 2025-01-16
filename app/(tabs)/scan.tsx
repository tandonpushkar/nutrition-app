import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withSequence,
  interpolate,
  Easing,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Images from '@/assets/images';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const cameraRef = useRef<any>(null);

  const scanLinePosition = useSharedValue(0);

  useEffect(() => {
    scanLinePosition.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1500,
          easing: Easing.bezierFn(0.4, 0.0, 0.2, 1),
        }),
        withTiming(1, { duration: 100 }),
        withTiming(0, {
          duration: 1500,
          easing: Easing.bezierFn(0.4, 0.0, 0.2, 1),
        }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );
  }, []);

  const animatedScanLine = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scanLinePosition.value,
        [0, 1],
        [0, 250],
        Extrapolate.CLAMP
      ),
    }],
    opacity: interpolate(
      scanLinePosition.value,
      [0, 0.1, 0.9, 1],
      [0.9, 1, 1, 0.9],
      Extrapolate.CLAMP
    ),
  }));

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // Here you would typically upload the photo to your server
        // For now, we'll just navigate to results
        router.push('/nutrition-results');
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF9F0A" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.permissionModal}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.cameraIconContainer}>
            <Image 
              source={Images.camera_icon} 
              style={styles.cameraIcon}
            />
          </View>
          <Text style={styles.permissionTitle}>
            Allow "Nutrition Scanning" to use{'\n'}your camera?
          </Text>
          <Text style={styles.permissionDescription}>
            You can change this setting in the App{'\n'}section of your device Settings.
          </Text>
          <TouchableOpacity 
            style={styles.allowButtonContainer}
            onPress={requestPermission}
          >
            <LinearGradient
              colors={['#FFBF62', '#FFA726']}
              style={styles.allowButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.allowButtonText}>Allow Access</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.denyButton}
            onPress={() => router.back()}
          >
            <Text style={styles.denyButtonText}>Don't Allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="flash-off" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <BlurView intensity={20} tint="light" style={styles.scanInfoCard}>
            <View style={styles.scanIconContainer}>
                <Image resizeMode='contain' source={Images.scan_icon} style={styles.scanIcon} />
            </View>
            <View style={styles.scanTextContainer}>
              <Text style={styles.scanTitle}>Scan Your Food</Text>
              <Text style={styles.scanSubtitle}>
                Ensure your food is well-lit and in focus for the most accurate scan.
              </Text>
            </View>
          </BlurView>

          <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
              <View style={styles.scanAreaContainer}>
                <Animated.View style={[styles.scanLineContainer, animatedScanLine]}>
                  <LinearGradient
                    colors={[
                      'rgba(102, 187, 106, 0.3)',
                      'rgba(102, 187, 106, 0.1)',
                      'rgba(102, 187, 106, 0)',
                    ]}
                    locations={[0, 0.7, 1]}
                    style={styles.scanLineGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                  >
                    <View style={styles.scanLineHighlight} />
                  </LinearGradient>
                </Animated.View>
              </View>
            </View>
          </View>

          <View style={styles.controls}>
            <BlurView intensity={20} tint="dark" style={styles.galleryButton}>
              <Image resizeMode='contain' source={Images.gallery_icon} style={styles.galleryIcon} />
            </BlurView>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleCapture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <BlurView intensity={20} tint="dark" style={styles.zoomButton}>
              <Text style={styles.zoomText}>1x</Text>
            </BlurView>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 8,
  },
  scanIcon: {
    width: 22,
    height: 22,
  },
  galleryIcon: {
    width: 22,
    height: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanInfoCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    // alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fallback for devices that don't support blur
  },
  scanIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scanSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 18,
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 40,
    paddingHorizontal: 40, // Increased horizontal margin
  },
  scanFrame: {
    aspectRatio: 1,
    width: '100%',
    position: 'relative',
    maxWidth: 300,
    alignSelf: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderTopRightRadius: 16,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderBottomRightRadius: 16,
  },
  scanAreaContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '5%',
    right: '5%',
    overflow: 'hidden',
  },
  scanLineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
  },
  scanLineGradient: {
    flex: 1,
    position: 'relative',
  },
  scanLineHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(102, 187, 106, 0.9)',
    shadowColor: '#66BB6A',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 37,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
    borderWidth: 10,
    borderColor: '#66BB6A',
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  zoomText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxWidth: 320,
    paddingVertical: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  cameraIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFEFF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraIcon: {
    width: 28,
    height: 28,
  },
  permissionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
    lineHeight: 22,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#565656',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  allowButtonContainer: {
    width: '86%',
    height: 50,
    marginBottom: 8,
  },
  allowButton: {
    borderWidth: 1,
    borderColor: '#98671E',
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allowButtonText: {
    color: '#141414',
    fontSize: 17,
    fontWeight: '600',
  },
  denyButton: {
    width: '86%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  denyButtonText: {
    fontWeight: '600',
    color: '#000',
    fontSize: 17,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  foodDetails: {
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nutritionOverview: {
    marginBottom: 20,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  macronutrients: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#FF9F0A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF9F0A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scanningContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 100,
  },
  progressContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressCircle: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    width: 3,
    height: 15,
    left: '50%',
    top: 0,
    marginLeft: -1.5,
    transformOrigin: 'bottom center',
    borderRadius: 1.5,
  },
  scanningText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
}); 