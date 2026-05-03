import os
import pickle

class ModelClassifier:
    def __init__(self):
        # Base dir is the app root
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # Note: using the actual file name with space based on our inspection
        self.registry = {
            "10_science": os.path.join(base_dir, "models", "science (1).pkl"),
            "12_physics": os.path.join(base_dir, "models", "physics12.pkl"),
            "12_chemistry": os.path.join(base_dir, "models", "chemistry12.pkl"),
            "12_biology": os.path.join(base_dir, "models", "biology12.pkl"),
        }

    def get_results(self, class_level: str, subject: str):
        key = f"{class_level}_{subject.lower()}"
        file_path = self.registry.get(key)

        if not file_path or not os.path.exists(file_path):
            return {
                "available": False,
                "message": "Analysis for this subject coming soon!"
            }

        try:
            with open(file_path, "rb") as f:
                data = pickle.load(f)
            return {
                "available": True,
                "data": data
            }
        except Exception as e:
            return {
                "available": False,
                "error": str(e),
                "message": "Failed to load model data."
            }

model_classifier = ModelClassifier()
