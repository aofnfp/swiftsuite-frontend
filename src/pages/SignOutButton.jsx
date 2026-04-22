import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LiaSignOutAltSolid } from 'react-icons/lia';
import { NavLink, useNavigate } from 'react-router-dom';

const SignOutButton = ({closeModal, isOpen }) => {
    const navigate = useNavigate();

  const handleSignOut = () => {
  localStorage.clear();
  sessionStorage.clear();

  useCatalogueStore.persist.clearStorage();
  useInventoryPrefsStore.persist.clearStorage();
  useProductStore.persist.clearStorage();
  useOrderStore.persist.clearStorage();
  useEditVendorStore.persist.clearStorage();
  useListingStore.persist.clearStorage();
  useMarketplaceStore.persist.clearStorage();
  useVendorStore.persist.clearStorage();

  closeModal();

  window.location.href = "/signin";
};

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[10000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col items-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <LiaSignOutAltSolid className="h-6 w-6 text-red-600" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="mt-4 text-lg font-medium leading-6 text-gray-900"
                    >
                      Confirm Sign Out
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to sign out? You'll need to log in again to access your account.
                      </p>
                    </div>

                    <div className="mt-6 flex w-full justify-center gap-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-colors duration-200"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <NavLink
                        to="/signin"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors duration-200"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </NavLink>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default SignOutButton;