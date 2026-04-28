"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings, User, Palette, Timer, Bell, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { useStore } from "@/store/useStore";

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'focus', label: 'Focus & Timer', icon: Timer },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const { user } = useAuth();
  const { profile, updateProfileData } = useStore();
  
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [occupationInput, setOccupationInput] = useState(profile?.occupation || '');
  const [bioInput, setBioInput] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.displayName) setNameInput(user.displayName);
    if (profile?.occupation) setOccupationInput(profile.occupation);
    if (profile?.bio) setBioInput(profile.bio);
  }, [user?.displayName, profile?.occupation, profile?.bio]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: nameInput });
      await updateProfileData({ occupation: occupationInput, bio: bioInput });
      // Force a slight reload/re-render hack to update TopBar if needed, or it'll just sync.
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your preferences, appearance, and account settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm text-left group relative",
                    isActive 
                      ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md shadow-[0_0_10px_rgba(124,58,237,0.8)]" 
                    />
                  )}
                  <tab.icon className={cn("w-4 h-4 transition-transform duration-300", isActive ? "text-primary scale-110" : "group-hover:scale-110")} />
                  {tab.label}
                </button>
              );
            })}

            <div className="mt-8 pt-8 border-t border-white/10">
              <button 
                onClick={() => auth.signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 glass-card rounded-3xl p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'focus' && (
                <motion.div
                  key="focus"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-6">Focus Timer Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Default Focus Duration</p>
                          <p className="text-xs text-muted-foreground mt-1">Set the default length of your deep work sessions.</p>
                        </div>
                        <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white">
                          <option value="15">15 minutes</option>
                          <option value="25" selected>25 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                        </select>
                      </div>
                      
                      <div className="h-px w-full bg-white/5" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Default Break Duration</p>
                          <p className="text-xs text-muted-foreground mt-1">Set the length of your resting periods.</p>
                        </div>
                        <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white">
                          <option value="5" selected>5 minutes</option>
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes</option>
                        </select>
                      </div>

                      <div className="h-px w-full bg-white/5" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Auto-Start Breaks</p>
                          <p className="text-xs text-muted-foreground mt-1">Automatically start break timer when focus ends.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[0_0_10px_rgba(124,58,237,0.3)_inset]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Smart Adjust</p>
                          <p className="text-xs text-muted-foreground mt-1">Allow AI to adjust your timer based on fatigue.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[0_0_10px_rgba(124,58,237,0.3)_inset]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
                  
                  <div>
                    <p className="font-medium text-white mb-4">Ambient Focus Environment</p>
                    <div className="grid grid-cols-2 gap-4">
                      {['Dark Aurora', 'Midnight Cafe', 'Rainy Forest', 'Deep Space'].map((theme, i) => (
                        <div key={theme} className={cn(
                          "p-4 rounded-2xl border cursor-pointer transition-all",
                          i === 0 ? "border-primary bg-primary/10 ring-1 ring-primary/50" : "border-white/10 bg-black/20 hover:border-white/20"
                        )}>
                          <div className="w-full h-24 rounded-lg bg-gradient-to-br from-black to-zinc-900 mb-3 border border-white/5 relative overflow-hidden">
                             {i === 0 && <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />}
                             {i === 1 && <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent" />}
                             {i === 2 && <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />}
                             {i === 3 && <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent" />}
                          </div>
                          <p className="text-sm font-medium text-center">{theme}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/5" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Ambient Sound Toggle</p>
                      <p className="text-xs text-muted-foreground mt-1">Play gentle background noise during Focus Mode.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-primary p-0.5 shadow-lg">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Aura'}&backgroundColor=transparent`}
                        alt="Avatar" 
                        className="w-full h-full rounded-[14px] bg-black/50"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{user?.displayName || "Focus Member"}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <button className="mt-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Display Name</label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed directly.</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Occupation</label>
                      <input
                        type="text"
                        value={occupationInput}
                        onChange={(e) => setOccupationInput(e.target.value)}
                        placeholder="e.g. Software Engineer, Student"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Bio</label>
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="A short bio about your goals..."
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white resize-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)] disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Fallback for other tabs */}
              {['notifications', 'privacy'].includes(activeTab) && (() => {
                const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon;
                return (
                  <motion.div
                    key="other"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-muted-foreground">
                       {ActiveIcon && <ActiveIcon className="w-8 h-8" />}
                    </div>
                    <h3 className="text-xl font-bold mb-2 capitalize">{activeTab} Settings</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      These settings are currently synced with your Aura cloud account automatically.
                    </p>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
