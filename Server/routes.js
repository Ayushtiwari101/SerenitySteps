const express = require('express');
const router = express.Router();
const { userModel } = require('./UserSchema');
const { mealModel } = require('./MealSchema');
const { nutritionPlanModel } = require('./NutritionSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.use(express.json());

// Signup route with bcrypt password hashing
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Login route with JWT
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

// Get user data
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

// Calculate and save nutrition plan
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

        // Convert measurements to metric
        const weightInKg = unit === 'lbs' ? weight * 0.453592 : parseFloat(weight);
        const heightInCm = heightUnit === 'in' ? height * 2.54 : parseFloat(height);

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
        } else {
            bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
        }

        // Calculate TDEE based on activity level
        const activityMultipliers = {
            sedentary: 1.2,      // Little or no exercise
            light: 1.375,        // Light exercise 1-3 days/week
            moderate: 1.55,      // Moderate exercise 3-5 days/week
            active: 1.725,       // Hard exercise 6-7 days/week
            veryActive: 1.9      // Very hard exercise & physical job or training
        };
        
        const tdee = bmr * activityMultipliers[activityLevel];

        // Adjust calories based on goal
        let dailyCalories;
        switch (goal) {
            case 'lose':
                dailyCalories = tdee - 500; // 500 calorie deficit for weight loss
                break;
            case 'gain':
                dailyCalories = tdee + 500; // 500 calorie surplus for weight gain
                break;
            default:
                dailyCalories = tdee; // Maintenance calories
        }

        // Calculate macronutrients based on goal
        let proteinRatio, carbsRatio, fatsRatio;
        switch (goal) {
            case 'lose':
                proteinRatio = 0.4;  // Higher protein to preserve muscle
                carbsRatio = 0.3;    // Lower carbs for fat loss
                fatsRatio = 0.3;     // Moderate fats for hormonal balance
                break;
            case 'gain':
                proteinRatio = 0.3;  // Moderate protein for muscle growth
                carbsRatio = 0.45;   // Higher carbs for energy and growth
                fatsRatio = 0.25;    // Lower fats to prioritize carbs
                break;
            default:
                proteinRatio = 0.3;  // Balanced macros for maintenance
                carbsRatio = 0.4;
                fatsRatio = 0.3;
        }

        // Calculate macros in grams
        const protein = Math.round((dailyCalories * proteinRatio) / 4); // 4 calories per gram of protein
        const carbs = Math.round((dailyCalories * carbsRatio) / 4);     // 4 calories per gram of carbs
        const fats = Math.round((dailyCalories * fatsRatio) / 9);       // 9 calories per gram of fat

        // Calculate water intake (33ml per kg of body weight)
        const waterIntake = Math.round((weightInKg * 0.033) * 10) / 10;

        // Save or update nutrition plan
        const nutritionPlan = await nutritionPlanModel.findOneAndUpdate(
            { userId },
            {
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
                waterIntake,
                updatedAt: Date.now()
            },
            { new: true, upsert: true }
        );

        res.status(200).json(nutritionPlan);
    } catch (error) {
        console.error('Error calculating nutrition plan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get meals by category
router.get('/meals/:category', async (req, res) => {
    try {
        const meals = await mealModel.find({ 
            category: req.params.category,
            isActive: true 
        }).sort({ name: 1 });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get meals by food group
router.get('/meals/group/:foodGroup', async (req, res) => {
    try {
        const meals = await mealModel.find({ 
            foodGroup: req.params.foodGroup,
            isActive: true 
        }).sort({ calories: 1 });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save selected meals
router.post('/save-meals', async (req, res) => {
    try {
        const { userId, selectedMeals, date } = req.body;
        
        // Validate meal selections
        const mealIds = Object.values(selectedMeals).filter(id => id);
        const validMeals = await mealModel.find({ _id: { $in: mealIds } });
        
        if (validMeals.length !== mealIds.length) {
            return res.status(400).json({ error: 'Invalid meal selection' });
        }

        const nutritionPlan = await nutritionPlanModel.findOneAndUpdate(
            { userId },
            { 
                $push: {
                    mealHistory: {
                        date: date || new Date(),
                        meals: selectedMeals
                    }
                },
                selectedMeals,
                updatedAt: Date.now()
            },
            { new: true }
        );
        
        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        
        res.status(200).json(nutritionPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get meal suggestions based on nutritional goals
router.post('/meal-suggestions', async (req, res) => {
    try {
        const { calories, protein, carbs, fats, excludeIds = [] } = req.body;
        
        // Calculate per-meal targets (assuming 3 main meals + 2 snacks)
        const mealCalories = calories / 5;
        const mealProtein = protein / 5;
        const mealCarbs = carbs / 5;
        const mealFats = fats / 5;

        // Find meals within 20% of target macros
        const suggestions = await mealModel.find({
            _id: { $nin: excludeIds },
            isActive: true,
            calories: { 
                $gte: mealCalories * 0.8,
                $lte: mealCalories * 1.2
            },
            protein: {
                $gte: mealProtein * 0.8,
                $lte: mealProtein * 1.2
            },
            carbs: {
                $gte: mealCarbs * 0.8,
                $lte: mealCarbs * 1.2
            },
            fats: {
                $gte: mealFats * 0.8,
                $lte: mealFats * 1.2
            }
        }).limit(10);

        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's meal history
router.get('/meal-history/:userId', async (req, res) => {
    try {
        const nutritionPlan = await nutritionPlanModel.findOne({ 
            userId: req.params.userId 
        }).populate('mealHistory.meals');
        
        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        
        res.status(200).json(nutritionPlan.mealHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;