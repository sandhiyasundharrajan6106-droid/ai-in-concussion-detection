def calculate_reaction_metrics(rounds):
    if not rounds:
        return {
            "average_reaction_ms": 0.0,
            "fastest_reaction_ms": 0.0,
            "slowest_reaction_ms": 0.0,
            "consistency": 0.0,
            "reaction_score": 0.0,
        }

    reaction_values = [float(value) for value in rounds]
    average = sum(reaction_values) / len(reaction_values)
    fastest = min(reaction_values)
    slowest = max(reaction_values)
    spread = slowest - fastest
    consistency = max(0.0, 100.0 - (spread / max(1.0, average) * 100.0))
    reaction_score = max(0.0, min(100.0, 100.0 - (average / 10.0)))

    return {
        "average_reaction_ms": round(average, 2),
        "fastest_reaction_ms": round(fastest, 2),
        "slowest_reaction_ms": round(slowest, 2),
        "consistency": round(consistency, 2),
        "reaction_score": round(reaction_score, 2),
    }


def calculate_memory_score(selected_items, target_items):
    selected_set = {str(item).strip() for item in selected_items}
    target_set = {str(item).strip() for item in target_items}
    correct = len(selected_set.intersection(target_set))
    incorrect = max(0, len(selected_set) - correct)
    total = max(1, len(target_set))
    score = round((correct / total) * 100.0, 2)

    return {
        "correct": correct,
        "incorrect": incorrect,
        "memory_score": score,
        "selected_items": list(selected_set),
        "target_items": list(target_set),
    }


def calculate_attention_score(selected_targets, correct_targets):
    selected_set = {str(item).strip() for item in selected_targets}
    target_set = {str(item).strip() for item in correct_targets}
    correct = len(selected_set.intersection(target_set))
    incorrect = max(0, len(selected_set) - correct)
    missed = max(0, len(target_set) - correct)
    total = max(1, len(target_set))
    score = round((correct / total) * 100.0, 2)

    return {
        "correct": correct,
        "incorrect": incorrect,
        "missed": missed,
        "attention_score": score,
        "selected_targets": list(selected_set),
        "correct_targets": list(target_set),
    }
