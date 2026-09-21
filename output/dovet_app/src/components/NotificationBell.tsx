import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Clock,
  BookOpen,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
} from "lucide-react";
import { STUDENT_NOTIFICATIONS } from "@/lib/learn-packs-data";
import type { StudentNotification } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<StudentNotification[]>(STUDENT_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (n: StudentNotification) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
    );
    setIsOpen(false);

    if (n.packId) {
      navigate(`/player/learn/${n.packId}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-2xl border-slate-200 hover:bg-slate-50 h-10 w-10 sm:h-11 sm:w-11"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 sm:w-96 rounded-3xl p-0 shadow-2xl border-slate-100/90 overflow-hidden bg-white/95 backdrop-blur-md"
      >
        <div className="p-4 text-white flex items-center justify-between" style={{ backgroundColor: '#3C594E' }}>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" style={{ color: '#73D99F' }} />
            <h4 className="font-black text-sm">Weekly Pack Notifications</h4>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              No notifications right now. You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "p-4 flex gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors",
                  !n.isRead && "bg-primary/[0.03]"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    n.type === "due_soon" && "bg-[#fdf3ee] text-[#BF8360]",
                    n.type === "new_pack" && "bg-[#eaf1ef] text-[#3C594E]",
                    n.type === "graded" && "bg-[#e8f9f0] text-[#3C594E]"
                  )}
                >
                  {n.type === "due_soon" && <AlertTriangle className="h-4 w-4 text-[#BF8360]" />}
                  {n.type === "new_pack" && <BookOpen className="h-4 w-4 text-[#3C594E]" />}
                  {n.type === "graded" && <Trophy className="h-4 w-4 text-[#3C594E]" />}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-black text-xs text-slate-900 truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {n.createdAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug font-medium">
                    {n.message}
                  </p>

                  {n.packId && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="inline-flex items-center text-[10px] font-black text-primary gap-1">
                        <Play className="h-3 w-3 fill-primary" /> Start Practice Now →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
