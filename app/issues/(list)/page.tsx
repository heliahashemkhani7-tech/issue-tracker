import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { Link, IssueStatusBadge } from "@/app/components/index";
import NextLink from "next/link";
import IssueActions from "./IssueActions";
import { Status } from "@/app/generated/prisma/enums";
import { Issue } from "@/app/generated/prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/components/Pagination";
interface Props {
  searchParams: Promise<{
    status: Status;
    orderBy: keyof Issue;
    sortOrder?: "asc" | "desc";
    page: string;
  }>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    {
      label: "Issue",
      value: "title",
    },
    {
      label: "ُStatus",
      value: "status",
      className: "hidden md:table-cell",
    },
    {
      label: "Created",
      value: "createdAt",
      className: "hidden md:table-cell",
    },
  ];

  const params = await searchParams;

  const statuses = Object.values(Status);

  const status = statuses.includes(params.status) ? params.status : undefined;

  const where = { status };

  const orderBy = columns.map((column) => column.value).includes(params.orderBy)
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
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={{
                    query: {
                      ...params,
                      orderBy: column.value,
                      sortOrder:
                        orderBy === column.value && sortOrder === "asc"
                          ? "desc"
                          : "asc",
                    },
                  }}
                >
                  {column.value}
                </NextLink>
                {column.value === params.orderBy && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        pageSize={PageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </div>
  );
};

export default IssuesPage;
