import React from 'react';
import { StyleSheet, Text, View, ScrollView, Linking, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useNavigation } from "expo-router";

const AboutScreen = () => {
  const isFocused = useNavigation().isFocused();
  
  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isFocused && (
        <>
          <Animated.View 
            entering={FadeInDown.delay(100).springify()} 
            style={styles.header}
          >
            <Text style={styles.title}>About</Text>
          </Animated.View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View 
              entering={FadeIn.delay(300).springify()}
              style={styles.content}
            >
              <Text style={styles.mainSectionTitle}>Project Overview</Text>
              <LinearGradient
                colors={["#F0F4F7", "#F2F5F7"]}
                style={styles.projectCard}
              >
                <Text style={styles.sectionTitle}>Development Highlights</Text>
                <View style={styles.projectStats}>
                  <View style={styles.projectStatItem}>
                    <Ionicons name="time-outline" size={20} color="#565656" />
                    <Text style={styles.projectStatText}>Development Time: 25 Hours</Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Libraries Used</Text>
                  <Text style={styles.description}>
                    Built entirely with Expo's integrated libraries:{'\n'}
                    • expo-linear-gradient - Smooth UI gradients{'\n'}
                    • expo-camera - Advanced camera integration{'\n'}
                    • react-native-reanimated - Fluid animations
                  </Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Custom Components</Text>
                  <Text style={styles.description}>
                    • Interactive Loading Spinner{'\n'}
                    • Dynamic Bar Chart for Nutrition Analysis{'\n'}
                    • Interactive Streak Calendar System
                  </Text>
                </View>
              </LinearGradient>

              <Text style={styles.mainSectionTitle}>Meet the Developer</Text>
              <LinearGradient
                colors={["#F0F4F7", "#F2F5F7"]}
                style={styles.developerCard}
              >
                <Text style={styles.name}>Pushkar Tandon</Text>
                <Text style={styles.role}>Senior React Native Developer</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>5+</Text>
                    <Text style={styles.statLabel}>Years of{'\n'}Excellence</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>15+</Text>
                    <Text style={styles.statLabel}>Apps{'\n'}Launched</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>10M+</Text>
                    <Text style={styles.statLabel}>Global{'\n'}Users</Text>
                  </View>
                </View>

                <View style={styles.links}>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => openURL('https://tandonpushkar.com')}
                  >
                    <Ionicons name="globe-outline" size={20} color="#565656" />
                    <Text style={styles.linkText}>Portfolio</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => openURL('https://linkedin.com/in/tandonpushkar')}
                  >
                    <Ionicons name="logo-linkedin" size={20} color="#565656" />
                    <Text style={styles.linkText}>Connect</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              <View style={styles.experienceSection}>
                <Text style={styles.sectionTitle}>Professional Journey</Text>
                <Text style={styles.description}>
                  A passionate engineer with proven expertise in mobile development:{'\n\n'}
                  • Development of 15+ successful mobile applications{'\n'}
                  • Architected scalable apps reaching 10M+ global users{'\n'}
                  • Led high-performing development teams to deliver exceptional results{'\n'}
                  • Implemented robust architectures for enterprise-grade applications{'\n'}
                  • Established best practices for performance optimization
                </Text>
              </View>

              <View style={styles.experienceSection}>
                <Text style={styles.sectionTitle}>Core Competencies</Text>
                <Text style={styles.description}>
                  • Advanced React Native Development{'\n'}
                  • Mobile Architecture & System Design{'\n'}
                  • Performance Optimization{'\n'}
                  • Team Leadership & Technical Mentorship{'\n'}
                  • Cross-platform Development Excellence
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: '#141414',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  developerCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEDF0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#565656',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#141414',
  },
  statLabel: {
    fontSize: 14,
    color: '#565656',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EBEDF0',
  },
  linkText: {
    color: '#565656',
    fontSize: 16,
  },
  experienceSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#565656',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  projectCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEDF0',
    marginBottom: 20,
  },
  projectStats: {
    marginTop: 12,
    marginBottom: 20,
  },
  projectStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectStatText: {
    fontSize: 16,
    color: '#565656',
    fontWeight: '500',
  },
  infoSection: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 8,
  },
  mainSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 16,
    marginTop: 8,
  },
});

export default AboutScreen;