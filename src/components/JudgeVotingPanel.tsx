import React, { useState, useEffect } from "react";
import { Clock, Lock, Trophy, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface Participant {
  id: string;
  name: string;
  round: number;
  mediaUrl?: string;
  currentScore?: number;
  hasVoted?: boolean;
}

interface JudgeVotingPanelProps {
  participants: Participant[];
  timeRemaining: number;
  currentRound: number;
  onVote: (participantId: string, score: number) => void;
  isLocked?: boolean;
}

export const JudgeVotingPanel: React.FC<JudgeVotingPanelProps> = ({
  participants,
  timeRemaining,
  currentRound,
  onVote,
  isLocked = false,
}) => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 120) return "text-success";
    if (timeRemaining > 60) return "text-warning";
    return "text-destructive";
  };

  const handleScoreChange = (participantId: string, value: number[]) => {
    setScores(prev => ({ ...prev, [participantId]: value[0] }));
  };

  const handleSubmitVote = (participantId: string) => {
    const score = scores[participantId];
    if (score !== undefined) {
      onVote(participantId, score);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  const allVoted = participants.every(p => p.hasVoted);
  const timeProgress = ((300 - timeRemaining) / 300) * 100; // Assuming 5-minute timer

  return (
    <div className="space-y-6">
      {/* Timer Header */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Round {currentRound} - Judge Voting</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </span>
              {isLocked && (
                <Badge variant="secondary" className="bg-warning text-warning-foreground">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
          </div>
          <Progress value={timeProgress} className="h-2 bg-primary-foreground/20" />
        </CardHeader>
      </Card>

      {/* Voting Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {participants.map((participant) => {
          const currentScore = scores[participant.id] || participant.currentScore || 0;
          const hasVoted = participant.hasVoted;
          
          return (
            <Card 
              key={participant.id} 
              className={`transition-all duration-300 ${
                hasVoted 
                  ? 'bg-success/5 border-success shadow-lg' 
                  : 'hover:shadow-elegant'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>{participant.name}</span>
                  </CardTitle>
                  {hasVoted && (
                    <Badge variant="outline" className="bg-success text-success-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Voted
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Media Preview */}
                {participant.mediaUrl && (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Media Preview</span>
                  </div>
                )}

                {/* Score Slider */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Score: <span className="text-primary font-bold text-lg">{currentScore}/10</span>
                  </Label>
                  <Slider
                    value={[currentScore]}
                    onValueChange={(value) => handleScoreChange(participant.id, value)}
                    max={10}
                    min={0}
                    step={0.5}
                    disabled={hasVoted || isLocked}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Vote Button */}
                <Button
                  variant={hasVoted ? "success" : "judge"}
                  className="w-full"
                  onClick={() => handleSubmitVote(participant.id)}
                  disabled={hasVoted || isLocked || currentScore === 0}
                >
                  {hasVoted ? (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Vote Submitted ({participant.currentScore}/10)
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Submit Vote
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Bar */}
      <Card className={`${allVoted ? 'bg-success/10 border-success' : 'bg-warning/10 border-warning'}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {allVoted ? (
                <>
                  <Star className="w-5 h-5 text-success" />
                  <span className="text-success font-medium">All votes submitted!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span className="text-warning font-medium">
                    {participants.filter(p => !p.hasVoted).length} votes remaining
                  </span>
                </>
              )}
            </div>
            <Progress 
              value={(participants.filter(p => p.hasVoted).length / participants.length) * 100}
              className="w-32 h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Toast */}
      {showConfirmation && (
        <div className="fixed bottom-4 right-4 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Vote submitted successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};