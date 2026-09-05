import { useModalOpen } from "@/utils/ContextProvider";
import { getModalClassNames, secondaryButtonClassName } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  User,
} from "@heroui/react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useSelector } from "react-redux";
import getCookieData from "@/utils/getCookieData";

interface ChildLink {
  Icon: string | null;
  Page_Allies?: string | null;
  Menue_Name: string;
}

interface SidebarLink {
  title: string;
  path?: string | null;
  Icon?: string | null;
  childLinks: ChildLink[] | null;
}

interface SidebarState {
  sidebarData: SidebarLink[];
}

interface RootState {
  sidebar: SidebarState;
}

interface NavbarProps {
  loading: boolean;
  handleLogout: () => void;
}

export const Navbar: FC<NavbarProps> = ({ loading, handleLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { handleOpen } = useModalOpen();
  const [orgName, setOrgName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const sidebarData: SidebarLink[] = useSelector(
    (state: RootState) => state?.sidebar?.sidebarData,
  );

  useEffect(() => {
    setOrgName(getCookieData<string | null>("waxCraftClientOrgName") || "");
  }, []);

  let currentTitle: string | null = null;
  let parentTitle: string | null = null;

  for (const link of sidebarData) {
    if (link.path && pathname === link.path) {
      currentTitle = link.title;
      break;
    }

    if (link.childLinks) {
      for (const child of link.childLinks) {
        if (child.Page_Allies && pathname.includes(child.Page_Allies)) {
          parentTitle = link.title;
          currentTitle = child.Menue_Name;
          break;
        }
      }
    }

    if (currentTitle) break;
  }

  const displayName = orgName || "WaxCraft User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <nav className="relative flex h-16 w-full min-w-0 shrink-0 items-center justify-between gap-2 border-b border-black/[0.06] bg-white/90 px-3 text-foreground shadow-sm backdrop-blur md:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-foreground md:hidden"
          onClick={handleOpen}
        >
          <IoMenu className="text-xl" />
        </button>
        <div className="min-w-0">
          {parentTitle ? (
            <p className="truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {parentTitle}
            </p>
          ) : null}
          <p className="truncate text-sm font-semibold capitalize sm:text-base">
            {currentTitle || "Dashboard"}
          </p>
        </div>
      </div>
      <Dropdown
        placement="bottom-end"
        backdrop="opaque"
        onOpenChange={setIsMenuOpen}
      >
        <DropdownTrigger className="shrink-0 rounded-full border border-black/[0.06] bg-secondary/60 px-1 py-1 pr-2 transition-colors data-[hover=true]:bg-secondary sm:pr-3">
          <div className="flex cursor-pointer items-center gap-2 sm:gap-3">
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                name: initials || "WC",
                className:
                  "h-8 w-8 sm:h-9 sm:w-9 bg-primary text-white text-xs font-semibold",
                color: "primary",
              }}
              className="transition-transform"
              description="Signed in"
              name={displayName}
              classNames={{
                name: "hidden max-w-[140px] truncate text-sm font-medium sm:block",
                description: "hidden text-xs text-muted-foreground sm:block",
              }}
            />
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                isMenuOpen && "rotate-180",
              )}
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Actions"
          variant="flat"
          className="w-[240px]"
        >
          <DropdownItem
            key="profile"
            className="h-14 cursor-auto gap-2"
            isReadOnly
            showDivider
            variant="light"
          >
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="truncate font-semibold">{displayName}</p>
          </DropdownItem>
          <DropdownItem
            key="user_profile"
            startContent={<UserRound className="h-4 w-4" />}
            onPress={() => router.push("/profile")}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            className="text-danger"
            startContent={<LogOut className="h-4 w-4" />}
            onPress={() => setIsLogoutOpen(true)}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal
        isOpen={isLogoutOpen}
        onOpenChange={(open) => {
          if (!loading) setIsLogoutOpen(open);
        }}
        placement="center"
        hideCloseButton
        isDismissable={!loading}
        isKeyboardDismissDisabled={loading}
        scrollBehavior="inside"
        size="sm"
        classNames={{
          ...getModalClassNames("sm"),
          header: "p-0",
          body: "p-0",
          footer: "p-0",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-start gap-3 px-5 pb-1 pt-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Log Out
              </h2>
              <p className="mt-0.5 text-sm font-normal text-muted-foreground">
                You will need to sign in again to access this workspace.
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="px-5 py-3">
            <p className="text-sm text-foreground">
              Are you sure you want to log out?
            </p>
          </ModalBody>
          <ModalFooter className="justify-end gap-2 px-5 pb-5 pt-1">
            <Button
              type="button"
              variant="bordered"
              radius="md"
              isDisabled={loading}
              className={secondaryButtonClassName}
              onPress={() => setIsLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              radius="md"
              className="h-9 min-w-[84px] px-4 text-sm font-medium"
              isLoading={loading}
              isDisabled={loading}
              spinner={<Spinner size="sm" color="current" />}
              onPress={handleLogout}
            >
              Log Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </nav>
  );
};

export default Navbar;
