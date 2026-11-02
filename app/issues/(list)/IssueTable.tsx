import { IssueStatusBadge } from "@/app/components";
import { Issue } from "@/app/generated/prisma/client";
import { Status } from "@/app/generated/prisma/enums";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  sortOrder?: "asc" | "desc";
  page: string;
}

interface Props {
  issues: Issue[];
  searchParams: Promise<IssueQuery>;
}

const IssueTable = async ({ issues, searchParams }: Props) => {
  const params = await searchParams;
  const orderBy = columns.map((column) => column.value).includes(params.orderBy)
    ? params.orderBy
    : "createdAt";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  return (
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
  );
};
const columns: {
  label: string;
  value: keyof Issue;
  className?: string;
}[] = [
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
export const columnNames = columns.map((column) => column.value);
export default IssueTable;
