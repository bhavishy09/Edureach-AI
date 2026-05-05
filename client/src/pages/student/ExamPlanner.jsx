import React from 'react';
import { Calendar } from 'lucide-react';
import ChatEngine from '../../components/ChatEngine';
import { trackActivity } from '../../utils/trackActivity';
import { auth } from '../../lib/firebase';

export default function ExamPlanner() {
  const handleBotResponse = (userMsg) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      trackActivity(uid, `Planned Exam Prep: ${userMsg.content.substring(0, 30)}...`, 'planner');
    }
  };

  return (
    <ChatEngine 
      pageContext="exam_planner"
      title="Exam Planner"
      description="Generate a personalized, day-by-day exam prep roadmap."
      icon={Calendar}
      color="var(--accent-blue)"
      onBotResponse={handleBotResponse}
    />
  );
}
