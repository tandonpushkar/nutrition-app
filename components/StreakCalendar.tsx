import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, subDays, isSameDay } from 'date-fns';
import Images from '@/assets/images';

interface StreakCalendarProps {
  streakDays: number;
  milestone: number;
}

export const StreakCalendar = ({ streakDays, milestone }: StreakCalendarProps) => {
  const today = new Date();
  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Generate dates for the last 14 days
  const generateTwoWeeks = () => {
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      dates.push(subDays(today, i));
    }
    return dates;
  };

  const dates = generateTwoWeeks();
  const firstWeek = dates.slice(0, 7);
  const secondWeek = dates.slice(7);

  const renderWeek = (weekDates: Date[]) => (
    <View style={styles.weekRow}>
      {weekDates.map((date, index) => {
        const dayNumber = format(date, 'd');
        const isToday = isSameDay(date, today);
        const isPast = date < today;
        const isInStreak = isPast && date > subDays(today, streakDays);
        
        return (
          <View key={index} style={styles.dayContainer}>
            <Text style={[
              styles.dayNumber,
              isToday ? styles.currentDay : null,
              !isPast ? styles.futureDay : null,
            ]}>
              {dayNumber}
            </Text>
            {isInStreak && (
              <LinearGradient
                colors={['#66BB6A', '#4F8D52']}
                style={styles.streakCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="flame" size={16} color="#fff" />
              </LinearGradient>
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.daysHeader}>
          {DAYS.map((day, index) => (
            <Text key={index} style={styles.dayLabel}>{day}</Text>
          ))}
        </View>
        {renderWeek(firstWeek)}
        {renderWeek(secondWeek)}
      </View>
      
      {milestone && (
        <View style={styles.milestoneWrapper}>
          <View style={styles.milestoneContainer}>
            <Image
              source={Images.bronze_medal}
              style={{ marginRight: 6, width: 20, height: 20 }}
            />
            <Text style={styles.milestoneText}>
              {milestone}-day streak achiever
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  container: {
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneWrapper: {
   
    alignItems: 'center',
    marginTop: -16, // Overlap with the card above
  },
  milestoneContainer: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5E9DC',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trophyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF9F0A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  milestoneText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayLabel: {
    width: 40,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
    color: '#000',
  },
  currentDay: {
    fontWeight: 'bold',
  },
  futureDay: {
    color: '#ccc',
  },
  streakCircle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 