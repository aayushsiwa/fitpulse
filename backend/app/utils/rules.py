def generate_recommendation(goal, energy_level):
    energy = (energy_level or "").lower()

    if energy == "low":
        intensity = "low"
        workout = "walking / yoga"
        duration = 20
    elif energy == "medium":
        intensity = "medium"
        workout = "moderate cardio"
        duration = 30
    else:
        intensity = "high"
        workout = "HIIT / strength"
        duration = 45

    # Goal adjustment — frontend sends "muscle", "weightloss", "fitness"
    if goal in ("muscle", "muscle_gain"):
        workout = "strength training"
    elif goal in ("weightloss", "weight_loss"):
        workout = "cardio"

    return {
        "workout_type": workout,
        "intensity": intensity,
        "duration_minutes": duration,
    }
