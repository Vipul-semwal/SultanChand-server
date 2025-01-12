import React from "react"
import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui"

type props = {
    Child?: React.ReactNode,
    saveButtonName:string ,
    saveButtonOnClick: () => void,
    open: boolean,
    setOpen: (value: boolean) => void
}

export default function FocusModalWrapper({ Child, saveButtonName, saveButtonOnClick, open, setOpen}:props) {
  return (
    <FocusModal
        open={open}
        onOpenChange={setOpen}
    >
      <FocusModal.Trigger asChild>
        {/* <Button>{triggerName}</Button> */}
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button onClick={() => saveButtonOnClick()}>{saveButtonName}</Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16 h-full overflow-auto">
            {Child?Child:<Text>Child is not defined</Text>}
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}