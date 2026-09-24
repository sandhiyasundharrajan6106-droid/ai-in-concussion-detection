import numpy as np

try:
    from sklearn.ensemble import RandomForestClassifier
except (ImportError, OSError):
    RandomForestClassifier = None


class PrototypeScreeningModel:
    """A prototype model for educational screening only. It is not clinically validated."""

    def __init__(self):
        self.model = None
        self.training_data = np.array(
            [
                [85, 88, 210, 82, 95, 92, 12, 30],
                [80, 84, 230, 78, 90, 88, 18, 35],
                [78, 80, 245, 75, 88, 84, 24, 38],
                [72, 76, 260, 68, 80, 78, 30, 48],
                [68, 74, 285, 65, 76, 74, 32, 52],
                [60, 68, 310, 58, 70, 68, 40, 60],
                [52, 60, 350, 50, 65, 62, 50, 72],
                [44, 52, 390, 46, 58, 56, 58, 84],
                [86, 86, 215, 83, 92, 94, 10, 20],
                [78, 82, 230, 77, 88, 90, 18, 30],
                [70, 74, 270, 68, 80, 76, 28, 40],
                [58, 62, 330, 56, 72, 68, 38, 52],
            ],
            dtype=float,
        )
        self.labels = np.array(
            [
                "LOWER INDICATION",
                "LOWER INDICATION",
                "LOWER INDICATION",
                "FURTHER EVALUATION RECOMMENDED",
                "FURTHER EVALUATION RECOMMENDED",
                "FURTHER EVALUATION RECOMMENDED",
                "HIGHER INDICATION",
                "HIGHER INDICATION",
                "LOWER INDICATION",
                "LOWER INDICATION",
                "FURTHER EVALUATION RECOMMENDED",
                "HIGHER INDICATION",
            ],
            dtype=object,
        )
        if RandomForestClassifier is not None:
            self.model = RandomForestClassifier(
                n_estimators=200,
                random_state=42,
                class_weight="balanced",
            )
            self.model.fit(self.training_data, self.labels)

    def _compute_score(self, feature_vector):
        eye_tracking_score = float(feature_vector.get("eye_tracking_score", 50.0))
        eye_consistency = float(feature_vector.get("eye_consistency", 50.0))
        reaction_time = float(feature_vector.get("reaction_time", 300.0))
        reaction_consistency = float(feature_vector.get("reaction_consistency", 50.0))
        memory_score = float(feature_vector.get("memory_score", 50.0))
        attention_score = float(feature_vector.get("attention_score", 50.0))
        symptom_score = float(feature_vector.get("symptom_score", 20.0))
        delay = float(feature_vector.get("eye_response_delay", 200.0))

        weighted = (
            eye_tracking_score * 0.18
            + eye_consistency * 0.18
            + reaction_consistency * 0.16
            + memory_score * 0.18
            + attention_score * 0.18
            + max(0.0, 100.0 - symptom_score) * 0.08
            + max(0.0, 100.0 - min(delay, 500.0)) * 0.04
        )
        score = round(max(0.0, min(100.0, weighted)), 2)
        return score

    def predict(self, feature_vector):
        key_order = [
            "eye_tracking_score",
            "eye_consistency",
            "eye_response_delay",
            "reaction_time",
            "reaction_consistency",
            "memory_score",
            "attention_score",
            "symptom_score",
        ]

        vector = []
        for key in key_order:
            vector.append(float(feature_vector.get(key, 0.0)))

        array = np.array([vector], dtype=float)
        screening_score = self._compute_score(feature_vector)
        if self.model is not None:
            predicted_label = self.model.predict(array)[0]
            model_family = "RandomForestClassifier"
        elif screening_score >= 78:
            predicted_label = "LOWER INDICATION"
            model_family = "Prototype fallback scorer"
        elif screening_score >= 58:
            predicted_label = "FURTHER EVALUATION RECOMMENDED"
            model_family = "Prototype fallback scorer"
        else:
            predicted_label = "HIGHER INDICATION"
            model_family = "Prototype fallback scorer"

        return {
            "screening_score": screening_score,
            "screening_indication": str(predicted_label),
            "model_family": model_family,
            "prototype_data_notice": "This model uses prototype demo data or fallback scoring only and is not clinically validated.",
        }
