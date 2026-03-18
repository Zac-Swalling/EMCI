import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProfileSnapshot } from './components/ProfileSnapshot';
import { TimelineCore } from './components/TimelineCore';
import { ContextPanel } from './components/ContextPanel';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-emci-bg text-emci-primary overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="w-[18%] border-r border-slate-200/60 flex flex-col">
          <ProfileSnapshot />
        </div>
        <div className="w-[64%] flex flex-col relative overflow-hidden">
          <TimelineCore onSelectEvent={setSelectedEvent} />
        </div>
        <div className="w-[18%] border-l border-slate-200/60 flex flex-col">
          <ContextPanel selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      </div>
    </div>
  );
}
