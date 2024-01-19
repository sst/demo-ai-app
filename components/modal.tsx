"use client";

import styles from "./modal.module.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  useRef,
  forwardRef,
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from "react";

type ModalProps = ComponentPropsWithRef<"dialog"> & {
  title?: string;
  children: ReactNode;
};

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ children, ...resProps }, ref) => {
    const dialogRef = ref as MutableRefObject<HTMLDialogElement | null>;
    return (
      <dialog className={styles.dialog} ref={ref}>
        <div className={styles.content}>
          <div className={styles.title}>
            <h6>{resProps.title}</h6>
            <button
              className={styles.close}
              onClick={() => dialogRef.current?.close()}
            >
              <XMarkIcon />
            </button>
          </div>
          <div className={styles.copy}>{children}</div>
        </div>
      </dialog>
    );
  }
);

export default Modal;

export function useModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const onOpen = () => ref.current?.showModal();

  return { ref, onOpen };
}
