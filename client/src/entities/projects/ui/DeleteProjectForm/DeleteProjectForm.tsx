import { useFetcher } from "react-router-dom";

import { useFormNotifications, useModalForm } from "shared/lib";
import type { IProject } from "shared/types";
import { SubmitButton } from "shared/ui/FormComponents";

import styles from "./DeleteProjectForm.module.css";

interface IProps {
  project: IProject;
}

function DeleteProjectForm({ project }: IProps) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  useModalForm(fetcher.data);
  useFormNotifications(fetcher.data, isLoading);

  return (
    <div className={styles.content}>
      <fetcher.Form method="delete" action={`/projects/${project._id}/delete`}>
        Do you wish to delete project
        <br />
        <span className={styles.highlightedText}>
          {project.projectNr}
        </span> from{" "}
        <span className={styles.highlightedText}>{project.client.name}</span>?
        <div className={styles.submitRow}>
          <SubmitButton isLoading={isLoading}>Go ahead</SubmitButton>
        </div>
      </fetcher.Form>
    </div>
  );
}

export { DeleteProjectForm };
