import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Bell, Globe, Shield, LogOut, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <StudentLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading font-extrabold text-2xl text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <User size={16} className="text-primary" /> Profile
          </h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-body">Name</Label>
                <Input defaultValue="Ahmed Ben Ali" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body">Email</Label>
                <Input defaultValue="ahmed.benali@student.tn" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-body">Class</Label>
                <Input defaultValue="3ème Sciences A" disabled className="h-11 rounded-xl font-body bg-muted/20 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body">Teacher</Label>
                <Input defaultValue="Ms. Trabelsi" disabled className="h-11 rounded-xl font-body bg-muted/20 text-muted-foreground" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell size={16} className="text-primary" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: "Session reminders", desc: "Get reminded to start your daily study session", default: true },
              { label: "Weekly progress report", desc: "Receive a weekly summary of your focus and XP", default: true },
              { label: "Homework deadline alerts", desc: "Get notified before assignments are due", default: true },
              { label: "Focus milestone celebrations", desc: "Celebrate when you hit focus streaks", default: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors">
                <div>
                  <p className="text-sm font-body font-medium text-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground font-body">{pref.desc}</p>
                </div>
                <Switch defaultChecked={pref.default} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors">
              <div>
                <p className="text-sm font-body font-medium text-foreground flex items-center gap-1.5">
                  <Eye size={13} /> Dashboard visibility
                </p>
                <p className="text-xs text-muted-foreground font-body">Allow your parent to view your dashboard</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors">
              <div>
                <p className="text-sm font-body font-medium text-foreground">Share focus data with teacher</p>
                <p className="text-xs text-muted-foreground font-body">Your teacher sees your live focus during sessions</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="p-3 rounded-xl bg-muted/20">
              <p className="text-xs text-muted-foreground font-body">
                <strong className="text-foreground">Note:</strong> If you are 14–15 years old, you may control dashboard visibility. Your parent can always override this setting.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe size={16} className="text-primary" /> Language
          </h2>
          <div className="flex gap-2">
            {["AR", "FR", "EN"].map((lang) => (
              <button
                key={lang}
                className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                  lang === "EN"
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 pb-8"
        >
          <Button variant="outline" className="rounded-xl">
            Change Password
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300"
            onClick={handleSignOut}
          >
            <LogOut size={14} className="mr-1.5" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </StudentLayout>
  );
};

export default StudentSettings;
