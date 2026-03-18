import React from 'react';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, Info, CheckCircle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ContextPanel({ selectedEvent, onClose }: { selectedEvent: any | null, onClose: () => void }) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white/60 to-slate-50/20 p-6 gap-6 overflow-y-auto relative">
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div
            key="event-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Event Details</span>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium tracking-tight text-slate-900">{selectedEvent.title}</h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Clock className="w-3 h-3" />
                {format(parseISO(selectedEvent.date), 'MMM d, yyyy - HH:mm')}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Teacher Notes</span>
              <p className="text-sm text-slate-700 leading-relaxed border-l-2 border-slate-200 pl-3 py-1">
                {selectedEvent.notes || "No additional notes provided."}
              </p>
            </div>

            {selectedEvent.linkedInterventions && selectedEvent.linkedInterventions.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Linked Interventions</span>
                <ul className="flex flex-col gap-2">
                  {selectedEvent.linkedInterventions.map((intervention: string, idx: number) => (
                    <li key={idx} className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1.5 rounded border border-slate-200/50">
                      {intervention}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvent.recommendedActions && selectedEvent.recommendedActions.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  Recommended Actions
                </span>
                <ul className="flex flex-col gap-2">
                  {selectedEvent.recommendedActions.map((action: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                      <span className="leading-tight">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="default-context"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-8 h-full"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Context</span>
              <h3 className="text-lg font-medium tracking-tight text-slate-900">Student Overview</h3>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Disability</span>
                <span className="text-sm font-medium text-slate-700">No</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Interviewed</span>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Yes</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Year Level</span>
                <span className="text-sm font-medium text-slate-700">11</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200/60">
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
                Select an event on the timeline for details
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
