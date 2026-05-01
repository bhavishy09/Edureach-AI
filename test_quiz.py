import sys
sys.path.append("/Users/bhavishyakatariya/Desktop/minor2project")
from services.quiz_worker import worker

print("Testing worker...")
try:
    result = worker.generate_quiz("Vector Algebra", "Class 12", "Medium", ["mcq", "true_false"], 5)
    print("Result:", result)
except Exception as e:
    import traceback
    traceback.print_exc()
