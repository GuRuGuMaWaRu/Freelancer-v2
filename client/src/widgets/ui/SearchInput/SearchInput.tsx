import React from "react";
import Tooltip from "@reach/tooltip";
import { FaSearch, FaTimes } from "react-icons/fa";

import { useNotification } from "app";
import { SInput } from "shared/ui";

import styles from "./SearchInput.module.css";

interface IProps {
  onSearch: (input: string) => void;
}

const SearchInput: React.FC<IProps> = ({ onSearch }) => {
  const [searchInput, setSearchInput] = React.useState<string>("");
  const notify = useNotification();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchInput.length >= 3 || searchInput.length === 0) {
      onSearch(searchInput);
    } else {
      notify.showWarning("Enter at least 3 characters into Search field");
    }
  };

  const handleCancelSearch = () => {
    setSearchInput("");
    onSearch("");
  };

  return (
    <form className={styles.inputContainer} onSubmit={handleSearch}>
      <SInput
        placeholder="Search projects..."
        id="search"
        type="search"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
      {searchInput.length > 0 && (
        <Tooltip label="Cancel search">
          <label htmlFor="cancel">
            <button
              className={styles.cancelButton}
              type="button"
              onClick={handleCancelSearch}
            >
              <FaTimes aria-label="cancel" />
            </button>
          </label>
        </Tooltip>
      )}
      <Tooltip label="Search projects">
        <label htmlFor="search">
          <button className={styles.searchButton} type="submit">
            <FaSearch aria-label="search" />
          </button>
        </label>
      </Tooltip>
    </form>
  );
};

export { SearchInput };
