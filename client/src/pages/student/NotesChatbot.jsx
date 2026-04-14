import React from 'react';
import { FileText } from 'lucide-react';
import ChatEngine from '../../components/ChatEngine';

export default function NotesChatbot() {
  return (
    <ChatEngine 
      pageContext="short_notes"
      title="Short Notes Maker"
      description="Summarize into bullet points, bold key terms, revision-ready."
      icon={FileText}
      color="#DB2777"
    />
  );
}
