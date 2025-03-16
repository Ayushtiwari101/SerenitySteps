import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ChevronDown, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DietPlan.css';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

const foodCategories = {
  protein: [
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 13 },
    { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    { name: 'Tofu', calories: 144, protein: 15.9, carbs: 3.3, fat: 8.7 },
  ],
  carbs: [
    { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
    { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 23.6, fat: 0.2 },
    { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
    { name: 'Oats', calories: 307, protein: 13, carbs: 55, fat: 5 },
    { name: 'Whole Wheat Bread', calories: 69, protein: 3.6, carbs: 12, fat: 1 },
  ],
  fats: [
    { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14 },
    { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
    { name: 'Chia Seeds', calories: 138, protein: 4.7, carbs: 12, fat: 8.7 },
    { name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16 },
  ],
  vegetables: [
    { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: 'Kale', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9 },
    { name: 'Bell Peppers', calories: 31, protein: 1, carbs: 6, fat: 0.3 },
    { name: 'Carrots', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
  ],
};

const DietPlan = () => {
  const [userStats, setUserStats] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain',
    unit: 'kg',
    heightUnit: 'cm'
  });

  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/nutrition-plan`, {
        userId: '123', // Replace with actual user ID from auth
        ...userStats
      });
      
      setNutritionPlan(response.data);
      toast.success('Nutrition plan calculated successfully!');
    } catch (error) {
      console.error('Error calculating nutrition plan:', error);
      toast.error(error.response?.data?.error || 'Failed to calculate nutrition plan');
    }
  };

  const addFoodToMeal = async (meal, food) => {
    try {
      setMealPlan(prev => ({
        ...prev,
        [meal]: [...prev[meal], food]
      }));

      // Save meal selection to backend
      await axios.post(`${API_URL}/save-meals`, {
        userId: '123', // Replace with actual user ID
        selectedMeals: {
          ...mealPlan,
          [meal]: [...mealPlan[meal], food]
        },
        date: new Date()
      });

      toast.success(`Added ${food.name} to ${meal}`);
    } catch (error) {
      console.error('Error saving meal:', error);
      toast.error('Failed to save meal selection');
    }
  };

  const removeFoodFromMeal = async (meal, index) => {
    try {
      const updatedMealPlan = {
        ...mealPlan,
        [meal]: mealPlan[meal].filter((_, i) => i !== index)
      };

      setMealPlan(updatedMealPlan);

      // Update meal selection in backend
      await axios.post(`${API_URL}/save-meals`, {
        userId: '123', // Replace with actual user ID
        selectedMeals: updatedMealPlan,
        date: new Date()
      });

      toast.success('Meal removed successfully');
    } catch (error) {
      console.error('Error removing meal:', error);
      toast.error('Failed to remove meal');
    }
  };

  const calculateMealTotals = (meal) => {
    return mealPlan[meal].reduce((acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <div className="diet-plan-container">
      <nav className="diet-nav">
        <Link to="/home" className="back-button">← Back to Home</Link>
        <h1 className="nav-title">Diet Planner</h1>
      </nav>

      <div className="main-content">
        <section className="calculator-section">
          <h2><Calculator className="inline-icon" /> Nutrition Calculator</h2>
          <form onSubmit={handleCalculate} className="calculator-form">
            <div className="form-group">
              <label>Weight</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  name="weight"
                  value={userStats.weight}
                  onChange={handleInputChange}
                  required
                />
                <select name="unit" value={userStats.unit} onChange={handleInputChange}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Height</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  name="height"
                  value={userStats.height}
                  onChange={handleInputChange}
                  required
                />
                <select name="heightUnit" value={userStats.heightUnit} onChange={handleInputChange}>
                  <option value="cm">cm</option>
                  <option value="in">inches</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={userStats.age}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={userStats.gender} onChange={handleInputChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select name="activityLevel" value={userStats.activityLevel} onChange={handleInputChange}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Exercise</option>
                <option value="moderate">Moderate Exercise</option>
                <option value="active">Active</option>
                <option value="veryActive">Very Active</option>
              </select>
            </div>

            <div className="form-group">
              <label>Goal</label>
              <select name="goal" value={userStats.goal} onChange={handleInputChange}>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <button type="submit" className="calculate-btn">
              Calculate Plan
            </button>
          </form>

          {nutritionPlan && (
            <div className="results">
              <div className="result-card">
                <h3>Daily Calories</h3>
                <p className="result-value">{nutritionPlan.dailyCalories}</p>
                <p className="result-description">Recommended daily intake</p>
              </div>
              <div className="result-card">
                <h3>Protein</h3>
                <p className="result-value">{nutritionPlan.protein}g</p>
                <p className="result-description">Daily protein target</p>
              </div>
              <div className="result-card">
                <h3>Carbs</h3>
                <p className="result-value">{nutritionPlan.carbs}g</p>
                <p className="result-description">Daily carbs target</p>
              </div>
              <div className="result-card">
                <h3>Fats</h3>
                <p className="result-value">{nutritionPlan.fats}g</p>
                <p className="result-description">Daily fats target</p>
              </div>
            </div>
          )}
        </section>

        <section className="meal-planner-section">
          <h2>Custom Meal Planner</h2>
          
          {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
            <div key={meal} className="meal-section">
              <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
              
              <div className="food-selector">
                {Object.entries(foodCategories).map(([category, foods]) => (
                  <div key={category} className="food-category">
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <div className="food-list">
                      {foods.map((food, index) => (
                        <div key={index} className="food-item">
                          <span>{food.name}</span>
                          <button
                            onClick={() => addFoodToMeal(meal, food)}
                            className="add-food-btn"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="selected-foods">
                {mealPlan[meal].map((food, index) => (
                  <div key={index} className="selected-food-item">
                    <span>{food.name}</span>
                    <div className="food-stats">
                      <span>{food.calories} cal</span>
                      <span>{food.protein}g protein</span>
                      <span>{food.carbs}g carbs</span>
                      <span>{food.fat}g fat</span>
                    </div>
                    <button
                      onClick={() => removeFoodFromMeal(meal, index)}
                      className="remove-food-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {mealPlan[meal].length > 0 && (
                  <div className="meal-totals">
                    <h4>Meal Totals</h4>
                    <div className="totals-stats">
                      {Object.entries(calculateMealTotals(meal)).map(([key, value]) => (
                        <span key={key}>
                          {key}: {Math.round(value)}
                          {key === 'calories' ? ' cal' : 'g'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default DietPlan;