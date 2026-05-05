import React from 'react';
import { FileText } from 'lucide-react';
import ChatEngine from '../../components/ChatEngine';
import { trackActivity } from '../../utils/trackActivity';
import { auth } from '../../lib/firebase';

export default function NotesChatbot() {
  const handleBotResponse = (userMsg) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      trackActivity(uid, `Generated Revision Notes: ${userMsg.content.substring(0, 30)}...`, 'notes');
    }
  };

  return (
    <ChatEngine 
      pageContext="short_notes"
      title="Short Notes Maker"
      description="Summarize into bullet points, bold key terms, revision-ready."
      icon={FileText}
      color="#DB2777"
      onBotResponse={handleBotResponse}
    />
  );
}
