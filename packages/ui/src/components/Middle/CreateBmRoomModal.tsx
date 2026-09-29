import { color, component } from '@gigradar/theme';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button.js';
import { Modal } from '../Modal/Modal.js';
import { ModalContent, ModalFooter, ModalHeader } from '../Modal/ModalBands.js';

const { createBmRoom } = component.middle;

export type CreateBmRoomConfirmProps = {
  /** The client the new room is with. Named in the default copy. */
  clientName?: string;
  /** The Business Manager who joins it. Named in the default copy. */
  managerName?: string;
  /**
   * Whether the room is being created. The buttons stop accepting clicks, the
   * confirming one shows its spinner and reads `creatingLabel`, and the close
   * button is dropped: there is no correct thing to do with a half-created room.
   * @default false
   */
  creating?: boolean;
  /** Starts the room. */
  onConfirm?: () => void;
  /** Dismisses without creating. Ignored while `creating`. */
  onCancel?: () => void;
  /** @default 'Create a Business Manager room?' */
  title?: ReactNode;
  /**
   * The body. Defaults to a sentence naming who will be in the room, that the
   * client is notified, and that the one-to-one stays — the three things that
   * make this a commitment rather than a setting.
   */
  children?: ReactNode;
  /** @default 'Create room' */
  confirmLabel?: ReactNode;
  /** @default 'Creating room' */
  creatingLabel?: ReactNode;
  /** @default 'Cancel' */
  cancelLabel?: ReactNode;
  /** Id for the title, so a surrounding dialog can be named by it. */
  titleId?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children' | 'title'>;

/**
 * The confirmation's three bands, without the layer.
 *
 * BF-3481. Exported apart from `CreateBmRoomModal` so the same content can sit
 * in a `ModalCard` where there is no backdrop — a gallery frame, a docked panel
 * — the way `ModalHeader` and its siblings compose without `Modal`.
 */
export const CreateBmRoomConfirm = forwardRef<HTMLDivElement, CreateBmRoomConfirmProps>(
  function CreateBmRoomConfirm(
    {
      clientName = 'the client',
      managerName = 'your Business Manager',
      creating = false,
      onConfirm,
      onCancel,
      title = 'Create a Business Manager room?',
      children,
      confirmLabel = 'Create room',
      creatingLabel = 'Creating room',
      cancelLabel = 'Cancel',
      titleId,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        {...rest}
        style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}
      >
        <ModalHeader onClose={creating ? undefined : onCancel} divided={false} id={titleId}>
          {title}
        </ModalHeader>
        <ModalContent textColor={color.main.description}>
          {children ?? (
            <span>
              Starts a new Upwork room with {clientName} and {managerName}, so you can book meetings
              and send files. {clientName} is notified. This one-to-one stays in your list.
            </span>
          )}
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" disabled={creating} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button loading={creating} onClick={onConfirm}>
            {creating ? creatingLabel : confirmLabel}
          </Button>
        </ModalFooter>
      </div>
    );
  },
);

export type CreateBmRoomModalProps = {
  /** Whether the confirmation is on screen. */
  open: boolean;
  /**
   * Closes it — Escape, the backdrop, the close button, Cancel. Not called
   * while `creating`, which makes the modal undismissable for as long as the
   * request is in flight.
   */
  onClose?: () => void;
  /** Where to mount. Defaults to `document.body`. */
  container?: HTMLElement | null;
} & Omit<CreateBmRoomConfirmProps, 'onCancel' | 'titleId'>;

/**
 * The confirmation before a one-to-one room starts a Business Manager room.
 *
 * BF-3481, proposal 1. Opened by the "Create BM room" button on `AddBmInfo`
 * under the chat header. A modal rather than an inline confirm because the
 * result is a new Upwork room the client sees, which cannot be undone.
 *
 * `creating` is a prop, not internal state: whether the room exists is known
 * by whatever owns the request, and a spinner that cleared itself would clear
 * before the room did. Close the modal and select the new room once it lands.
 */
export function CreateBmRoomModal({
  open,
  onClose,
  container,
  creating = false,
  ...rest
}: CreateBmRoomModalProps) {
  const titleId = useId();
  return (
    <Modal
      open={open}
      onClose={creating ? undefined : onClose}
      container={container}
      width={createBmRoom.width}
      labelledBy={titleId}
    >
      <CreateBmRoomConfirm {...rest} creating={creating} onCancel={onClose} titleId={titleId} />
    </Modal>
  );
}
