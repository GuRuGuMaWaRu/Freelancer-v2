import React from "react";
import {
  Combobox as ReachCombobox,
  ComboboxInput as ReachComboboxInput,
  ComboboxPopover as ReachComboboxPopover,
  ComboboxList as ReachComboboxList,
  ComboboxOption as ReachComboboxOption
} from "@reach/combobox";

import { IComboboxProps } from "./Combobox.types";
import { useItemMatch } from "./Combobox.hooks";
import styles from "./Combobox.module.css";

const Combobox = React.forwardRef<HTMLInputElement, IComboboxProps>(
  ({ label = "choose an item", items, name, onChange, onBlur }, ref) => {
    const [term, setTerm] = React.useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setTerm(event.target.value);
      onChange(event);
    };

    const results = useItemMatch(items, term);

    return (
      <ReachCombobox aria-label={label}>
        <ReachComboboxInput
          className={styles.input}
          onChange={handleChange}
          name={name}
          onBlur={onBlur}
          ref={ref}
        />
        <ReachComboboxPopover>
          <ReachComboboxList>
            {results?.map(item => (
              <ReachComboboxOption key={item._id} value={item.name} />
            ))}
          </ReachComboboxList>
        </ReachComboboxPopover>
      </ReachCombobox>
    );
  }
);

export { Combobox };
