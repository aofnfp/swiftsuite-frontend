import React from 'react'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const MapModal = ({ setFailedMapModalOpen, failedMapItems, setFailedMapItems, failedMapModalOpen }) => {
    return (
        <Modal isOpen={failedMapModalOpen} onOpenChange={(open) => { if (open) setFailedMapModalOpen(true); }}>
            <ModalContent className="w-[30vw] max-w-2xl">
                <ModalHeader className="flex flex-col gap-1">Mapping Errors</ModalHeader>
                <ModalBody>
                    <p className="text-sm text-gray-700 mb-2">Some products failed to map. See details below:</p>
                    <div className="space-y-2 max-h-60 overflow-auto">
                        {failedMapItems.map((fi, idx) => (
                            <div key={idx} className="p-2 border rounded bg-gray-50">
                                <p className="text-sm"><strong>SKU:</strong> {fi.sku}</p>
                                <p className="text-sm"><strong>Error:</strong> {fi.error || JSON.stringify(fi)}</p>
                            </div>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button auto flat color="default" onClick={() => { setFailedMapModalOpen(false); setFailedMapItems([]); }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MapModal