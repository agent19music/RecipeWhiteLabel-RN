import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { track } from '@/utils/analytics';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, useTheme } from '@/theme';
import { demoPlan, recipes } from '@/data/seed';

const { width } = Dimensions.get('window');

// User Profile & Goals
interface UserProfile {
  dailyCalorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal: number;
  weightGoal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Meal {
  id: string;
  type: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  time: string;
  logged: boolean;
}

interface DayPlan {
  date: Date;
  meals: Meal[];
  waterIntake: number;
  exercise?: {
    type: string;
    duration: number;
    caloriesBurned: number;
  };
}

export default function Planner() {
  const { palette } = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userProfile, setUserProfile] = useState<UserProfile>({
    dailyCalorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 65,
    waterGoal: 8,
    weightGoal: 'maintain',
    activityLevel: 'moderate',
  });
  
  const [weekPlans, setWeekPlans] = useState<DayPlan[]>([]);
  const plan = demoPlan;

  // Initialize week plans
  useEffect(() => {
    const initWeekPlans = () => {
      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      const plans: DayPlan[] = [];
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(startDate, i);
        plans.push({
          date,
          meals: generateSampleMeals(date),
          waterIntake: isToday(date) ? 5 : Math.floor(Math.random() * 8) + 1,
          exercise: Math.random() > 0.5 ? {
            type: ['Running', 'Yoga', 'Gym', 'Cycling'][Math.floor(Math.random() * 4)],
            duration: Math.floor(Math.random() * 60) + 20,
            caloriesBurned: Math.floor(Math.random() * 300) + 200,
          } : undefined,
        });
      }
      
      setWeekPlans(plans);
    };
    
    initWeekPlans();
  }, []);

  // Generate sample meals
  const generateSampleMeals = (date: Date): Meal[] => {
    if (!isToday(date) && date > new Date()) return [];
    
    return [
      {
        id: `${date.getTime()}-breakfast`,
        type: 'breakfast',
        name: 'Oatmeal with Berries',
        calories: 320,
        protein: 12,
        carbs: 58,
        fat: 6,
        fiber: 8,
        time: '08:00',
        logged: isToday(date) ? false : true,
      },
      {
        id: `${date.getTime()}-lunch`,
        type: 'lunch',
        name: 'Grilled Chicken Salad',
        calories: 380,
        protein: 35,
        carbs: 12,
        fat: 22,
        fiber: 4,
        time: '12:30',
        logged: isToday(date) ? false : true,
      },
      {
        id: `${date.getTime()}-dinner`,
        type: 'dinner',
        name: 'Salmon with Vegetables',
        calories: 420,
        protein: 32,
        carbs: 25,
        fat: 18,
        fiber: 6,
        time: '19:00',
        logged: false,
      },
      {
        id: `${date.getTime()}-snack`,
        type: 'snack',
        name: 'Greek Yogurt Parfait',
        calories: 180,
        protein: 15,
        carbs: 22,
        fat: 4,
        fiber: 2,
        time: '15:00',
        logged: isToday(date) ? false : true,
      },
    ];
  };

  // Calculate daily totals
  const getDayTotals = (meals: Meal[]) => {
    const logged = meals.filter(m => m.logged);
    return {
      calories: logged.reduce((sum, m) => sum + m.calories, 0),
      protein: logged.reduce((sum, m) => sum + m.protein, 0),
      carbs: logged.reduce((sum, m) => sum + m.carbs, 0),
      fat: logged.reduce((sum, m) => sum + m.fat, 0),
      fiber: logged.reduce((sum, m) => sum + m.fiber, 0),
    };
  };

  const currentDayPlan = weekPlans.find(p => isSameDay(p.date, selectedDate));
  const todayTotals = currentDayPlan ? getDayTotals(currentDayPlan.meals) : null;

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const last7Days = weekPlans.slice(-7);
    const totalCalories = last7Days.reduce((sum, day) => 
      sum + getDayTotals(day.meals).calories, 0
    );
    const avgCalories = Math.round(totalCalories / 7);
    const totalWater = last7Days.reduce((sum, day) => sum + day.waterIntake, 0);
    const avgWater = Math.round(totalWater / 7);
    const exerciseDays = last7Days.filter(day => day.exercise).length;
    
    return {
      avgCalories,
      avgWater,
      exerciseDays,
      trend: avgCalories < userProfile.dailyCalorieGoal ? 'deficit' : 
             avgCalories > userProfile.dailyCalorieGoal ? 'surplus' : 'maintenance'
    };
  }, [weekPlans, userProfile]);

  // Log meal
  const logMeal = (mealId: string) => {
    setWeekPlans(prev => prev.map(plan => {
      if (isSameDay(plan.date, selectedDate)) {
        return {
          ...plan,
          meals: plan.meals.map(meal => 
            meal.id === mealId ? { ...meal, logged: !meal.logged } : meal
          )
        };
      }
      return plan;
    }));
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    track('meal_logged', { mealId, date: selectedDate });
  };

  // Add water
  const addWater = () => {
    setWeekPlans(prev => prev.map(plan => {
      if (isSameDay(plan.date, selectedDate)) {
        const newIntake = Math.min(plan.waterIntake + 1, userProfile.waterGoal);
        if (newIntake === userProfile.waterGoal) {
          Alert.alert('Goal Achieved! 💧', 'You\'ve reached your daily water goal!');
        }
        return { ...plan, waterIntake: newIntake };
      }
      return plan;
    }));
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getMealIcon = (type: MealType) => {
    switch(type) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'restaurant';
      case 'dinner': return 'moon';
      case 'snack': return 'nutrition';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: palette.text }]}>Meal Planner</Text>
            <Text style={[styles.headerSubtitle, { color: palette.subtext }]}>Track nutrition & goals</Text>
          </View>
          <TouchableOpacity style={[styles.settingsButton, { backgroundColor: palette.surface }]}>
            <Ionicons name="settings-outline" size={24} color={palette.text} />
          </TouchableOpacity>
        </View>

        {/* Daily Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e0e0e0' }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: '#1a1a1a' }]}>Today's Progress</Text>
            <Text style={[styles.progressDate, { color: '#666666' }]}>{format(selectedDate, 'EEEE, MMM d')}</Text>
          </View>
          
          <View style={styles.calorieProgress}>
            <View style={[styles.calorieCircle, { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0' }]}>
              <Text style={[styles.calorieNumber, { color: '#1a1a1a' }]}>{todayTotals?.calories || 0}</Text>
              <Text style={[styles.calorieLabel, { color: '#666666' }]}>of {userProfile.dailyCalorieGoal}</Text>
              <Text style={[styles.calorieUnit, { color: '#1a1a1a' }]}>calories</Text>
            </View>
            
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <View style={[styles.macroDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={[styles.macroValue, { color: '#1a1a1a' }]}>{todayTotals?.protein || 0}g</Text>
                <Text style={[styles.macroLabel, { color: '#666666' }]}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroDot, { backgroundColor: '#4ECDC4' }]} />
                <Text style={[styles.macroValue, { color: '#1a1a1a' }]}>{todayTotals?.carbs || 0}g</Text>
                <Text style={[styles.macroLabel, { color: '#666666' }]}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroDot, { backgroundColor: '#FFD93D' }]} />
                <Text style={[styles.macroValue, { color: '#1a1a1a' }]}>{todayTotals?.fat || 0}g</Text>
                <Text style={[styles.macroLabel, { color: '#666666' }]}>Fat</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: '#f0f0f0' }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min((todayTotals?.calories || 0) / userProfile.dailyCalorieGoal * 100, 100)}%`,
                    backgroundColor: (todayTotals?.calories || 0) > userProfile.dailyCalorieGoal ? '#FFD93D' : '#4ECDC4'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressPercentage, { color: '#1a1a1a' }]}>
              {Math.round((todayTotals?.calories || 0) / userProfile.dailyCalorieGoal * 100)}%
            </Text>
          </View>
        </View>

        {/* Water Intake */}
        <View style={styles.waterSection}>
          <View style={styles.waterHeader}>
            <View style={styles.waterTitle}>
              <Ionicons name="water-outline" size={24} color={palette.primary} />
              <Text style={[styles.sectionTitle, { color: palette.text }]}>Water Intake</Text>
            </View>
            <Text style={[styles.waterCount, { color: palette.subtext }]}>
              {currentDayPlan?.waterIntake || 0} / {userProfile.waterGoal} glasses
            </Text>
          </View>
          
          <View style={styles.waterGlasses}>
            {Array.from({ length: userProfile.waterGoal }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={addWater}
                disabled={index < (currentDayPlan?.waterIntake || 0)}
              >
                <Ionicons 
                  name={index < (currentDayPlan?.waterIntake || 0) ? "water" : "water-outline"} 
                  size={32} 
                  color={index < (currentDayPlan?.waterIntake || 0) ? palette.primary : palette.border}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Week Overview */}
        <View style={styles.weekSection}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Week Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekScroll}>
            {weekPlans.map((plan, index) => {
              const dayTotals = getDayTotals(plan.meals);
              const isSelected = isSameDay(plan.date, selectedDate);
              const percentage = (dayTotals.calories / userProfile.dailyCalorieGoal) * 100;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCard, 
                    { backgroundColor: isSelected ? palette.primary : palette.surface }
                  ]}
                  onPress={() => setSelectedDate(plan.date)}
                >
                  <Text style={[styles.dayName, { color: isSelected ? '#fff' : palette.subtext }]}>
                    {format(plan.date, 'EEE')}
                  </Text>
                  <Text style={[styles.dayDate, { color: isSelected ? '#fff' : palette.text }]}>
                    {format(plan.date, 'd')}
                  </Text>
                  <View style={styles.dayProgress}>
                    <View 
                      style={[
                        styles.dayProgressBar,
                        { 
                          height: `${Math.min(percentage, 100)}%`,
                          backgroundColor: percentage > 100 ? '#FFD93D' : 
                                         percentage > 80 ? '#4ECDC4' : '#E0E0E0'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.dayCalories, { color: isSelected ? '#fff' : palette.subtext }]}>
                    {dayTotals.calories}
                  </Text>
                  {plan.exercise && (
                    <Ionicons name="fitness" size={16} color={palette.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Today's Meals */}
        <View style={styles.mealsSection}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Today's Meals</Text>
          {currentDayPlan?.meals.map(meal => (
            <TouchableOpacity
              key={meal.id}
              style={[
                styles.mealCard,
                { backgroundColor: palette.surface },
                meal.logged && styles.mealCardLogged
              ]}
              onPress={() => logMeal(meal.id)}
            >
              <View style={[styles.mealIcon, { backgroundColor: palette.bg }]}>
                <Ionicons 
                  name={getMealIcon(meal.type) as any} 
                  size={24} 
                  color={meal.logged ? Colors.success : palette.subtext} 
                />
              </View>
              
              <View style={styles.mealInfo}>
                <Text style={[styles.mealType, { color: palette.subtext }]}>
                  {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                </Text>
                <Text style={[styles.mealName, { color: palette.text }]}>{meal.name}</Text>
                <View style={styles.mealMacros}>
                  <Text style={[styles.mealMacro, { color: palette.subtext }]}>
                    {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                  </Text>
                </View>
              </View>
              
              <View style={styles.mealStatus}>
                {meal.logged ? (
                  <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
                ) : (
                  <Ionicons name="circle-outline" size={28} color={palette.border} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Weekly Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <Ionicons name="flame-outline" size={24} color={palette.primary} />
              <Text style={[styles.statValue, { color: palette.text }]}>{weeklyStats.avgCalories}</Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Avg Daily Calories</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <Ionicons name="water-outline" size={24} color="#4ECDC4" />
              <Text style={[styles.statValue, { color: palette.text }]}>{weeklyStats.avgWater}</Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Avg Water/Day</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <Ionicons name="fitness-outline" size={24} color="#FF6B6B" />
              <Text style={[styles.statValue, { color: palette.text }]}>{weeklyStats.exerciseDays}</Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Exercise Days</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <Ionicons name="trending-down-outline" size={24} color="#FFD93D" />
              <Text style={[styles.statValue, { color: palette.text }]}>
                {weeklyStats.trend === 'deficit' ? '▼' : weeklyStats.trend === 'surplus' ? '▲' : '='}
              </Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Calorie Trend</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionGradient, { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e0e0e0' }]}>
              <Ionicons name="barcode-outline" size={24} color="#FF6B6B" />
              <Text style={[styles.actionText, { color: '#1a1a1a' }]}>Scan Food</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/ai-camera' as any)}
          >
            <View style={[styles.actionGradient, { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e0e0e0' }]}>
              <MaterialCommunityIcons name="robot" size={24} color="#667eea" />
              <Text style={[styles.actionText, { color: '#1a1a1a' }]}>AI Recipe</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Original Planner Content */}
        <View style={styles.originalPlanner}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Recipe Plan</Text>
          <Text style={{ color: palette.subtext, marginTop: theme.space.sm }}>Estimated weekly cost: KES {plan.totalEstimatedCostKES}</Text>

          <View style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
            {plan.days.map((d) => (
              <View key={d.date} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: theme.space.md }}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>{d.date}</Text>
                {d.meals.map((m, i) => {
                  const rec = recipes.find(r => r.id === m.recipeId);
                  return (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.space.xs }}>
                      <Text style={{ color: palette.subtext }}>{m.mealType}</Text>
                      <Text style={{ color: palette.text, fontWeight: '600' }}>{rec?.title}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  progressDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  calorieProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calorieCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  calorieNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  calorieLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  calorieUnit: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  macrosContainer: {
    flex: 1,
    marginLeft: 30,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 6,
  },
  macroLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
    textAlign: 'right',
  },
  waterSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waterCount: {
    fontSize: 14,
  },
  waterGlasses: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  weekSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  weekScroll: {
    paddingHorizontal: 20,
  },
  dayCard: {
    width: 70,
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  dayProgress: {
    width: 4,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  dayProgressBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  dayCalories: {
    fontSize: 11,
  },
  mealsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  mealCardLogged: {
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  mealIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
  },
  mealMacros: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealMacro: {
    fontSize: 12,
  },
  mealStatus: {
    marginLeft: 12,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  actionGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  originalPlanner: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bottomSpacing: {
    height: 20,
  },
});

