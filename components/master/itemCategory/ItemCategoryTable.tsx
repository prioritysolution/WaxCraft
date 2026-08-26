"use client";

import {
  ItemCategoryTableData,
  ItemCategoryTableProps,
} from "@/types/master/ItemCategoryTypes";
import { Pagination, Spinner } from "@heroui/react";
import { Layers } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  TableDeleteButton,
  TableEditButton,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
}

const ItemCategoryTable: FC<ItemCategoryTableProps> = ({
  loading,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemCategory,
  deleteItemCategoryLoading,
  deleteWarning,
}) => {
  const [search, setSearch] = useState("");

  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData,
  );

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return itemCategoryData || [];

    return (itemCategoryData || []).filter((item) =>
      String(item.Cat_Name || "")
        .toLowerCase()
        .includes(keyword),
    );
  }, [itemCategoryData, search]);

  return (
    <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-black/[0.06] px-4 py-4 sm:px-5">
        <TableSearchInput
          title="All categories"
          description="Search, review, and update existing categories."
          value={search}
          onValueChange={setSearch}
          placeholder="Search category name"
        />
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full min-w-[520px] border-collapse text-center">
          <thead>
            <tr className="bg-[#F7F5F3]">
              <th className="w-[110px] px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Serial No.
              </th>
              <th className="px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Category Name
              </th>
              <th className="w-[120px] px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-5 py-14 text-center">
                  <Spinner size="lg" color="primary" />
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-14">
                  <TableEmptyState
                    icon={Layers}
                    entity="categories"
                    search={search}
                    emptyHint="Add a category to get started."
                  />
                </td>
              </tr>
            ) : (
              filteredCategories.map((category, index) => {
                const initial = String(category.Cat_Name || "?")
                  .trim()
                  .charAt(0)
                  .toUpperCase();

                return (
                  <tr
                    key={category.Id}
                    className="border-b border-black/[0.05] last:border-b-0 transition-colors hover:bg-[#F7F5F3]/80"
                  >
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center justify-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold uppercase text-primary">
                          {initial}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {category.Cat_Name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <TableEditButton
                          label="Edit category"
                          onPress={() => handleEditData(category)}
                        />
                        <TableDeleteButton
                          label="Delete category"
                          onPress={() => handleShowDeleteDialog(category.Id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredCategories.length > 0 && lastPage > 1 && (
        <div className="flex items-center justify-end border-t border-black/[0.06] px-4 py-3">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={lastPage}
            onChange={(page) => setCurrentPage(page)}
            classNames={{
              cursor:
                "bg-primary text-primary-foreground font-medium shadow-none",
            }}
          />
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this category?"
        warning={deleteWarning}
        isBusy={deleteItemCategoryLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteItemCategory}
      />
    </section>
  );
};

export default ItemCategoryTable;
