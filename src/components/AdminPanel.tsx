import React, { useState } from "react";
import { 
  Users, 
  Shield, 
  Download, 
  Upload, 
  Settings, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "judge" | "leader" | "audience";
  verified: boolean;
  lastLogin?: string;
  votesCount: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  type: "vote" | "login" | "clash_detected" | "audience_vote_triggered" | "admin_action";
  performedBy: string;
  details: string;
  severity: "info" | "warning" | "error";
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [roundTimer, setRoundTimer] = useState(300); // 5 minutes
  const [isVotingLocked, setIsVotingLocked] = useState(false);

  // Mock data
  const users: User[] = [
    { id: "1", name: "Dr. Sarah Johnson", email: "sarah.johnson@chitkara.edu.in", role: "judge", verified: true, lastLogin: "2024-01-15 14:30", votesCount: 12 },
    { id: "2", name: "Prof. Michael Chen", email: "michael.chen@chitkara.edu.in", role: "judge", verified: true, lastLogin: "2024-01-15 14:25", votesCount: 8 },
    { id: "3", name: "Alex Kumar", email: "alex.kumar@chitkara.edu.in", role: "leader", verified: true, lastLogin: "2024-01-15 14:20", votesCount: 5 },
    { id: "4", name: "Priya Sharma", email: "priya.sharma@chitkara.edu.in", role: "audience", verified: false, lastLogin: "2024-01-15 14:15", votesCount: 0 },
  ];

  const systemLogs: SystemLog[] = [
    { id: "1", timestamp: "2024-01-15 14:30:45", type: "vote", performedBy: "Dr. Sarah Johnson", details: "Voted for participant John Doe (Score: 8.5)", severity: "info" },
    { id: "2", timestamp: "2024-01-15 14:29:12", type: "clash_detected", performedBy: "System", details: "Clash detected between Judge and Leader scores for participant Jane Smith", severity: "warning" },
    { id: "3", timestamp: "2024-01-15 14:28:30", type: "audience_vote_triggered", performedBy: "System", details: "Audience voting triggered for Round 2", severity: "info" },
    { id: "4", timestamp: "2024-01-15 14:25:18", type: "login", performedBy: "Prof. Michael Chen", details: "Successful login", severity: "info" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "text-destructive";
      case "warning": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return <XCircle className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Complete control over VoteVerse system
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="premium">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Verified Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-success-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Total Votes</p>
                <p className="text-2xl font-bold">{users.reduce((sum, u) => sum + u.votesCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${isVotingLocked ? 'bg-destructive' : 'bg-success'} text-white`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Voting Status</p>
                <p className="text-lg font-bold">{isVotingLocked ? 'Locked' : 'Active'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="voting">Voting Control</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button variant="default" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {user.verified ? (
                            <Badge variant="outline" className="bg-success/10 text-success border-success">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {user.votesCount} votes
                      </span>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting Control */}
        <TabsContent value="voting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Round Timer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Timer Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={roundTimer}
                    onChange={(e) => setRoundTimer(Number(e.target.value))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="success" size="sm">Start Timer</Button>
                  <Button variant="outline" size="sm">Pause</Button>
                  <Button variant="destructive" size="sm">Reset</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voting Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Lock Voting</Label>
                  <Switch
                    checked={isVotingLocked}
                    onCheckedChange={setIsVotingLocked}
                  />
                </div>
                <Separator />
                <Button variant="premium" className="w-full">
                  Trigger Audience Voting
                </Button>
                <Button variant="outline" className="w-full">
                  Force Next Round
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Average Score</Label>
                  <div className="text-2xl font-bold text-primary">7.8</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Participation Rate</Label>
                  <div className="text-2xl font-bold text-success">89%</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Clashes Detected</Label>
                  <div className="text-2xl font-bold text-warning">3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>System Activity Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className={getSeverityColor(log.severity)}>
                      {getSeverityIcon(log.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{log.details}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                        <span>{log.performedBy}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};