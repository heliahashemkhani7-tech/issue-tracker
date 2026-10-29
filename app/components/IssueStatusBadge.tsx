import { Badge } from "@radix-ui/themes";
import { Status } from "../generated/prisma/enums";

interface Props {
  status: Status;
}

const statusMAp: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" }
> = {
  OPEN: {
    label: "OPEN",
    color: "red",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    color: "violet",
  },
  CLOSED: {
    label: "CLOSED",
    color: "green",
  },
};

function IssueStatusBadge({ status }: Props) {
  return (
    <Badge color={statusMAp[status].color}>{statusMAp[status].label}</Badge>
  );
}

export default IssueStatusBadge;
