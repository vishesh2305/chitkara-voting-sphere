import React from "react";
import { Trophy, Medal, Award, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ParticipantRanking {
  id: string;
  name: string;
  totalScore: number;
  averageScore: number;
  roundScores: number[];
  rank: number;
  avatar?: string;
  isWinner?: boolean;
  clashDetected?: boolean;
}

interface LeaderboardViewProps {
  participants: ParticipantRanking[];
  currentRound: number;
  totalRounds: number;
  isLive?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  participants,
  currentRound,
  totalRounds,
  isLive = false,
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-success";
    if (score >= 6) return "bg-warning";
    return "bg-destructive";
  };

  const topPerformer = participants[0];
  const maxScore = Math.max(...participants.map(p => p.totalScore));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Current Round</p>
                <p className="text-2xl font-bold">{currentRound}/{totalRounds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Participants</p>
                <p className="text-2xl font-bold">{participants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-success-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Leader</p>
                <p className="text-lg font-bold">{topPerformer?.name || "TBD"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Top Score</p>
                <p className="text-2xl font-bold text-primary">
                  {topPerformer?.totalScore.toFixed(1) || "0.0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winner Highlight */}
      {topPerformer?.isWinner && (
        <Card className="bg-gradient-success text-success-foreground shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Trophy className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-bold">🎉 Winner: {topPerformer.name}</h2>
                <p className="text-lg opacity-90">
                  Final Score: {topPerformer.totalScore.toFixed(1)} | Average: {topPerformer.averageScore.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Status */}
      {isLive && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-primary font-medium">Live Updates Active</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span>Live Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                participant.rank === 1
                  ? 'bg-gradient-primary/10 border-primary shadow-primary'
                  : participant.rank <= 3
                  ? 'bg-gradient-accent/5 border-accent/30'
                  : 'bg-background hover:bg-muted/50'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex justify-center">
                {getRankIcon(participant.rank)}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center space-x-3 flex-1">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{participant.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Avg: {participant.averageScore.toFixed(1)}
                    </span>
                    {participant.clashDetected && (
                      <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning">
                        Clash
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Progress */}
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Total Score</span>
                  <span className="font-bold text-primary">{participant.totalScore.toFixed(1)}</span>
                </div>
                <Progress 
                  value={(participant.totalScore / maxScore) * 100}
                  className="h-2"
                />
              </div>

              {/* Round Scores */}
              <div className="hidden lg:flex space-x-2">
                {participant.roundScores.map((score, roundIndex) => (
                  <div
                    key={roundIndex}
                    className={`w-12 h-8 rounded text-xs font-medium flex items-center justify-center ${
                      roundIndex + 1 === currentRound
                        ? 'bg-primary text-primary-foreground'
                        : score >= 8
                        ? 'bg-success/20 text-success'
                        : score >= 6
                        ? 'bg-warning/20 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {score ? score.toFixed(1) : '-'}
                  </div>
                ))}
              </div>

              {/* Total Score Badge */}
              <Badge
                variant={participant.rank === 1 ? "default" : "secondary"}
                className={`text-lg px-3 py-1 ${
                  participant.rank === 1 ? 'bg-gradient-primary shadow-primary' : ''
                }`}
              >
                {participant.totalScore.toFixed(1)}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};