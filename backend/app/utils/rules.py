def calculate_bmi(weight_kg, height_cm):
    if not height_cm or not weight_kg:
        return 22.0  # Default to normal
    height_m = height_cm / 100
    return weight_kg / (height_m * height_m)


def calculate_workout_calories(workout_type, duration):
    # kCal per minute based on MET values
    rates = {
        "hiit": 12,
        "strength": 8,
        "cardio": 10,
        "yoga": 4,
    }
    rate = rates.get((workout_type or "").lower(), 6)
    return rate * (duration or 0)


def generate_recommendation(user, energy_level):
    energy = (energy_level or "medium").lower()
    goal = user.goal
    bmi = calculate_bmi(user.weight, user.height)

    # 1. Determine Step Goal based on goal and BMI
    if goal == "weightloss":
        step_goal = 12000 if bmi < 25 else 10000
    elif goal == "muscle":
        step_goal = 7000
    else:  # fitness
        step_goal = 8500

    # 2. Workout selection based on energy and goal
    intensity = "medium"
    workout = "moderate movement"
    duration = 30
    tip = "Keep moving!"

    if energy == "low":
        intensity = "low"
        workout = "gentle walking / restorative yoga"
        duration = 20
        tip = "Focus on mobility and breathing today. Your body needs recovery."
    elif energy == "medium":
        intensity = "medium"
        workout = "steady-state cardio / bodyweight flow"
        duration = 30
        tip = "Great day for some moderate movement. Keep the momentum going!"
    else:
        intensity = "high"
        workout = "HIIT circuit / heavy strength training"
        duration = 45
        tip = "Energy is peaking! Push your limits and set a new personal best."

    # Goal adjustment
    if goal in ("muscle", "muscle_gain"):
        if energy == "high":
            workout = "Hypertrophy Power Session: Chest & Back"
        elif energy == "medium":
            workout = "Hypertrophy Volume: Isolated muscle groups"
        else:
            workout = "Light resistance: Focus on form"
    elif goal in ("weightloss", "weight_loss"):
        if energy == "high":
            workout = "Metabolic Conditioning: Burpees and Sprints"
        elif energy == "medium":
            workout = "Rhythmic Cardio: Cycling or Incline Walk"
        else:
            workout = "Low-Impact LISS: Steady row or long walk"

    return {
        "workout_type": workout,
        "intensity": intensity,
        "duration_minutes": duration,
        "tip": tip,
        "step_goal": step_goal,
    }
