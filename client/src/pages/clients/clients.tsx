import React from "react";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { SlArrowDown } from "react-icons/sl";
import { useQuery } from "@tanstack/react-query";

import {
  IClientWithProjectData,
  TClientDataItem,
  getClientsWithProjectDataQuery,
  clientDataItems,
  ClientCard
} from "entities/clients";
import { FullPageSpinner } from "shared/ui/FullPageSpinner/FullPageSpinner";
import { Dropdown } from "shared/ui/FormComponents";
import { ModalAddProject } from "entities/projects";

import styles from "./clients.module.css";

enum sortDirItem {
  desc = "desc",
  asc = "asc"
}

const sortClients = (
  clients: IClientWithProjectData[],
  sortBy: TClientDataItem,
  sortDir: sortDirItem
) => {
  return clients.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortDir === sortDirItem.desc ? 1 : -1;
    } else if (a[sortBy] > b[sortBy]) {
      return sortDir === sortDirItem.desc ? -1 : 1;
    }
    return 0;
  });
};

function Clients() {
  const [isExpandedAll, setIsExpandedAll] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<TClientDataItem>(
    "daysSinceLastProject"
  );
  const [sortDir, setSortDir] = React.useState(sortDirItem.desc);

  const { data = [], isLoading } = useQuery(getClientsWithProjectDataQuery());

  if (isLoading) {
    return <FullPageSpinner />;
  }

  const sortedClients = sortClients(data, sortBy, sortDir);

  const changeSortDirection = () => {
    setSortDir(
      sortDir === sortDirItem.desc ? sortDirItem.asc : sortDirItem.desc
    );
  };

  const toggleExpandAll = () => {
    setIsExpandedAll(prevState => !prevState);
  };

  return (
    <>
      {/** CONTROLS --> start */}
      <div className={styles.controlsPanel}>
        <h3>SORT BY</h3>
        <Dropdown
          trigger={
            <button className={styles.sortByButton}>
              <span>{clientDataItems[sortBy].displayName}</span>{" "}
              <SlArrowDown className={styles.dropdownIcon} />
            </button>
          }
          menu={Object.entries(clientDataItems).map(
            ([sortName, { displayName }]) => (
              <div
                className={styles.sortItem}
                onClick={() => setSortBy(sortName as TClientDataItem)}
              >
                {displayName}
              </div>
            )
          )}
          dropdownStyles={{
            top: "38px",
            width: "205px",
            padding: 0,
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "5px",
            background: "#529596",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            overflow: "hidden"
          }}
        />
        <button className={styles.controlsButton} onClick={changeSortDirection}>
          {sortDir === sortDirItem.desc ? (
            <HiSortDescending className={styles.sortIcon} />
          ) : (
            <HiSortAscending className={styles.sortIcon} />
          )}
        </button>
        <button className={styles.controlsButton} onClick={toggleExpandAll}>
          {isExpandedAll ? "Collapse all" : "Expand all"}
        </button>
        <ModalAddProject
          clients={data}
          customStyles={{ marginInlineStart: "auto" }}
        />
      </div>
      {/** CONTROLS --> end */}
      <div className={styles.clientList}>
        {sortedClients.map(client => (
          <ClientCard
            key={client._id}
            client={client}
            isExpandedAll={isExpandedAll}
            sortBy={sortBy}
          />
        ))}
      </div>
    </>
  );
}

export { Clients };
