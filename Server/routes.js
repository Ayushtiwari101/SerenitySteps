const express = require('express');
const router = express.Router();
const { userModel } = require('./UserSchema');
const { mealModel } = require('./MealSchema');
const { nutritionPlanModel } = require('./NutritionSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.use(express.json());



// Signup route with bcrypt password hashing and rate limiting
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
        const newUser = await userModel.create({ username, password: hashedPassword });
        // Send a response indicating successful signup
        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        console.error(error.message);
         res.status(500).json({ error: error.message });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/data', async (req, res) => {
    try {
        const data = await userModel.find();
        res.status(200).send(data);
    } catch (err) {
        let statusCode = 500;
        let errorMessage = "Internal Server Error";

        if (err.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = "Validation Error";
        } else if (err.name === 'CastError') {
            statusCode = 404;
            errorMessage = "Resource Not Found";
        } else {
            console.error(err);
        }

        res.status(statusCode).send(errorMessage);
    }
});

// Get all available meals
router.get('/meals', async (req, res) => {
    try {
      const meals = await mealModel.find();
      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get meals by category
  router.get('/meals/:category', async (req, res) => {
    try {
      const meals = await mealModel.find({ category: req.params.category });
      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Calculate nutrition plan
  router.post('/nutrition-plan', async (req, res) => {
    try {
      const {
        userId,
        weight,
        height,
        age,
        gender,
        activityLevel,
        goal,
        unit,
        heightUnit
      } = req.body;
  
      // Convert measurements to metric if needed
      const weightInKg = unit === 'lbs' ? weight * 0.453592 : weight;
      const heightInCm = heightUnit === 'in' ? height * 2.54 : height;
  
      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (gender === 'male') {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
      }
  
      // Calculate TDEE based on activity level
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      
      const tdee = bmr * activityMultipliers[activityLevel];
  
      // Adjust calories based on goal
      let dailyCalories;
      switch (goal) {
        case 'lose':
          dailyCalories = tdee - 500;
          break;
        case 'gain':
          dailyCalories = tdee + 500;
          break;
        default:
          dailyCalories = tdee;
      }
  
      // Calculate macronutrients
      let proteinRatio, carbsRatio, fatsRatio;
      switch (goal) {
        case 'lose':
          proteinRatio = 0.4;
          carbsRatio = 0.3;
          fatsRatio = 0.3;
          break;
        case 'gain':
          proteinRatio = 0.3;
          carbsRatio = 0.45;
          fatsRatio = 0.25;
          break;
        default:
          proteinRatio = 0.3;
          carbsRatio = 0.4;
          fatsRatio = 0.3;
      }
  
      const protein = Math.round((dailyCalories * proteinRatio) / 4);
      const carbs = Math.round((dailyCalories * carbsRatio) / 4);
      const fats = Math.round((dailyCalories * fatsRatio) / 9);
      const waterIntake = Math.round((weightInKg * 0.033) * 10) / 10;
  
      const nutritionPlan = await nutritionPlanModel.create({
        userId,
        weight,
        height,
        age,
        gender,
        activityLevel,
        goal,
        unit,
        heightUnit,
        dailyCalories: Math.round(dailyCalories),
        protein,
        carbs,
        fats,
        waterIntake
      });
  
      res.status(201).json(nutritionPlan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user's nutrition plan
  router.get('/nutrition-plan/:userId', async (req, res) => {
    try {
      const nutritionPlan = await nutritionPlanModel
        .findOne({ userId: req.params.userId })
        .sort({ createdAt: -1 });
      res.status(200).json(nutritionPlan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Save selected meals
  router.post('/save-meals', async (req, res) => {
    try {
      const { userId, selectedMeals } = req.body;
      const nutritionPlan = await nutritionPlanModel.findOne({ userId });
      
      nutritionPlan.selectedMeals = selectedMeals;
      nutritionPlan.updatedAt = Date.now();
      await nutritionPlan.save();
      
      res.status(200).json(nutritionPlan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;