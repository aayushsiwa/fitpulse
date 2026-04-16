def generate_recommendation(goal, energy_level):
    if energy_level == "low":
        intensity = "low"
        workout = "walking / yoga"
        duration = 20
    elif energy_level == "medium":
        intensity = "medium"
        workout = "moderate cardio"
        duration = 30
    else:
        intensity = "high"
        workout = "HIIT / strength"
        duration = 45

    # Goal adjustment
    if goal == "muscle_gain":
        workout = "strength training"
    elif goal == "weight_loss":
        workout = "cardio"

    return {
        "workout_type": workout,
        "intensity": intensity,
        "duration_minutes": duration,
    }
