import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, Send, CheckCircle2, User, HardHat, Building } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';

interface ClientContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSubject?: string;
}

export function ClientContactModal({ open, onOpenChange, prefillSubject }: ClientContactModalProps) {
  const { projects, currentProjectId, teamMembers } = useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const leadDesigner = teamMembers.find((m) => m.id === project?.lead_designer_id) || {
    full_name: 'Arjun Mehta',
    role: 'designer',
    phone: '+91 98490 23456',
    email: 'arjun.mehta@studioflow.design',
    specialization: 'Lead Interior Architect & Millwork Lead',
  };

  const siteManager = teamMembers.find((m) => m.id === project?.site_manager_id) || {
    full_name: 'Suresh Rao',
    role: 'site_manager',
    phone: '+91 98490 44556',
    email: 'suresh.rao@studioflow.design',
    specialization: 'Senior Site Execution Engineer (Civil & MEP)',
  };

  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState<'designer' | 'site_manager'>('designer');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessage('');
      onOpenChange(false);
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-5">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-stone-900">
            Contact Project Team
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Direct access to the dedicated design and site execution team for{' '}
            <span className="font-medium text-stone-700">{project?.title}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Team Members Direct Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lead Designer */}
            <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#2A5C45] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {leadDesigner.full_name}
                  </p>
                  <p className="text-[11px] text-stone-500">Lead Designer</p>
                </div>
              </div>
              <div className="pt-1 space-y-1.5 text-xs">
                <a
                  href={`tel:${leadDesigner.phone}`}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-[#2A5C45] font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {leadDesigner.phone}
                </a>
                <a
                  href={`mailto:${leadDesigner.email}`}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-[#2A5C45] text-[11px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {leadDesigner.email}
                </a>
              </div>
            </div>

            {/* Site Manager */}
            <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <HardHat className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {siteManager.full_name}
                  </p>
                  <p className="text-[11px] text-stone-500">Site Engineer</p>
                </div>
              </div>
              <div className="pt-1 space-y-1.5 text-xs">
                <a
                  href={`tel:${siteManager.phone}`}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-[#2A5C45] font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {siteManager.phone}
                </a>
                <a
                  href={`mailto:${siteManager.email}`}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-[#2A5C45] text-[11px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {siteManager.email}
                </a>
              </div>
            </div>
          </div>

          {/* Studio Experience Center */}
          <div className="p-3 rounded-lg border border-stone-200/80 bg-white text-xs text-stone-600 flex items-start gap-2.5">
            <Building className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-800 block">StudioFlow Design Studio</span>
              <span className="text-[11px] text-stone-500">
                Plot 84, Road 36, Jubilee Hills, Hyderabad • Mon–Sat 9:30 AM – 7:00 PM
              </span>
            </div>
          </div>

          {/* Quick Message Box */}
          <form onSubmit={handleSendMessage} className="space-y-3 pt-1 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700">Send Direct Note:</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 cursor-pointer text-stone-600 text-[11px]">
                  <input
                    type="radio"
                    name="recipient"
                    checked={recipient === 'designer'}
                    onChange={() => setRecipient('designer')}
                    className="accent-[#2A5C45]"
                  />
                  Arjun (Design)
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-stone-600 text-[11px]">
                  <input
                    type="radio"
                    name="recipient"
                    checked={recipient === 'site_manager'}
                    onChange={() => setRecipient('site_manager')}
                    className="accent-[#2A5C45]"
                  />
                  Suresh (Site)
                </label>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                prefillSubject
                  ? `Regarding ${prefillSubject}: write your note here...`
                  : `Type your question or query for ${
                      recipient === 'designer' ? 'Arjun' : 'Suresh'
                    }...`
              }
              rows={3}
              className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#2A5C45] focus:border-[#2A5C45]"
            />

            {sentSuccess ? (
              <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Note transmitted directly to {recipient === 'designer' ? 'Arjun Mehta' : 'Suresh Rao'}.
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-xs h-8"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim()}
                  className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38]"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Send Message
                </Button>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
