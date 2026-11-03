import Pagination from "@/app/components/Pagination";
import { Status } from "@/app/generated/prisma/enums";
import prisma from "@/prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { Suspense } from "react";
interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const statuses = Object.values(Status);

  const status = statuses.includes(params.status) ? params.status : undefined;

  const where = { status };

  const orderBy = columnNames.includes(params.orderBy)
    ? params.orderBy
    : "createdAt";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const page = parseInt(params.page) || 1;
  const PageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy: {
      [orderBy]: sortOrder,
    },
    skip: (page - 1) * PageSize,
    take: PageSize,
  });
  const issueCount = await prisma.issue.count({ where });
  return (
    <Flex direction="column" gap="3">
      <IssueActions />

      <Suspense>
        <IssueTable searchParams={searchParams} issues={issues} />
      </Suspense>

      <Pagination
        pageSize={PageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};
export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};
export default IssuesPage;
