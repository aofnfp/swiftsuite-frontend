import React from "react";
import ProductGridItem from "./ProductGridItem";
import ProductDeleteModal from "./ProductDeleteModal";
import CatalogueGridSkeleton from "../CatalogueGridSkeleton";
import CatalogueSkeleton from "../CatalogueSkeleton";
import FixedCustomPagination from "../FixedCustomPagination";
import { stripTags } from "../../utils/utils";
import ProductListItem from "./ProductListItem";

export default function ProductContentWrapper({
  isLoading = false,
  viewMode = "list",
  userProduct = [],
  handleListing = () => {},
  activeProductId,
  handleDelete = () => {},
  showModal = false,
  setShowModal = () => {},
  selectedItem,
  setSelectedItem = () => {},
  count = 0,
  page = 1,
  setPage = () => {},
  selectProductPerPage = 10,
  handleNextPage = () => {},
  handlePreviousPage = () => {},
  handleFirstPage = () => {},
  handleLastPage = () => {},
}) {
  return (
    <div className="py-5">
      {isLoading ? (
        <>
          {viewMode === "list" &&
            Array.from({ length: 5 }).map((_, idx) => (
              <CatalogueSkeleton key={idx} />
            ))}

          {viewMode === "grid" && <CatalogueGridSkeleton />}
        </>
      ) : (
        <>
          {userProduct && userProduct.length > 0 ? (
            <>
              {viewMode === "list" ? (
                <div className="text-sm">
                  {userProduct.map((product, index) => (
                    <ProductListItem
                      key={product?.id ?? index}
                      product={product}
                      handleListing={handleListing}
                      stripTags={stripTags}
                      setSelectedItem={setSelectedItem}
                      setShowModal={setShowModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                  {userProduct.map((item, i) => (
                    <ProductGridItem
                      key={item?.id ?? i}
                      item={item}
                      activeProductId={activeProductId}
                      handleListing={handleListing}
                      setSelectedItem={setSelectedItem}
                      setShowModal={setShowModal}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-black text-xl mt-48 text-center">
              No products available.
            </p>
          )}
        </>
      )}

      {/* Delete modal */}
      {showModal && (
        <ProductDeleteModal
          selectedItem={selectedItem}
          onConfirm={() => {
            if (selectedItem) handleDelete(selectedItem);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}

      {userProduct && userProduct.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 shadow-lg py-2 flex justify-center items-center">
          <FixedCustomPagination
            pageCount={Math.ceil(count / selectProductPerPage)}
            onPageChange={(selectedPage) => setPage(selectedPage)}
            currentPage={page}
            itemsPerPage={selectProductPerPage}
            totalItems={count}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            handleFirstPage={handleFirstPage}
            handleLastPage={handleLastPage}
          />
        </div>
      )}
    </div>
  );
}
