"use client";

import DropdownField from "@/common/formFields/DropdownField";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { formGridClassName, pageFormClassName } from "@/lib/uiStyles";
import {
  ChildData,
  ModuleData,
  RoleAssignFormProps,
} from "@/types/tools/RoleAssignTypes";
import { Button, Checkbox, CheckboxGroup } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

// Define types for User Data
interface UserData {
  Id: number;
  User_Name: string;
}

// Define state for RoleAssign, including user data
interface RoleAssignState {
  userListData: UserData[];
}

// Define the structure of RootState to include roleAssign state
interface RootState {
  addUser: RoleAssignState;
}

const RoleAssignForm: FC<RoleAssignFormProps> = ({
  loading,
  form,
  handleSubmit,
  roleAssignList,
  roleAssignSingleList,
  openModuleId,
  setOpenModuleId,
  selected,
  setSelected,
  getUserLoading,
}) => {
  // Use selector to access user data from Redux store
  const userListData = useSelector(
    (state: RootState) => state?.addUser?.userListData
  );

  // Define state for parent checkbox selections
  const [parentStates, setParentStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    // Dynamically calculate the states of all parent checkboxes
    const updatedStates: { [key: string]: boolean } = {};
    roleAssignList?.forEach((module: ModuleData) => {
      const childIds = module.ChildRow.map(
        (child: ChildData) => child.Menue_Id
      );
      const selectedValues =
        form.getValues(`moduleData_${module.Module_Id}`) || [];
      updatedStates[module.Module_Id] = childIds.every((id: number) =>
        selectedValues.includes(id)
      );
    });

    // Only update parentStates if there is a change
    setParentStates((prevStates) => {
      if (JSON.stringify(prevStates) !== JSON.stringify(updatedStates)) {
        return updatedStates;
      }
      return prevStates; // Prevent unnecessary re-render if the state hasn't changed
    });
  }, [form.watch(), roleAssignList]); // Ensure effect re-runs only when needed

  const handleParentChange = (module: ModuleData, checked: boolean) => {
    const childIds = module.ChildRow.map((child: ChildData) => child.Menue_Id);
    form.setValue(`moduleData_${module.Module_Id}`, checked ? childIds : []);
  };

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className={formGridClassName}>
          <DropdownField
            label="User"
            name="userId"
            control={form.control}
            options={userListData || []}
            optionLabelKey="User_Name" // Specify the key for label
            loading={getUserLoading}
          />

          <div className="w-full bg-default-100 rounded-small p-3 xs:mt-6  flex flex-col items-start gap-1">
            <h3 className=" text-default-500  pb-5">Select Role</h3>
            <CheckboxGroup value={selected} onValueChange={setSelected}>
              {roleAssignSingleList?.map((module) => (
                <Checkbox
                  key={module.Module_Id}
                  value={module.Module_Id}
                  classNames={{ base: "gap-3" }}
                >
                  {module.Module_Name}
                </Checkbox>
              ))}
            </CheckboxGroup>
            {roleAssignList?.map((module) => {
              const isParentChecked = parentStates[module.Module_Id] || false;

              return (
                <Collapsible
                  key={module.Module_Id}
                  open={openModuleId.includes(module.Module_Id)}
                  onOpenChange={() => {
                    const newOpenModuleId = openModuleId.includes(
                      module.Module_Id
                    )
                      ? openModuleId.filter((id) => id !== module.Module_Id)
                      : [...openModuleId, module.Module_Id];
                    setOpenModuleId(newOpenModuleId);
                  }}
                  className="w-full max-w-[350px] space-y-2"
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-3">
                      {/* Parent Checkbox */}
                      <Checkbox
                        isSelected={isParentChecked} // Dynamically updated from `parentStates`
                        onValueChange={(checked) => {
                          handleParentChange(module, checked);
                          setOpenModuleId((prev) =>
                            !prev.includes(module.Module_Id)
                              ? [...prev, module.Module_Id]
                              : prev
                          );
                        }}
                      />
                      <p>{module.Module_Name}</p>
                    </div>

                    {/* Plus Button for Collapse/Decollapse */}
                    <div
                      className={`w-8 h-8 rounded-full items-center flex justify-center text-primary`}
                      onClick={() => {
                        const newOpenModuleId = openModuleId.includes(
                          module.Module_Id
                        )
                          ? openModuleId.filter((id) => id !== module.Module_Id)
                          : [...openModuleId, module.Module_Id];
                        setOpenModuleId(newOpenModuleId);
                      }}
                    >
                      {openModuleId.includes(module.Module_Id) ? (
                        <FaMinusCircle />
                      ) : (
                        <FaPlusCircle />
                      )}
                    </div>
                  </div>

                  {/* Child Links */}
                  {module.ChildRow.map((child: ChildData, index: number) => (
                    <CollapsibleContent
                      key={`child-${module.Module_Id}-${index}`}
                      className=" px-8"
                    >
                      <FormField
                        control={form.control}
                        name={`moduleData_${module.Module_Id}`}
                        render={({ field }) => (
                          <FormItem className="flex items-end gap-3">
                            <Checkbox
                              isSelected={field.value?.includes(child.Menue_Id)} // Check if child is selected
                              onValueChange={(checked) => {
                                const currentValues = field.value || [];
                                const updatedValues = checked
                                  ? [...currentValues, child.Menue_Id] // Add child ID
                                  : currentValues.filter(
                                      (id: number) => id !== child.Menue_Id
                                    ); // Remove child ID

                                field.onChange(updatedValues); // Update form value
                              }}
                            />
                            <p className=" text-sm">{child.menue_Name}</p>
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  ))}
                </Collapsible>
              );
            })}
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-auto min-w-[148px]"
            isDisabled={loading}
            isLoading={loading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default RoleAssignForm;
