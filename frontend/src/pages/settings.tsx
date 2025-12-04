import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Link2, Trash2, Save, Mail, Lock, ExternalLink } from 'lucide-react';
import { SiLinkedin, SiGmail } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { GradientText } from '@/components/gradient-text';
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, setUser } = useUserStore();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
  });

  const [notifications, setNotifications] = useState({
    newJobs: true,
    applications: true,
    interviews: true,
    weeklyDigest: false,
    marketing: false,
  });

  const [integrations, setIntegrations] = useState({
    linkedin: false,
    gmail: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile has been saved successfully.',
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Account deleted',
      description: 'Your account has been permanently deleted.',
      variant: 'destructive',
    });
  };

  const handleConnect = (service: 'linkedin' | 'gmail') => {
    setIntegrations(prev => ({ ...prev, [service]: !prev[service] }));
    toast({
      title: integrations[service] ? 'Disconnected' : 'Connected',
      description: `${service === 'linkedin' ? 'LinkedIn' : 'Gmail'} has been ${integrations[service] ? 'disconnected' : 'connected'}.`,
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader title="Settings" showStats={false} />

      <div className="p-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GradientText as="h1" className="text-2xl font-bold mb-2">
            Account Settings
          </GradientText>
          <p className="text-muted-foreground">
            Manage your profile, notifications, and integrations
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2" data-testid="tab-notifications">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2" data-testid="tab-integrations">
              <Link2 className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        data-testid="input-profile-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        data-testid="input-profile-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Senior Software Engineer"
                      data-testid="input-profile-title"
                    />
                  </div>

                  <Button onClick={handleSaveProfile} data-testid="button-save-profile">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="current-password"
                        type="password"
                        className="pl-10"
                        data-testid="input-current-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        className="pl-10"
                        data-testid="input-new-password"
                      />
                    </div>
                  </div>

                  <Button variant="outline" data-testid="button-change-password">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" data-testid="button-delete-account">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Job Matches</p>
                      <p className="text-sm text-muted-foreground">Get notified when AI finds new matching jobs</p>
                    </div>
                    <Switch
                      checked={notifications.newJobs}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newJobs: checked }))}
                      data-testid="switch-new-jobs"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-muted-foreground">Status changes on your applications</p>
                    </div>
                    <Switch
                      checked={notifications.applications}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, applications: checked }))}
                      data-testid="switch-applications"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Interview Reminders</p>
                      <p className="text-sm text-muted-foreground">Upcoming interview notifications</p>
                    </div>
                    <Switch
                      checked={notifications.interviews}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, interviews: checked }))}
                      data-testid="switch-interviews"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Summary of your job search activity</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                      data-testid="switch-weekly-digest"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Tips, updates, and product announcements</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                      data-testid="switch-marketing"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="integrations">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                        <SiLinkedin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">
                          {integrations.linkedin ? 'Connected' : 'Connect to import profile and apply to jobs'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integrations.linkedin ? 'outline' : 'default'}
                      onClick={() => handleConnect('linkedin')}
                      data-testid="button-connect-linkedin"
                    >
                      {integrations.linkedin ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border">
                        <SiGmail className="w-6 h-6 text-[#EA4335]" />
                      </div>
                      <div>
                        <p className="font-medium">Gmail</p>
                        <p className="text-sm text-muted-foreground">
                          {integrations.gmail ? 'Connected' : 'Connect to track application emails'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integrations.gmail ? 'outline' : 'default'}
                      onClick={() => handleConnect('gmail')}
                      data-testid="button-connect-gmail"
                    >
                      {integrations.gmail ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
