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
  getProjectsPageQuery,
} from "entities/projects";
import { SearchInput } from "widgets";

import { columns } from "./projects.const";
import styles from "./projects.module.css";

//** TODO: move this into a separate utilities file (projects.utils.tsx) when I'll have FEATURES */
const capitalizeItem = (item: string): string =>
  item
    .split(" ")
    .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join(" ");

function Projects() {
  const [page, setPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>("-date"); //** TODO: don't like hardcoding the value like that */
  const [sortDir, setSortDir] = React.useState<string>(""); //** TODO: also may be a good idea to bring this sort of state into address line so that the state survives page refresh */
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { data: clients = [] } = useQuery(getAllClientsQuery());
  const {
    isFetching, //** TODO: better name this and isLoading properly, otherwise hard to tell what is being fetched or loaded */
    isLoading,
    data: projects,
  } = useQuery(getProjectsPageQuery(page, sortColumn, searchQuery));

  const handleSort = (columnName: string) => {
    setSortColumn(`${sortDir}${columnName}`); //** TODO: don't really like how it is done with two states (sortColumn and sortDir). PS: haha forgot what the previous comment is about */
    setSortDir((prevDir) => (prevDir === "" ? "-" : ""));
  };

  const handleSearch = (input: string) => {
    setSearchQuery(input);
  };

  //** Calculate total number of pages */
  const pagesTotal = Math.ceil((projects?.allDocs ?? 0) / config.PAGE_LIMIT); //** TODO: isn't it awkward to have this page limit? The idea was to never scroll the page, yet... I think the idea should be to allow users to see various number of projects per page and while nav UI stays fixed the page content should be scrollable */

  return (
    <div>
      <div className={styles.container}>
        <SearchInput onSearch={handleSearch} />
        <ModalAddProject clients={clients} />
        {/** TODO: feels awkward to have Modal component next to Search Input - looks to be intentional when it is not... */}
      </div>
      {/** TODO: maybe it would make more sense to make a separate early return for isLoading state up above and there we can just reuse some components from the main return? Like we will still show SearchInput and the general container */}
      {isLoading ? (
        <FullPageSpinner />
      ) : (
        <>
          <div className={styles.tableContainer}>
            {isFetching && <div className={styles.tableLoading} />}
            {/** TODO: looks awkward, how about we have a separate reusable component for this type of loader? Then we can wrap it around some children or put beside them or whatever and let it decide depending on some isDoingSomething prop what to do */}
            {/** TODO: all in all feels like too much logic happening in one place, like I would want to see this "no projects available" as some kind of early return where it wouldn't clutter the main logic path */}
            {pagesTotal < 1 ? (
              <div className={styles.tablePlaceholder}>
                There are no projects available. Please add some.
              </div>
            ) : (
              <div className={styles.table}>
                {/** TODO: these headers better be moved into a separate component */}
                {columns.map((column) => (
                  <div
                    key={column.name}
                    className={clsx(styles.tableHeader, {
                      [styles.headerSortable]: column.sortName,
                      [styles.headerDate]: column.name === "date",
                      [styles.headerComments]: column.name === "comments",
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

                {projects?.docs?.map((project) => (
                  <ProjectListItem key={project._id} project={project}>
                    {/** TODO: check if the whole Modal + AddEditProjectForm can be extracted into a separate component */}
                    <Modal
                      title="Edit Project"
                      trigger={
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
                      trigger={
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
