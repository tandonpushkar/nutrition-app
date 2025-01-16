import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Images from "@/assets/images";
import { StreakCalendar } from "@/components/StreakCalendar";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  SlideInRight,
  ZoomIn
} from 'react-native-reanimated';
import { useNavigation } from "expo-router";


const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MILESTONES : any = [
  { days: 7, achieved: true, color: "#9E9E9E", medal: Images.silver_medal , gradient: ["#F0F4F7", "#F2F5F7"] , borderColor: "#EBEDF0"},
  { days: 10, achieved: false, color: "#FF9F0A", medal: Images.bronze_medal , gradient: ["#F5E5D3", "#FFF8F0"] , borderColor: "#F5E9DC" },
  { days: 20, achieved: false, color: "#2196F3", medal: Images.gold_medal , gradient: ["#DCEDF5", "#EDF6FA"] , borderColor: "#E6F3FA" },
  { days: 30, achieved: false, color: "#9C27B0", medal: Images.platinum_medal , gradient: ["#F5F0FF", "#F3F0FA"] , borderColor: "#EDE6FA" },
];

export default function StreaksScreen() {
  const isFocused = useNavigation().isFocused();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isFocused && (
        <>
          <Animated.View 
            key="header"
            entering={FadeInDown.delay(100).springify()} 
            style={styles.header}
          >
            <Text style={styles.title}>Streaks</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-social-outline" size={22} color="#565656" />
            </TouchableOpacity>
          </Animated.View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View 
              key="streakInfo"
              entering={ZoomIn.delay(300).springify()} 
              style={styles.streakInfo}
            >
              <ImageBackground
                resizeMode="contain"
                source={Images.streak_bg}
                style={styles.streakIcon}
              >
                <Text style={styles.streakNumber}>5</Text>
              </ImageBackground>
              <Text style={styles.streakTitle}>You're on a</Text>
              <Text style={styles.streakSubtitle}>5 days Streak!</Text>
              <Text style={styles.streakMessage}>Keep it up!</Text>
            </Animated.View>

            <Animated.View 
              key="calendar" 
              entering={FadeIn.delay(500).springify()}
            >
              <StreakCalendar streakDays={10} milestone={10} />
            </Animated.View>

            <Animated.View 
              key="milestones"
              entering={FadeInDown.delay(700).springify()} 
              style={styles.milestones}
            >
              <View style={styles.milestonesHeader}>
                <Text style={styles.milestonesTitle}>Milestones</Text>
                <TouchableOpacity style={{columnGap: 6, flexDirection: "row", alignItems: "center"}}>
                  <Text style={styles.viewAll}>View All</Text>
                  <Image resizeMode="contain" source={Images.arrow_right} style={{width: 12, height: 12, marginLeft: 4}} />
                </TouchableOpacity>
              </View>
              {MILESTONES.map((milestone: any, index: any) => (
                <Animated.View 
                  key={`milestone-${index}-${isFocused}`}
                  entering={SlideInRight.delay(900 + index * 200).springify()}
                >
                  <LinearGradient
                    colors={milestone.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.milestoneCard, { borderColor: milestone.borderColor }]}
                  >
                    <Image
                      source={milestone.medal}
                      style={{ marginRight: 12, width: 24, height: 24 }}
                    />
                    <Text style={styles.milestoneDays}>
                      {milestone.days}-day streak achiever
                    </Text>
                    {milestone.achieved && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </LinearGradient>
                </Animated.View>
              ))}
            </Animated.View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  shareButton: {
    position: "absolute",
    right: 20,
  },
  title: {
    fontSize: 18,
    color: "#141414",
    fontWeight: "bold",
  },
  streakInfo: {
    alignItems: "center",
    marginVertical: 20,
  },
  streakIcon: {
    width: 95,
    height: 120,

    alignItems: "center",
    marginBottom: 15,
  },
  streakNumber: {
    position: "absolute",
    bottom: 10,

    color: "#141414",
    fontSize: 52,
    fontWeight: "bold",
  },
  streakTitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#565656",
  },
  streakSubtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#141414",
  },
  streakMessage: {
    fontSize: 16,
    color: "#565656",
  },
  calendar: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayLabel: {
    color: "#666",
    width: 40,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  activeDayCircle: {
    backgroundColor: "#4CAF50",
  },
  milestones: {
    padding: 20,
  },
  milestonesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  milestonesTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAll: {
    color: "#565656",
    fontSize: 16,
  },
  milestoneCard: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneIcon: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  milestoneDays: {
    flex: 1,
    fontSize: 16,
  },
});
