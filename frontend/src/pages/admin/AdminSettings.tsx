import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2, Sliders, Users, Bell, Shield, Globe, LogOut, Download
} from "lucide-react";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading font-extrabold text-2xl text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">School configuration and platform settings</p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* School Profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-primary" /> School Profile
          </h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-body">School Name</Label>
                <Input defaultValue="École Pilote Monastir" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body">Academic Year</Label>
                <Input defaultValue="2025-2026" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-body">Address</Label>
              <Input defaultValue="Rue de l'École, Monastir 5000, Tunisia" className="h-11 rounded-xl font-body bg-muted/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-body">Admin Name</Label>
                <Input defaultValue="Dr. Amira Khelifi" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body">Admin Email</Label>
                <Input defaultValue="admin@pilote-monastir.tn" className="h-11 rounded-xl font-body bg-muted/30" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Sliders size={16} className="text-primary" /> Platform Configuration
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-body">Focus Alert Threshold</Label>
                <Input type="number" defaultValue="40" className="h-11 rounded-xl font-body bg-muted/30" />
                <p className="text-[11px] text-muted-foreground font-body">Alert when student focus drops below this %</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body">Risk Profiling Frequency</Label>
                <div className="flex gap-2">
                  {["Daily", "Weekly"].map((freq) => (
                    <button
                      key={freq}
                      className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                        freq === "Daily"
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Users size={16} className="text-primary" /> User Management
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { role: "Students", count: 400, color: "primary" },
              { role: "Teachers", count: 18, color: "secondary" },
              { role: "Parents", count: 312, color: "success" },
            ].map((item) => (
              <div key={item.role} className="text-center p-4 rounded-xl bg-muted/20">
                <p className="font-heading font-extrabold text-2xl text-foreground">{item.count}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{item.role}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Invite Teacher
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Link Parent to Student
            </Button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell size={16} className="text-primary" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: "School-wide alert emails", desc: "Send emails when school-wide metrics change significantly", default: true },
              { label: "Weekly school report", desc: "Automated weekly digest sent to admin", default: true },
              { label: "Professional referral notifications", desc: "Alert when a student is flagged for professional referral", default: true },
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

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Data & Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors">
              <div>
                <p className="text-sm font-body font-medium text-foreground">Data retention period</p>
                <p className="text-xs text-muted-foreground font-body">How long to keep student session data</p>
              </div>
              <span className="text-sm font-body font-medium text-foreground">2 years</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                <Download size={14} className="mr-1.5" /> Export School Data (CSV)
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                  lang === "FR"
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3 pb-8"
        >
          <Button variant="outline" className="rounded-xl">
            Change Password
          </Button>
          <Button variant="destructive" className="rounded-xl">
            <LogOut size={14} className="mr-1.5" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
