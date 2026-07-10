import React from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { FaSortUp, FaSortDown, FaPen, FaRegTrashAlt } from "react-icons/fa";

import { FullPageSpinner } from "shared/ui/FullPageSpinner/FullPageSpinner";
import { Modal } from "shared/ui/Modal";
import { MemoPagination } from "shared/ui/Pagination/Pagination";
import { config } from "shared/const";
import { getAllClientsQuery } from "entities/clients";
import {
  DeleteProjectForm,
  AddEditProjectForm,
  ProjectListItem,
  ModalAddProject,
  getProjectsPageQuery
} from "entities/projects";
import { SearchInput } from "widgets";

import { columns } from "./projects.const";
import styles from "./projects.module.css";

//** TODO: move this into a separate utilities file (projects.utils.tsx) when I'll have FEATURES */
const capitalizeItem = (item: string): string =>
  item
    .split(" ")
    .map(item => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join(" ");

function Projects() {
  const [page, setPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>("-date");
  const [sortDir, setSortDir] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { data: clients = [] } = useQuery(getAllClientsQuery());
  const { isFetching, isLoading, data: projects } = useQuery(
    getProjectsPageQuery(page, sortColumn, searchQuery)
  );

  const handleSort = (columnName: string) => {
    setSortColumn(`${sortDir}${columnName}`); //** TODO: don't really like how it is done with two states (sortColumn and sortDir) */
    setSortDir(prevDir => (prevDir === "" ? "-" : ""));
  };

  const handleSearch = (input: string) => {
    setSearchQuery(input);
  };

  //** Calculate total number of pages */
  const pagesTotal = Math.ceil((projects?.allDocs ?? 0) / config.PAGE_LIMIT);

  return (
    <div>
      <div className={styles.container}>
        <SearchInput onSearch={handleSearch} />
        <ModalAddProject clients={clients} />
      </div>
      {isLoading ? (
        <FullPageSpinner />
      ) : (
        <>
          <div className={styles.tableContainer}>
            {isFetching && <div className={styles.tableLoading} />}
            {pagesTotal < 1 ? (
              <div className={styles.tablePlaceholder}>
                There are no projects available. Please add some.
              </div>
            ) : (
              <div className={styles.table}>
                {columns.map(column => (
                  <div
                    key={column.name}
                    className={clsx(styles.tableHeader, {
                      [styles.headerSortable]: column.sortName,
                      [styles.headerDate]: column.name === "date",
                      [styles.headerComments]: column.name === "comments"
                    })}
                    onClick={
                      column.sortName
                        ? () => handleSort(column?.sortName)
                        : undefined
                    }
                  >
                    {capitalizeItem(column.name)}
                    {!column.sortName ? null : column.name === sortColumn &&
                      sortDir === "" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )}
                  </div>
                ))}

                {projects?.docs?.map(project => (
                  <ProjectListItem key={project._id} project={project}>
                    {/** TODO: check if the whole Modal + AddEditProjectForm can be extracted into a separate component */}
                    <Modal
                      title="Edit Project"
                      button={
                        <button className={styles.actionButton}>
                          <FaPen aria-label="edit" />
                        </button>
                      }
                    >
                      <AddEditProjectForm project={project} clients={clients} />
                    </Modal>
                    {/** TODO: check if the whole Modal + DeleteProjectForm can be extracted into a separate component */}
                    <Modal
                      title="Delete Project"
                      button={
                        <button className={styles.actionButton}>
                          <FaRegTrashAlt aria-label="delete" />
                        </button>
                      }
                    >
                      <DeleteProjectForm project={project} />
                    </Modal>
                  </ProjectListItem>
                ))}
              </div>
            )}
          </div>

          <MemoPagination
            totalPages={pagesTotal}
            currentPage={page}
            setCurrentPage={setPage}
          />
        </>
      )}
    </div>
  );
}

export { Projects };
