import React from 'react';
import { Calendar } from 'lucide-react';
import ChatEngine from '../../components/ChatEngine';

export default function ExamPlanner() {
  return (
    <ChatEngine 
      pageContext="exam_planner"
      title="Exam Planner"
      description="Generate a personalized, day-by-day exam prep roadmap."
      icon={Calendar}
      color="var(--accent-blue)"
    />
  );
}
