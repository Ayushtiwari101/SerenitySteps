import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DietPlan.css';

function DietPlan() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [unit, setUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [showResults, setShowResults] = useState(false);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [availableMeals, setAvailableMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null
  });
  const [userId, setUserId] = useState(null); // Get this from your auth system
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const categories = ['breakfast', 'lunch', 'dinner', 'snack'];
        const meals = {};
        
        for (const category of categories) {
          const response = await axios.get(`/api/meals/${category}`);
          meals[category] = response.data;
        }
        
        setAvailableMeals(meals);
        setError(null);
      } catch (error) {
        console.error('Error fetching meals:', error);
        setError('Failed to load meal options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNutritionPlan = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/nutrition-plan/${userId}`);
        const plan = response.data;
        
        if (plan) {
          setWeight(plan.weight);
          setHeight(plan.height);
          setAge(plan.age);
          setGender(plan.gender);
          setActivityLevel(plan.activityLevel);
          setGoal(plan.goal);
          setUnit(plan.unit);
          setHeightUnit(plan.heightUnit);
          setCalories(plan.dailyCalories);
          setProtein(plan.protein);
          setCarbs(plan.carbs);
          setFats(plan.fats);
          setWaterIntake(plan.waterIntake);
          setSelectedMeals(plan.selectedMeals);
          setShowResults(true);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching nutrition plan:', error);
        setError('Failed to load your nutrition plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
    fetchNutritionPlan();
  }, [userId]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    if (!weight || !height || !age) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/nutrition-plan', {
        userId,
        weight,
        height,
        age,
        gender,
        activityLevel,
        goal,
        unit,
        heightUnit
      });
      
      const plan = response.data;
      setCalories(plan.dailyCalories);
      setProtein(plan.protein);
      setCarbs(plan.carbs);
      setFats(plan.fats);
      setWaterIntake(plan.waterIntake);
      setShowResults(true);
      setError(null);
    } catch (error) {
      console.error('Error calculating nutrition plan:', error);
      setError('Failed to calculate nutrition plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMealSelection = async (category, mealId) => {
    try {
      setLoading(true);
      const updatedMeals = {
        ...selectedMeals,
        [category]: mealId
      };
      
      setSelectedMeals(updatedMeals);
      
      await axios.post('/api/save-meals', {
        userId,
        selectedMeals: updatedMeals
      });
      
      setError(null);
    } catch (error) {
      console.error('Error saving meal selection:', error);
      setError('Failed to save meal selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateMealPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/regenerate-meals', {
        userId,
        calories,
        protein,
        carbs,
        fats
      });
      
      setSelectedMeals(response.data.selectedMeals);
      setError(null);
    } catch (error) {
      console.error('Error regenerating meal plan:', error);
      setError('Failed to regenerate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="diet-plan-container">
      <nav>
        <div className="navbar">
          <Link to="/home" className="title">Serenity Steps</Link>
        </div> 
      </nav>
      
      <div className="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80" 
          alt="Diet Plan background" 
          className="hero-image"
        />
        <h1 className="hero-title">Your Personalized Nutrition Journey</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="diet-content">
        {!showResults ? (
          <div className="calculator-container">
            <h2>Calculate Your Nutrition Needs</h2>
            <form onSubmit={handleCalculate}>
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <div className="input-with-unit">
                  <input 
                    type="number" 
                    id="weight" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    min="1"
                    required
                    placeholder="Enter your weight"
                  />
                  <select 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height</label>
                <div className="input-with-unit">
                  <input 
                    type="number" 
                    id="height" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    min="1"
                    required
                    placeholder="Enter your height"
                  />
                  <select 
                    value={heightUnit} 
                    onChange={(e) => setHeightUnit(e.target.value)}
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input 
                  type="number" 
                  id="age" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                  required
                  placeholder="Enter your age"
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male" 
                      checked={gender === 'male'} 
                      onChange={() => setGender('male')}
                    />
                    Male
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female" 
                      checked={gender === 'female'} 
                      onChange={() => setGender('female')}
                    />
                    Female
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="activity">Activity Level</label>
                <select 
                  id="activity" 
                  value={activityLevel} 
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="select-input"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="veryActive">Very Active (hard exercise & physical job)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="goal">Goal</label>
                <select 
                  id="goal" 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="select-input"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>
              
              <button type="submit" className="calculate-button">
                Calculate My Plan
              </button>
            </form>
          </div>
        ) : (
          <div className="results-container">
            <div className="nutrition-summary">
              <h2>Your Daily Nutrition Summary</h2>
              
              <div className="macro-cards">
                <div className="macro-card">
                  <div className="macro-icon calories">🔥</div>
                  <h3>Calories</h3>
                  <p>{calories}</p>
                </div>
                
                <div className="macro-card">
                  <div className="macro-icon protein">🥩</div>
                  <h3>Protein</h3>
                  <p>{protein}g</p>
                </div>
                
                <div className="macro-card">
                  <div className="macro-icon carbs">🍚</div>
                  <h3>Carbs</h3>
                  <p>{carbs}g</p>
                </div>
                
                <div className="macro-card">
                  <div className="macro-icon fats">🥑</div>
                  <h3>Fats</h3>
                  <p>{fats}g</p>
                </div>
                
                <div className="macro-card">
                  <div className="macro-icon water">💧</div>
                  <h3>Water</h3>
                  <p>{waterIntake}L</p>
                </div>
              </div>
            </div>
            
            <div className="meal-plan-section">
              <div className="meal-plan-header">
                <h2>Customize Your Meal Plan</h2>
                <button 
                  className="regenerate-button"
                  onClick={handleRegenerateMealPlan}
                  disabled={loading}
                >
                  Regenerate Meals
                </button>
              </div>
              
              {Object.keys(availableMeals).map((category) => (
                <div key={category} className="meal-category">
                  <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Options</h3>
                  <div className="meal-options">
                    {availableMeals[category].map((meal) => (
                      <div
                        key={meal._id}
                        className={`meal-option ${selectedMeals[category] === meal._id ? 'selected' : ''}`}
                        onClick={() => handleMealSelection(category, meal._id)}
                      >
                        <h4>{meal.name}</h4>
                        <p className="meal-description">{meal.description}</p>
                        <div className="meal-macros">
                          <span>Calories: {meal.calories}</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fats}g</span>
                        </div>
                        {meal.foodGroup && (
                          <div className="meal-tag">{meal.foodGroup}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="nutrition-tips">
              <h2>Nutrition Tips</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">🥗</div>
                  <h3>Balanced Diet</h3>
                  <p>Eat a variety of colorful fruits and vegetables for essential nutrients.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">💧</div>
                  <h3>Stay Hydrated</h3>
                  <p>Drink water throughout the day, especially before meals.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">🍳</div>
                  <h3>Meal Prep</h3>
                  <p>Plan and prepare meals in advance to maintain healthy eating habits.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">⏰</div>
                  <h3>Regular Meals</h3>
                  <p>Don't skip meals, especially breakfast, to maintain stable energy levels.</p>
                </div>
              </div>
            </div>
            
            <button 
              className="recalculate-button"
              onClick={handleReset}
              disabled={loading}
            >
              Recalculate Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DietPlan;