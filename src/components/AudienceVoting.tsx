import React, { useState } from "react";
import { Heart, ThumbsUp, Star, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Participant {
  id: string;
  name: string;
  description?: string;
  voteCount: number;
  hasUserVoted?: boolean;
}

interface AudienceVotingProps {
  participants: Participant[];
  currentRound: number;
  timeRemaining: number;
  totalVotes: number;
  userEmail: string;
  onVote: (participantId: string) => void;
  isActive?: boolean;
}

export const AudienceVoting: React.FC<AudienceVotingProps> = ({
  participants,
  currentRound,
  timeRemaining,
  totalVotes,
  userEmail,
  onVote,
  isActive = true,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVote = (participantId: string) => {
    if (!hasVoted && isActive) {
      setSelectedParticipant(participantId);
      setHasVoted(true);
      onVote(participantId);
    }
  };

  const getVotePercentage = (voteCount: number) => {
    return totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
  };

  const maxVotes = Math.max(...participants.map(p => p.voteCount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-accent text-accent-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>Audience Voting - Round {currentRound}</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              {isActive ? (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-mono font-bold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              ) : (
                <Badge variant="secondary" className="bg-warning text-warning-foreground">
                  Voting Closed
                </Badge>
              )}
            </div>
          </div>
          {isActive && (
            <Progress value={((300 - timeRemaining) / 300) * 100} className="h-2 bg-accent-foreground/20" />
          )}
        </CardHeader>
      </Card>

      {/* Voting Status */}
      {hasVoted ? (
        <Card className="bg-success/10 border-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div className="text-center">
                <h2 className="text-xl font-bold text-success">Vote Submitted!</h2>
                <p className="text-success/80">Thank you for participating in Round {currentRound}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-primary/5 border-primary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Cast Your Vote</h3>
                <p className="text-sm text-muted-foreground">
                  Select your favorite participant for Round {currentRound}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.map((participant) => {
          const isSelected = selectedParticipant === participant.id;
          const votePercentage = getVotePercentage(participant.voteCount);
          const isLeading = participant.voteCount === maxVotes && maxVotes > 0;
          
          return (
            <Card
              key={participant.id}
              className={`transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-success/10 border-success shadow-lg scale-105'
                  : hasVoted
                  ? 'opacity-60'
                  : 'hover:shadow-elegant hover:scale-105'
              } ${
                isLeading && totalVotes > 0
                  ? 'ring-2 ring-primary/30'
                  : ''
              }`}
              onClick={() => !hasVoted && isActive && handleVote(participant.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{participant.name}</CardTitle>
                  {isLeading && totalVotes > 0 && (
                    <Badge variant="default" className="bg-gradient-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Leading
                    </Badge>
                  )}
                </div>
                {participant.description && (
                  <p className="text-sm text-muted-foreground">
                    {participant.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Vote Count Display */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Votes</span>
                    <span className="font-bold text-primary">
                      {participant.voteCount} ({votePercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress 
                    value={votePercentage} 
                    className="h-2"
                  />
                </div>

                {/* Vote Button */}
                <Button
                  variant={isSelected ? "success" : "vote"}
                  className="w-full"
                  disabled={hasVoted || !isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(participant.id);
                  }}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Vote Submitted
                    </>
                  ) : hasVoted ? (
                    "Voting Complete"
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Vote for {participant.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vote Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ThumbsUp className="w-5 h-5" />
            <span>Live Vote Count</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{participants.length}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {participants.find(p => p.voteCount === maxVotes)?.name?.split(' ')[0] || 'TBD'}
              </div>
              <div className="text-sm text-muted-foreground">Current Leader</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {isActive ? formatTime(timeRemaining) : '0:00'}
              </div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Voting as: <span className="font-medium">{userEmail}</span>
            </span>
            <Badge variant="outline">
              Round {currentRound} • Audience Role
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};