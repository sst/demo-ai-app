"use client";

import { ReactNode } from "react";
import styles from "./pulse.module.css";
import Modal, { useModal } from "./modal";

interface PulseProps {
  title?: string;
  className?: string;
  children: ReactNode;
}
export default function Pulse(props: PulseProps) {
  const { ref, onOpen } = useModal();
  return (
    <>
      <div onClick={onOpen} className={`${styles.pulse} ${props.className}`}>
        <div className={styles.circle}></div>
      </div>
      <Modal title={props.title} ref={ref}>
        {props.children}
      </Modal>
    </>
  );
}
