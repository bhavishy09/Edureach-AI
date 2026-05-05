import React from 'react';
import { HelpCircle } from 'lucide-react';
import ChatEngine from '../../components/ChatEngine';
import { trackActivity } from '../../utils/trackActivity';
import { auth } from '../../lib/firebase';

export default function DoubtSolver() {
  const handleBotResponse = (userMsg) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      trackActivity(uid, `Solved Doubt: ${userMsg.content.substring(0, 30)}...`, 'doubt');
    }
  };

  return (
    <ChatEngine 
      pageContext="doubt_solver"
      title="Doubt Solver"
      description="Instant step-by-step AI solutions for your math and science doubts."
      icon={HelpCircle}
      color="var(--accent-red)"
      onBotResponse={handleBotResponse}
    />
  );
}
