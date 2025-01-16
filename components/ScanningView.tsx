import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Spinner } from "./Spinner";
import Images from "@/assets/images";

interface ScanningViewProps {
  scanProgress: number;
}

export const ScanningView = ({ scanProgress }: ScanningViewProps) => {
  return (
    <View style={styles.scanningContainer}>
      <View style={[styles.logoContainer]}>
        <Image
          source={Images.nutrak_logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.progressContainer}>
        <Spinner />
      </View>

      <Text style={styles.scanningText}>Scanning in progress...</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
        </View>
        <Text style={styles.percentageText}>{Math.round(scanProgress)}%</Text>
      </View>

      <View style={styles.bottomIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  scanningContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    position: "absolute",
    top: "8%",
  },
  logo: {
    width: 98,
    height: 32,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  scanningText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
    fontWeight: "400",
  },
  progressBarContainer: {
    width: "80%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#66BB6A",
    borderRadius: 2,
  },
  percentageText: {
    fontSize: 22,
    color: "#141414",
    fontWeight: "bold",
  },
  bottomIndicator: {
    position: "absolute",
    bottom: 8,
    width: 135,
    height: 5,
    backgroundColor: "#000000",
    borderRadius: 100,
    opacity: 0.2,
  },
});
