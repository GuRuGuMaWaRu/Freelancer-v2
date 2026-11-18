import { Button, Modal, useModal } from "shared/ui";
import type { IClient } from "shared/types";
import { AddEditProjectForm } from "entities/projects";

interface IProps {
  clients: IClient[];
  customStyles?: React.CSSProperties;
}

function AddProjectModalContent({ clients }: { clients: IClient[] }) {
  const { setIsOpen } = useModal();

  return (
    <AddEditProjectForm clients={clients} onCancel={() => setIsOpen(false)} />
  );
}

export function ModalAddProject({ clients, customStyles = {} }: IProps) {
  return (
    <Modal
      title="Add Project"
      trigger={<Button customStyles={customStyles}>Add Project</Button>}
    >
      <AddProjectModalContent clients={clients} />
    </Modal>
  );
}
