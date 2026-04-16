from datetime import date
from app.utils.rules import generate_recommendation


def create_recommendation(user, latest_log):
    result = generate_recommendation(user.goal, latest_log.energy_level)

    return {"user_id": user.id, "date": date.today(), **result}
