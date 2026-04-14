import React from 'react';
import { HelpCircle } from 'lucide-react';
import ChatEngine from '../../components/ChatEngine';

export default function DoubtSolver() {
  return (
    <ChatEngine 
      pageContext="doubt_solver"
      title="Doubt Solver"
      description="Instant step-by-step AI solutions for your math and science doubts."
      icon={HelpCircle}
      color="var(--accent-red)"
    />
  );
}
