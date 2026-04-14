import { motion } from "framer-motion";
import { ParentLayout } from "@/components/parent/ParentLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Bell, Globe, Shield, LogOut } from "lucide-react";

const ParentSettings = () => {
  return (
    <ParentLayout>
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
                <Input defaultValue="Fatma Ben Ali" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body">Email</Label>
                <Input defaultValue="fatma.benali@mail.tn" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-body">Linked Child</Label>
              <Input defaultValue="Ahmed Ben Ali — 3ème Sciences A" disabled className="h-11 rounded-xl font-body bg-muted/20 text-muted-foreground" />
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
              { label: "Session focus alerts", desc: "Get notified when your child's focus drops significantly", default: true },
              { label: "Weekly progress report", desc: "Receive a weekly email summary of study activity", default: true },
              { label: "Homework deadline reminders", desc: "Alerts before assignment due dates", default: false },
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
                <p className="text-sm font-body font-medium text-foreground">Data sharing consent</p>
                <p className="text-xs text-muted-foreground font-body">Allow Lumio to share anonymized data for research</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="p-3 rounded-xl bg-muted/20">
              <p className="text-xs text-muted-foreground font-body">
                <strong className="text-foreground">Note:</strong> If your child is 14–15 years old, they can control dashboard visibility from their own settings.
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
          className="flex gap-3"
        >
          <Button variant="outline" className="rounded-xl">
            Change Password
          </Button>
          <Button variant="destructive" className="rounded-xl">
            <LogOut size={14} className="mr-1.5" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </ParentLayout>
  );
};

export default ParentSettings;
