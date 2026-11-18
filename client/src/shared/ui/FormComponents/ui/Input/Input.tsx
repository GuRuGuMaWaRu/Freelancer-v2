import React from "react";

import styles from "./Input.module.css";

//** Shared input component */
//** TODO: why not just use the native input components? After all we're not adding any extra functionality to these */
const SInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <input className={styles.inputBase} ref={ref} {...props} />;
});

const SSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>((props, ref) => {
  return <select className={styles.inputBase} ref={ref} {...props} />;
});

const STextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  return <textarea className={styles.inputBase} ref={ref} {...props} />;
});

export { SInput, SSelect, STextarea };
