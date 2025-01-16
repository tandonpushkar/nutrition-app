import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Images from "@/assets/images";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { ScanningView } from "../../components/ScanningView";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH - 40;

const ICONS = {
  proteins: Images.proteins,
  carbs: Images.carbs,
  fats: Images.fats,
  iron: Images.iron,
  calcium: Images.calcium,
  logo: Images.nutrak_logo,
};

// Move constants outside component to prevent recreating on each render
const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

// Add proper TypeScript interfaces
interface NutritionData {
  calories: number;
  macros: {
    proteins: number;
    carbs: number;
    fats: number;
    total: number;
  };
  micros: {
    iron: number;
    calcium: number;
    total: number;
  };
}

// Create an animated BlurView component
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function NutritionResultsScreen() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  // Add proper nutrition data state
  const [nutritionData] = useState<NutritionData>({
    calories: 320,
    macros: {
      proteins: 13,
      carbs: 35,
      fats: 12,
      total: 60,
    },
    micros: {
      iron: 10,
      calcium: 20,
      total: 30,
    },
  });

  // Add scroll animation value
  const scrollY = useSharedValue(0);

  // Add new animated values
  const scanRotation = useSharedValue(0);
  const scanScale = useSharedValue(1);
  const resultsOpacity = useSharedValue(0);
  const cardsScale = useSharedValue(0);

  // Add animated values for each section
  const overviewOpacity = useSharedValue(0);
  const overviewTranslateY = useSharedValue(50);

  const macroOpacity = useSharedValue(0);
  const macroTranslateY = useSharedValue(50);

  const microOpacity = useSharedValue(0);
  const microTranslateY = useSharedValue(50);

  const weeklyOpacity = useSharedValue(0);
  const weeklyTranslateY = useSharedValue(50);

  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.9);

  // Add this state for StatusBar style
  const [statusBarStyle, setStatusBarStyle] = useState<'light-content' | 'dark-content'>('light-content');

  // Add entrance animations
  useEffect(() => {
    if (showResults) {
      resultsOpacity.value = withTiming(1, { duration: 500 });
      cardsScale.value = withSpring(1);
    }
  }, [showResults]);

  // Add scanning animations
  useEffect(() => {
    if (isScanning) {
      scanRotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1
      );
      scanScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1
      );
    }
  }, [isScanning]);

  // Create animated styles for results content
  const resultsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultsOpacity.value,
    transform: [{ scale: cardsScale.value }],
  }));

  // Create animated styles for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 100],
      ["rgba(0,0,0,0.1)", "rgba(255,255,255,0.98)"]
    );

    const textColor = interpolateColor(
      scrollY.value,
      [0, 100],
      ["#FFFFFF", "#000000"]
    );

    return {
      backgroundColor,
      borderBottomColor: interpolateColor(
        scrollY.value,
        [0, 100],
        ["transparent", "rgba(0,0,0,0.1)"]
      ),
      borderBottomWidth: 1,
    };
  });

  const headerTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(scrollY.value, [0, 100], ["#FFFFFF", "#000000"]),
    fontSize: 18,
    fontWeight: "bold",
  }));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setShowResults(true);
            return 100;
          }
          return prev + 20;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Update the scroll handler to manage StatusBar style
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      // Use runOnJS to update state from worklet
      if (event.contentOffset.y > 100) {
        runOnJS(setStatusBarStyle)('dark-content');
      } else {
        runOnJS(setStatusBarStyle)('light-content');
      }
    },
  });

  // Move bar heights to component level
  const barHeights = DAYS_OF_WEEK.map(() => useSharedValue(0));

  // Create animated styles for each bar outside of render
  const barStyles = DAYS_OF_WEEK.map((_, index) =>
    useAnimatedStyle(() => ({
      height: barHeights[index].value,
    }))
  );

  // Initialize bar heights once
  useEffect(() => {
    if (showResults) {
      DAYS_OF_WEEK.forEach((_, index) => {
        const randomHeight = Math.random() * 60 + 20;
        barHeights[index].value = withDelay(
          index * 100,
          withSpring(randomHeight)
        );
      });
    }
  }, [showResults]);

  // Update weekly chart render method
  const renderWeeklyChart = () => (
    <View style={styles.weeklyChart}>
      {DAYS_OF_WEEK.map((day, index) => (
        <View key={day + index} style={styles.dayColumn}>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.bar, barStyles[index]]}>
              <LinearGradient
                colors={["#4CAF50", "#FFA000"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.dayLabel}>{day}</Text>
        </View>
      ))}
    </View>
  );

  // Trigger section animations when results are shown
  useEffect(() => {
    if (showResults) {
      // Overview section
      overviewOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
      overviewTranslateY.value = withDelay(100, withSpring(0));

      // Macro section
      macroOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
      macroTranslateY.value = withDelay(300, withSpring(0));

      // Micro section
      microOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
      microTranslateY.value = withDelay(500, withSpring(0));

      // Weekly section
      weeklyOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
      weeklyTranslateY.value = withDelay(700, withSpring(0));

      // Button
      buttonOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
      buttonScale.value = withDelay(900, withSpring(1));
    }
  }, [showResults]);

  // Create animated styles for sections
  const overviewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overviewOpacity.value,
    transform: [{ translateY: overviewTranslateY.value }],
  }));

  const macroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: macroOpacity.value,
    transform: [{ translateY: macroTranslateY.value }],
  }));

  const microAnimatedStyle = useAnimatedStyle(() => ({
    opacity: microOpacity.value,
    transform: [{ translateY: microTranslateY.value }],
  }));

  const weeklyAnimatedStyle = useAnimatedStyle(() => ({
    opacity: weeklyOpacity.value,
    transform: [{ translateY: weeklyTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  if (isScanning) {
    return (
      <ScanningView 
        scanProgress={scanProgress}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle={statusBarStyle} 
      />
      <View style={styles.header}>
        <AnimatedBlurView
          intensity={10}
          tint="dark"
          style={[styles.headerBlur, headerAnimatedStyle]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.replace('/')}>
              <Animated.Text style={headerTextStyle}>
                <Ionicons name="chevron-back" size={16} />
              </Animated.Text>
            </TouchableOpacity>
            <Animated.Text style={headerTextStyle}>
              Nutrition Results
            </Animated.Text>
            <View />
          </View>
        </AnimatedBlurView>
      </View>
      <Animated.ScrollView
        bounces={false}
        style={[{ marginTop: -80 }, resultsAnimatedStyle]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.foodImageContainer}>
          <Image source={Images.imageBanner} style={styles.foodImage} />
          <LinearGradient
            colors={["rgba(255,255,255,0)","rgba(255,255,255,0.4)", "rgba(255,255,255,0.8)", "#fff"]}
            style={styles.foodTitleContainer}
          >
            <View style={styles.foodTypeContainer}>
              <Text style={styles.foodType}>FOOD</Text>
            </View>

            <Text style={styles.foodName}>Pepperoni Pizza</Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Animated.View style={overviewAnimatedStyle}>
            <Text style={styles.sectionTitle}>Nutritional Overview</Text>
            <View style={styles.gridContainer}>
              <View style={styles.overviewCard}>
                <Image
                  resizeMode="contain"
                  source={Images.calories}
                  style={styles.macroIcon}
                />

                <View style={styles.overviewText}>
                  <Text style={styles.overviewLabel}>Calories</Text>
                  <Text style={styles.overviewValue}>
                    {nutritionData.calories} kcal
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.macroSection, macroAnimatedStyle]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Macronutrients</Text>
              <Text style={styles.totalText}>
                Total: {nutritionData.macros.total}g
              </Text>
            </View>
            <View style={styles.gridContainer}>
              <View style={styles.overviewCard}>
                <Image
                  resizeMode="contain"
                  source={Images.proteins}
                  style={styles.macroIcon}
                />
                <View style={styles.overviewText}>
                  <Text style={styles.overviewLabel}>Proteins</Text>
                  <Text style={styles.overviewValue}>
                    {nutritionData.macros.proteins}g
                  </Text>
                </View>
              </View>
              <View style={styles.overviewCard}>
                <Image
                  resizeMode="contain"
                  source={Images.carbs}
                  style={styles.macroIcon}
                />
                <View style={styles.overviewText}>
                  <Text style={styles.overviewLabel}>Carbs</Text>
                  <Text style={styles.overviewValue}>
                    {nutritionData.macros.carbs}g
                  </Text>
                </View>
              </View>
              <View style={styles.overviewCard}>
                <Image
                  resizeMode="contain"
                  source={Images.fats}
                  style={styles.macroIcon}
                />
                <View style={styles.overviewText}>
                  <Text style={styles.overviewLabel}>Fats</Text>
                  <Text style={styles.overviewValue}>
                    {nutritionData.macros.fats}g
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.microSection, microAnimatedStyle]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Micronutrients</Text>
              <Text style={styles.totalText}>
                Total: {nutritionData.micros.total}%
              </Text>
            </View>
            <View style={styles.gridContainer}>
              <View style={styles.overviewCard}>
                <Image
                  resizeMode="contain"
                  source={Images.iron}
                  style={styles.macroIcon}
                />
                <View style={styles.overviewText}>
                  <Text style={styles.overviewLabel}>Iron</Text>
                  <Text style={styles.overviewValue}>
                    {nutritionData.micros.iron}%
                  </Text>
                </View>
              </View>
              <View style={styles.overviewCard}>
                <Image
                  resizeMode="contain"
                  source={Images.calcium}
                  style={styles.macroIcon}
                />
                <View style={styles.overviewText}>
                  <Text style={styles.overviewLabel}>Calcium</Text>
                  <Text style={styles.overviewValue}>
                    {nutritionData.micros.calcium}%
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.weeklySection, weeklyAnimatedStyle]}>
            <Text style={styles.weeklyTitle}>Weekly Meal Nutrition</Text>
            {renderWeeklyChart()}
          </Animated.View>

          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save to Daily Log</Text>
            </TouchableOpacity>

            <View style={styles.premiumContainer}>
              <Text style={styles.premiumText}>Want more insights? </Text>
              <TouchableOpacity>
                <Text style={styles.premiumLink}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerBlur: {
    height: 100,
    marginTop: -50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 16,
    width: "100%",
  },
  foodImageContainer: {
    height: 380,
    position: "relative",
    marginTop: 0,
  },
  foodImage: {
    width: "100%",
    height: "100%",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  foodTitleContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: 16,
    zIndex: 1,
  },
  foodTypeContainer: {
    width: 50,
    padding: 4,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 6,
  },
  foodType: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
  },
  foodName: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#141414",
    marginBottom: 8,
  },
  weeklyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#141414",
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  overviewCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  overviewText: {
    marginLeft: 12,
  },
  overviewLabel: {
    color: "#666",
    fontSize: 14,
  },
  overviewValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  macroIcon: {
    width: 32,
    height: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalText: {
    color: "#666",
    fontSize: 14,
  },
  weeklyChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  dayColumn: {
    alignItems: "center",
  },
  barContainer: {
    height: 80,
    justifyContent: "flex-end",
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  dayLabel: {
    marginTop: 8,
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },
  saveButton: {
    height: 44,
    backgroundColor: "#FFA000",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#98671E",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  premiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 4,
  },
  premiumText: {
    color: "#666",
    fontSize: 14,
  },
  premiumLink: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  macroSection: {
    //marginBottom: 24,
  },
  microSection: {
    //marginBottom: 24,
  },
  weeklySection: {
    borderWidth: 2,
    borderColor: "#EDEDED",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
} as const);
