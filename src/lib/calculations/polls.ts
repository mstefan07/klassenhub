import type { Poll, PollOption, PollStatus, PollVote } from "@/types";

type PollStatusInput = Pick<Poll, "startsAt" | "endsAt" | "status">;

export type PollResultRow = {
  optionId: string;
  label: string;
  votes: number;
  percentage: number;
};

export type PollResult = {
  totalVotes: number;
  totalSelections: number;
  rows: PollResultRow[];
};

export function calculatePollStatus(
  poll: PollStatusInput,
  now = new Date(),
): PollStatus {
  if (poll.status === "ended") {
    return "ended";
  }

  const startsAt = new Date(poll.startsAt);
  const endsAt = new Date(poll.endsAt);

  if (now.getTime() < startsAt.getTime()) {
    return "planned";
  }

  if (now.getTime() > endsAt.getTime()) {
    return "ended";
  }

  return "active";
}

export function calculateParticipationRate(
  votes: Pick<PollVote, "userId">[],
  eligibleMemberCount: number,
) {
  if (eligibleMemberCount <= 0) {
    return 0;
  }

  const uniqueVoters = new Set(votes.map((vote) => vote.userId));

  return Math.round((uniqueVoters.size / eligibleMemberCount) * 100);
}

export function calculatePollResults(
  options: Pick<PollOption, "id" | "label">[],
  votes: Pick<PollVote, "userId" | "selectedOptionIds">[],
): PollResult {
  const counts = new Map(options.map((option) => [option.id, 0]));
  const voterIds = new Set<string>();
  let totalSelections = 0;

  for (const vote of votes) {
    voterIds.add(vote.userId);

    for (const optionId of vote.selectedOptionIds) {
      if (counts.has(optionId)) {
        counts.set(optionId, (counts.get(optionId) ?? 0) + 1);
        totalSelections += 1;
      }
    }
  }

  const rows = options.map((option) => {
    const optionVotes = counts.get(option.id) ?? 0;

    return {
      optionId: option.id,
      label: option.label,
      votes: optionVotes,
      percentage:
        totalSelections === 0
          ? 0
          : Math.round((optionVotes / totalSelections) * 100),
    };
  });

  return {
    totalVotes: voterIds.size,
    totalSelections,
    rows,
  };
}
