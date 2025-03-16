import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Workout.css';

function Workout() {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const workoutPlans = {
    monday: {
      focus: 'Upper Body',
      exercises: [
        {
          id: 1,
          name: 'Push-ups',
          sets: 3,
          reps: '10-12',
          animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Wide grip push-ups (for chest focus)',
            'Diamond push-ups (for triceps focus)',
            'Incline push-ups (easier version)',
            'Decline push-ups (harder version)'
          ],
          description: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.'
        },
        {
          id: 2,
          name: 'Dumbbell Rows',
          sets: 3,
          reps: '10-12 each arm',
          animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Bent-over barbell rows',
            'Inverted rows',
            'Seated cable rows',
            'T-bar rows'
          ],
          description: 'Bend at the waist with one knee and hand on a bench, pull the dumbbell up to your side, keeping your elbow close to your body.'
        },
        {
          id: 3,
          name: 'Shoulder Press',
          sets: 3,
          reps: '10-12',
          animation: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
          variations: [
            'Seated dumbbell press',
            'Arnold press',
            'Landmine press',
            'Pike push-ups'
          ],
          description: 'Sit or stand with dumbbells at shoulder height, press them overhead until arms are fully extended.'
        }
      ]
    },
    tuesday: {
      focus: 'Lower Body',
      exercises: [
        {
          id: 1,
          name: 'Squats',
          sets: 4,
          reps: '12-15',
          animation: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
          variations: [
            'Sumo squats (wider stance)',
            'Front squats (quad focus)',
            'Bulgarian split squats (single leg)',
            'Goblet squats (with dumbbell or kettlebell)'
          ],
          description: 'Stand with feet shoulder-width apart, lower your body as if sitting in a chair, keeping your back straight and knees over toes.'
        },
        {
          id: 2,
          name: 'Lunges',
          sets: 3,
          reps: '10 each leg',
          animation: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
          variations: [
            'Walking lunges',
            'Reverse lunges',
            'Lateral lunges',
            'Curtsy lunges'
          ],
          description: 'Step forward with one leg, lowering your hips until both knees are bent at about a 90-degree angle.'
        },
        {
          id: 3,
          name: 'Calf Raises',
          sets: 3,
          reps: '15-20',
          animation: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
          variations: [
            'Single leg calf raises',
            'Seated calf raises',
            'Donkey calf raises',
            'Jump rope'
          ],
          description: 'Stand with feet hip-width apart, raise your heels off the ground by pushing through the balls of your feet.'
        }
      ]
    },
    wednesday: {
      focus: 'Core & Cardio',
      exercises: [
        {
          id: 1,
          name: 'Plank',
          sets: 3,
          reps: '30-60 seconds',
          animation: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Side plank',
            'Plank with shoulder taps',
            'Plank jacks',
            'Forearm plank'
          ],
          description: 'Hold a push-up position with your body in a straight line from head to heels, engaging your core.'
        },
        {
          id: 2,
          name: 'Russian Twists',
          sets: 3,
          reps: '20 total (10 each side)',
          animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Weighted Russian twists',
            'Medicine ball twists',
            'Bicycle crunches',
            'Standing Russian twists'
          ],
          description: 'Sit on the floor with knees bent, lean back slightly, and twist your torso from side to side.'
        },
        {
          id: 3,
          name: 'Mountain Climbers',
          sets: 3,
          reps: '30 seconds',
          animation: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
          variations: [
            'Slow mountain climbers',
            'Cross-body mountain climbers',
            'Spider mountain climbers',
            'Mountain climbers with sliders'
          ],
          description: 'Start in a plank position and alternate bringing your knees toward your chest in a running motion.'
        }
      ]
    },
    thursday: {
      focus: 'Upper Body',
      exercises: [
        {
          id: 1,
          name: 'Tricep Dips',
          sets: 3,
          reps: '10-15',
          animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
          variations: [
            'Bench dips',
            'Chair dips',
            'Parallel bar dips',
            'Ring dips'
          ],
          description: 'Using a chair or bench, place hands at edge with fingers forward, lower body by bending elbows, then push back up.'
        },
        {
          id: 2,
          name: 'Pull-ups/Chin-ups',
          sets: 3,
          reps: 'As many as possible',
          animation: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          variations: [
            'Assisted pull-ups',
            'Negative pull-ups',
            'Wide grip pull-ups',
            'Commando pull-ups'
          ],
          description: 'Hang from a bar with hands shoulder-width apart, pull your body up until your chin is over the bar.'
        },
        {
          id: 3,
          name: 'Bicep Curls',
          sets: 3,
          reps: '12-15',
          animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Hammer curls',
            'Concentration curls',
            'Preacher curls',
            'Reverse curls'
          ],
          description: 'Stand with dumbbells at your sides, palms facing forward, curl the weights toward your shoulders.'
        }
      ]
    },
    friday: {
      focus: 'Lower Body',
      exercises: [
        {
          id: 1,
          name: 'Deadlifts',
          sets: 3,
          reps: '8-10',
          animation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Romanian deadlifts',
            'Sumo deadlifts',
            'Single-leg deadlifts',
            'Kettlebell deadlifts'
          ],
          description: 'Stand with feet hip-width apart, bend at hips and knees to lower and grab weights, then stand up straight.'
        },
        {
          id: 2,
          name: 'Glute Bridges',
          sets: 3,
          reps: '15-20',
          animation: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Single-leg glute bridges',
            'Weighted glute bridges',
            'Elevated glute bridges',
            'Marching glute bridges'
          ],
          description: 'Lie on your back with knees bent, feet flat on the floor, lift hips toward the ceiling, squeezing glutes at the top.'
        },
        {
          id: 3,
          name: 'Leg Press',
          sets: 3,
          reps: '12-15',
          animation: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'Wide stance leg press',
            'Single-leg press',
            'Calf raises on leg press',
            'Low foot position (quad focus)'
          ],
          description: 'Sit in a leg press machine, push the platform away by extending your legs, then slowly return to starting position.'
        }
      ]
    },
    saturday: {
      focus: 'Full Body & Flexibility',
      exercises: [
        {
          id: 1,
          name: 'Burpees',
          sets: 3,
          reps: '10-15',
          animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
          variations: [
            'No push-up burpees',
            'No jump burpees',
            'Burpee with tuck jump',
            'One-legged burpees'
          ],
          description: 'Start standing, drop to a squat position, kick feet back to a plank, do a push-up, jump feet back to squat, then jump up.'
        },
        {
          id: 2,
          name: 'Kettlebell Swings',
          sets: 3,
          reps: '15-20',
          animation: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'One-arm kettlebell swings',
            'American kettlebell swings',
            'Double kettlebell swings',
            'Kettlebell figure-8s'
          ],
          description: 'Stand with feet shoulder-width apart, hinge at hips and swing kettlebell between legs, then thrust hips forward to swing it up.'
        },
        {
          id: 3,
          name: 'Yoga Flow',
          sets: 1,
          reps: '10-15 minutes',
          animation: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
          variations: [
            'Sun salutations',
            'Warrior sequence',
            'Balance poses',
            'Gentle stretching'
          ],
          description: 'Flow through a series of yoga poses focusing on breath, flexibility, and mindfulness.'
        }
      ]
    },
    sunday: {
      focus: 'Rest & Recovery',
      exercises: [
        {
          id: 1,
          name: 'Light Walking',
          sets: 1,
          reps: '20-30 minutes',
          animation: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          variations: [
            'Nature walk',
            'Treadmill walking',
            'Walking meditation',
            'Incline walking'
          ],
          description: 'Take a gentle walk to promote blood flow and recovery without taxing your muscles.'
        },
        {
          id: 2,
          name: 'Foam Rolling',
          sets: 1,
          reps: '10-15 minutes',
          animation: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: [
            'IT band rolling',
            'Quad rolling',
            'Back rolling',
            'Calf rolling'
          ],
          description: 'Use a foam roller to massage tight muscles and fascia, spending extra time on sore areas.'
        },
        {
          id: 3,
          name: 'Stretching Routine',
          sets: 1,
          reps: '15-20 minutes',
          animation: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
          variations: [
            'Dynamic stretching',
            'Static stretching',
            'PNF stretching',
            'Active isolated stretching'
          ],
          description: 'Perform a full-body stretching routine, holding each stretch for 20-30 seconds.'
        }
      ]
    }
  };

  useEffect(() => {
    // Load completed exercises from localStorage
    const savedExercises = localStorage.getItem('completedExercises');
    if (savedExercises) {
      setCompletedExercises(JSON.parse(savedExercises));
    }
  }, []);

  const saveCompletedExercise = (exerciseId) => {
    const today = new Date().toISOString().split('T')[0];
    const newCompletedExercise = {
      day: selectedDay,
      exerciseId,
      date: today
    };
    
    const updatedCompletedExercises = [...completedExercises, newCompletedExercise];
    setCompletedExercises(updatedCompletedExercises);
    localStorage.setItem('completedExercises', JSON.stringify(updatedCompletedExercises));
  };

  const isExerciseCompleted = (exerciseId) => {
    const today = new Date().toISOString().split('T')[0];
    return completedExercises.some(ex => 
      ex.day === selectedDay && 
      ex.exerciseId === exerciseId && 
      ex.date === today
    );
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowAnimation(true);
  };

  const closeExerciseDetails = () => {
    setSelectedExercise(null);
    setShowAnimation(false);
  };

  const markAsCompleted = (exerciseId) => {
    saveCompletedExercise(exerciseId);
  };

  return (
    <div className="workout-container">
      <nav>
                <div className='workout-navbar'>
                <Link to="/home" className="back-button">← Back to Home</Link>
                <h1 className='workout-head'>Workout Session</h1>                          
                </div> 
            </nav>
      <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Workout background" id='workout-bg'/>
      
      <div className="workout-content">
        <h1 className="workout-title">Your Personalized Workout Plan</h1>
        
        <div className="day-selector">
          <button 
            className={selectedDay === 'monday' ? 'active' : ''} 
            onClick={() => setSelectedDay('monday')}
          >
            Monday
          </button>
          <button 
            className={selectedDay === 'tuesday' ? 'active' : ''} 
            onClick={() => setSelectedDay('tuesday')}
          >
            Tuesday
          </button>
          <button 
            className={selectedDay === 'wednesday' ? 'active' : ''} 
            onClick={() => setSelectedDay('wednesday')}
          >
            Wednesday
          </button>
          <button 
            className={selectedDay === 'thursday' ? 'active' : ''} 
            onClick={() => setSelectedDay('thursday')}
          >
            Thursday
          </button>
          <button 
            className={selectedDay === 'friday' ? 'active' : ''} 
            onClick={() => setSelectedDay('friday')}
          >
            Friday
          </button>
          <button 
            className={selectedDay === 'saturday' ? 'active' : ''} 
            onClick={() => setSelectedDay('saturday')}
          >
            Saturday
          </button>
          <button 
            className={selectedDay === 'sunday' ? 'active' : ''} 
            onClick={() => setSelectedDay('sunday')}
          >
            Sunday
          </button>
        </div>
        
        <div className="day-focus">
          <h2>Today's Focus: {workoutPlans[selectedDay].focus}</h2>
        </div>
        
        <div className="exercise-list">
          {workoutPlans[selectedDay].exercises.map((exercise) => (
            <div 
              key={exercise.id} 
              className={`exercise-card ${isExerciseCompleted(exercise.id) ? 'completed' : ''}`}
              onClick={() => handleExerciseClick(exercise)}
            >
              <h3>{exercise.name}</h3>
              <div className="exercise-details">
                <p><strong>Sets:</strong> {exercise.sets}</p>
                <p><strong>Reps:</strong> {exercise.reps}</p>
              </div>
              {isExerciseCompleted(exercise.id) && (
                <div className="completed-badge">✓ Completed</div>
              )}
            </div>
          ))}
        </div>
        
        {selectedExercise && (
          <div className="exercise-modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeExerciseDetails}>&times;</span>
              <h2>{selectedExercise.name}</h2>
              
              {showAnimation && (
                <div className="exercise-animation">
                  <img src={selectedExercise.animation} alt={`${selectedExercise.name} demonstration`} />
                </div>
              )}
              
              <div className="exercise-instructions">
                <h3>How to perform:</h3>
                <p>{selectedExercise.description}</p>
                
                <div className="exercise-stats">
                  <p><strong>Sets:</strong> {selectedExercise.sets}</p>
                  <p><strong>Reps:</strong> {selectedExercise.reps}</p>
                </div>
                
                <h3>Variations:</h3>
                <ul className="variations-list">
                  {selectedExercise.variations.map((variation, index) => (
                    <li key={index}>{variation}</li>
                  ))}
                </ul>
                
                {!isExerciseCompleted(selectedExercise.id) && (
                  <button 
                    className="complete-button"
                    onClick={() => markAsCompleted(selectedExercise.id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workout;