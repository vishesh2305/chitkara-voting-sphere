import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { AuthLogin } from "@/components/AuthLogin";
import { JudgeVotingPanel } from "@/components/JudgeVotingPanel";
import { LeaderboardView } from "@/components/LeaderboardView";
import { AdminPanel } from "@/components/AdminPanel";
import { AudienceVoting } from "@/components/AudienceVoting";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "admin" | "judge" | "leader" | "audience";
    avatar?: string;
  } | null>(null);
  const [activeView, setActiveView] = useState("dashboard");

  // Mock data
  const mockParticipants = [
    { id: "1", name: "John Doe", round: 1, currentScore: 8.5, hasVoted: false },
    { id: "2", name: "Jane Smith", round: 1, currentScore: 7.2, hasVoted: true },
    { id: "3", name: "Alex Johnson", round: 1, currentScore: 9.1, hasVoted: false },
  ];

  const mockLeaderboard = [
    { 
      id: "1", 
      name: "Alex Johnson", 
      totalScore: 25.8, 
      averageScore: 8.6, 
      roundScores: [8.5, 8.8, 8.5], 
      rank: 1,
      isWinner: false
    },
    { 
      id: "2", 
      name: "John Doe", 
      totalScore: 24.1, 
      averageScore: 8.0, 
      roundScores: [8.5, 7.8, 7.8], 
      rank: 2 
    },
    { 
      id: "3", 
      name: "Jane Smith", 
      totalScore: 22.3, 
      averageScore: 7.4, 
      roundScores: [7.2, 7.5, 7.6], 
      rank: 3,
      clashDetected: true
    },
  ];

  const mockAudienceParticipants = [
    { id: "1", name: "Team Alpha", description: "Innovation in AI", voteCount: 45 },
    { id: "2", name: "Team Beta", description: "Sustainable Tech Solutions", voteCount: 32 },
    { id: "3", name: "Team Gamma", description: "Mobile App Development", voteCount: 28 },
    { id: "4", name: "Team Delta", description: "Web3 & Blockchain", voteCount: 51 },
  ];

  const handleLogin = (email: string, role: string) => {
    const name = email.split('@')[0].split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
    
    setCurrentUser({
      name,
      email,
      role: role as "admin" | "judge" | "leader" | "audience",
    });
    setIsAuthenticated(true);
  };

  const handleVote = (participantId: string, score: number) => {
    console.log(`Voting for ${participantId} with score ${score}`);
    // In real app, this would call the backend API
  };

  const handleAudienceVote = (participantId: string) => {
    console.log(`Audience vote for ${participantId}`);
    // In real app, this would call the backend API
  };

  if (!isAuthenticated) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  const getRoleDashboard = () => {
    switch (currentUser?.role) {
      case "admin":
        return <AdminPanel />;
      case "judge":
        return (
          <JudgeVotingPanel
            participants={mockParticipants}
            timeRemaining={180}
            currentRound={1}
            onVote={handleVote}
          />
        );
      case "leader":
        return (
          <JudgeVotingPanel
            participants={mockParticipants}
            timeRemaining={180}
            currentRound={1}
            onVote={handleVote}
          />
        );
      case "audience":
        return (
          <AudienceVoting
            participants={mockAudienceParticipants}
            currentRound={1}
            timeRemaining={240}
            totalVotes={156}
            userEmail={currentUser?.email || ""}
            onVote={handleAudienceVote}
            isActive={true}
          />
        );
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <Layout currentUser={currentUser}>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              {currentUser?.role === "admin" ? "Admin Panel" : "My Dashboard"}
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Live Leaderboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {getRoleDashboard()}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <LeaderboardView
              participants={mockLeaderboard}
              currentRound={1}
              totalRounds={3}
              isLive={true}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Analytics Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive analytics and insights coming soon...
              </p>
              <Button variant="premium">View Full Analytics</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
