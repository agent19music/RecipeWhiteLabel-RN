import Dialog from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { demoPlan, recipes } from '@/data/seed';
import { useDialog } from '@/hooks/useDialog';
import { useTheme } from '@/theme';
import { track } from '@/utils/analytics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDays, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SettingsIcon } from 'lucide-react-native';
import { CheckCircleIcon, CircleIcon, CookieIcon, ForkKnifeIcon, GaugeIcon, MoonIcon, PintGlassIcon, SunHorizonIcon } from 'phosphor-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



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
  const { dialog, showErrorDialog, showDialog, hideDialog } = useDialog();
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
            <SettingsIcon size={24} color={palette.text} />
          </TouchableOpacity>
        </View>

        {/* Daily Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: palette.surface }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: palette.text }]}>Today's Progress</Text>
            <Text style={[styles.progressDate, { color: palette.subtext }]}>{format(selectedDate, 'EEEE, MMM d')}</Text>
          </View>
          
          {/* Main Progress Row */}
          <View style={styles.mainProgressRow}>
            {/* Calories Circle */}
            <View style={[styles.calorieCircle, { backgroundColor: palette.bg, borderColor: palette.border }]}>
              <Text style={[styles.calorieNumber, { color: palette.text }]}>{todayTotals?.calories || 0}</Text>
              <Text style={[styles.calorieLabel, { color: palette.subtext }]}>of {userProfile.dailyCalorieGoal}</Text>
              <Text style={[styles.calorieUnit, { color: palette.text }]}>calories</Text>
            </View>
            
            {/* Water Progress Circle */}
            <TouchableOpacity 
              style={[styles.waterCircle, { backgroundColor: palette.bg, borderColor: palette.border }]}
              onPress={addWater}
            >
              <View style={styles.waterProgressRing}>
                <View 
                  style={[
                    styles.waterProgressFill,
                    {
                      backgroundColor: Colors.water,
                      height: `${((currentDayPlan?.waterIntake || 0) / userProfile.waterGoal) * 100}%`
                    }
                  ]}
                />
              </View>
              <View style={styles.waterContent}>
                <PintGlassIcon size={24} color={Colors.water} />
                <Text style={[styles.waterNumber, { color: palette.text }]}>{currentDayPlan?.waterIntake || 0}</Text>
                <Text style={[styles.waterLabel, { color: palette.subtext }]}>of {userProfile.waterGoal}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Macros Row */}
          <View style={styles.macrosRow}>
            <View style={styles.macroCard}>
              <View style={[styles.macroDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={[styles.macroValue, { color: palette.text }]}>{todayTotals?.protein || 0}g</Text>
              <Text style={[styles.macroLabel, { color: palette.subtext }]}>Protein</Text>
            </View>
            <View style={styles.macroCard}>
              <View style={[styles.macroDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={[styles.macroValue, { color: palette.text }]}>{todayTotals?.carbs || 0}g</Text>
              <Text style={[styles.macroLabel, { color: palette.subtext }]}>Carbs</Text>
            </View>
            <View style={styles.macroCard}>
              <View style={[styles.macroDot, { backgroundColor: '#FFD93D' }]} />
              <Text style={[styles.macroValue, { color: palette.text }]}>{todayTotals?.fat || 0}g</Text>
              <Text style={[styles.macroLabel, { color: palette.subtext }]}>Fat</Text>
            </View>
          </View>

          {/* Calorie Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Text style={[styles.progressBarLabel, { color: palette.subtext }]}>Calorie Goal Progress</Text>
            <View style={[styles.progressBar, { backgroundColor: palette.bg }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min((todayTotals?.calories || 0) / userProfile.dailyCalorieGoal * 100, 100)}%`,
                    backgroundColor: (todayTotals?.calories || 0) > userProfile.dailyCalorieGoal ? '#FF6B6B' : '#4ECDC4'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressPercentage, { color: palette.text }]}>
              {Math.round((todayTotals?.calories || 0) / userProfile.dailyCalorieGoal * 100)}%
            </Text>
          </View>
        </View>

        {/* Week Overview */}
        {/* <View style={styles.weekSection}>
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
                    <GaugeIcon size={16} color={palette.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View> */}

        {/* Today's Meals */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Today&apos;s Meals</Text>
            <Text style={[styles.sectionSubtitle, { color: palette.subtext }]}>
              {currentDayPlan?.meals.filter(m => m.logged).length || 0} of {currentDayPlan?.meals.length || 0} logged
            </Text>
          </View>
          
          <View style={styles.mealsContainer}>
            {currentDayPlan?.meals.map(meal => (
              <TouchableOpacity
                key={meal.id}
                style={[
                  styles.mealCard,
                  { backgroundColor: palette.surface },
                  meal.logged && [styles.mealCardLogged, { borderColor: Colors.success + '40' }]
                ]}
                onPress={() => logMeal(meal.id)}
              >
                <View style={styles.mealCardHeader}>
                  <View style={styles.mealTitleRow}>
                    <View style={[styles.mealIcon, { backgroundColor: meal.logged ? Colors.success + '20' : palette.bg }]}>
                      {meal.type === 'breakfast' && (
                        <SunHorizonIcon 
                          size={20} 
                          color={meal.logged ? Colors.success : palette.subtext} 
                        />
                      )}
                      {meal.type === 'lunch' && (
                        <ForkKnifeIcon 
                          size={20} 
                          color={meal.logged ? Colors.success : palette.subtext} 
                        />
                      )}
                      {meal.type === 'dinner' && (
                        <MoonIcon 
                          size={20} 
                          color={meal.logged ? Colors.success : palette.subtext} 
                        />
                      )}
                      {meal.type === 'snack' && (
                        <CookieIcon 
                          size={20} 
                          color={meal.logged ? Colors.success : palette.subtext} 
                        />
                      )}
                    </View>
                    
                    <View style={styles.mealInfo}>
                      <Text style={[styles.mealType, { color: palette.subtext }]}>
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} • {meal.time}
                      </Text>
                      <Text style={[styles.mealName, { color: palette.text }]}>{meal.name}</Text>
                    </View>
                    
                    <View style={styles.mealStatus}>
                      {meal.logged ? (
                        <CheckCircleIcon size={24} color={Colors.success} />
                      ) : (
                        <CircleIcon size={24} color={palette.border} />
                      )}
                    </View>
                  </View>
                </View>
                
                <View style={styles.mealNutrition}>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: palette.text }]}>{meal.calories}</Text>
                    <Text style={[styles.nutritionLabel, { color: palette.subtext }]}>cal</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: palette.text }]}>{meal.protein}g</Text>
                    <Text style={[styles.nutritionLabel, { color: palette.subtext }]}>protein</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: palette.text }]}>{meal.carbs}g</Text>
                    <Text style={[styles.nutritionLabel, { color: palette.subtext }]}>carbs</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: palette.text }]}>{meal.fat}g</Text>
                    <Text style={[styles.nutritionLabel, { color: palette.subtext }]}>fat</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Weekly Summary</Text>
            <Text style={[styles.sectionSubtitle, { color: palette.subtext }]}>Last 7 days</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <View style={styles.statIconContainer}>
                <GaugeIcon size={20} color={palette.primary} />
              </View>
              <Text style={[styles.statValue, { color: palette.text }]}>{weeklyStats.avgCalories}</Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Avg Daily Cal</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <View style={styles.statIconContainer}>
                <PintGlassIcon size={20} color={Colors.water} />
              </View>
              <Text style={[styles.statValue, { color: palette.text }]}>{weeklyStats.avgWater}</Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Avg Water/Day</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: palette.surface }]}>
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons name="fire" size={20} color="#FF6B6B" />
              </View>
              <Text style={[styles.statValue, { color: palette.text }]}>{weeklyStats.exerciseDays}</Text>
              <Text style={[styles.statLabel, { color: palette.subtext }]}>Active Days</Text>
            </View>
          </View>
        </View>



        {/* Recipe Plan */}
        <View style={styles.recipePlanSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Recipe Plan</Text>
            <Text style={[styles.sectionSubtitle, { color: palette.subtext }]}>This week</Text>
          </View>

          <View style={styles.recipeDaysContainer}>
            {plan.days.slice(0, 3).map((d) => (
              <View key={d.date} style={[styles.recipeDayCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={[styles.recipeDayDate, { color: palette.text }]}>{d.date}</Text>
                <View style={styles.recipeMealsContainer}>
                  {d.meals.slice(0, 2).map((m, i) => {
                    const rec = recipes.find(r => r.id === m.recipeId);
                    return (
                      <View key={i} style={styles.recipeMealRow}>
                        <Text style={[styles.recipeMealType, { color: palette.subtext }]}>
                          {m.type || 'Meal'}
                        </Text>
                        <Text style={[styles.recipeMealName, { color: palette.text }]} numberOfLines={1}>
                          {rec?.title || 'Recipe'}
                        </Text>
                      </View>
                    );
                  })}
                  {d.meals.length > 2 && (
                    <Text style={[styles.moreRecipes, { color: palette.subtext }]}>+{d.meals.length - 2} more</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      <Dialog
        visible={dialog.visible}
        onClose={hideDialog}
        title={dialog.title}
        message={dialog.message}
        icon={dialog.icon}
        actions={dialog.actions}
      />
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
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  progressHeader: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  progressDate: {
    fontSize: 14,
    marginTop: 4,
  },
  mainProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calorieCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  calorieNumber: {
    fontSize: 26,
    fontWeight: '700',
  },
  calorieLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  calorieUnit: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  waterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  waterProgressRing: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    borderRadius: 50,
    overflow: 'hidden',
  },
  waterProgressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 50,
    opacity: 0.2,
  },
  waterContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  waterNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  waterLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 12,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  mealCardLogged: {
    borderWidth: 1,
  },
  mealCardHeader: {
    marginBottom: 12,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  mealStatus: {
    marginLeft: 12,
  },
  mealNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  nutritionLabel: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  recipePlanSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recipeDaysContainer: {
    gap: 12,
  },
  recipeDayCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  recipeDayDate: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  recipeMealsContainer: {
    gap: 8,
  },
  recipeMealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeMealType: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  recipeMealName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  moreRecipes: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 24,
  },
});

