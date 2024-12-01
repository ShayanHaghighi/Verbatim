import { useState } from "react";
import ConfirmationModal from "./confirm-modal";

export default function ExitButton({ onConfirm }: { onConfirm: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full absolute bottom-0">
        <button
          className="bg-accent1 hover:brightness-75 text-white pt-3 pb-2 pl-6 pr-10 rounded-tr-full"
          onClick={() => setIsModalOpen(true)}
        >
          exit
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
      />
    </>
  );
}
