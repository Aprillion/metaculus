"use client";
import { faBars, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FC, PropsWithChildren } from "react";

import ThemeToggle from "@/components/theme_toggle";
import LanguageMenu from "@/components/language_menu";
import { useAuth } from "@/contexts/auth_context";
import { useModal } from "@/contexts/modal_context";
import { Href } from "@/types/navigation";

const SectionTitle: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-full items-center justify-center px-4 pb-1 pt-2 text-sm font-medium uppercase text-gray-200 opacity-50">
    {children}
  </div>
);

export const MenuLink: FC<
  PropsWithChildren<{
    href?: Href;
    onClick?: () => void;
    regularLink?: boolean;
  }>
> = ({ href, onClick, regularLink = false, children }) => {
  return (
    <MenuItem
      as={href ? (regularLink ? "a" : Link) : "button"}
      {...(href ? { href } : {})}
      onClick={onClick}
      className="flex size-full items-center justify-center px-4 py-1.5 capitalize no-underline hover:bg-blue-400-dark"
    >
      {children}
    </MenuItem>
  );
};

const MobileMenu: FC = () => {
  const { user } = useAuth();
  const { setCurrentModal } = useModal();
  const t = useTranslations();

  return (
    <Menu>
      <MenuButton className="color-white flex w-12 flex-col items-center justify-center hover:bg-blue-200-dark active:bg-blue-300-dark lg:hidden lg:items-end lg:justify-end">
        {({ open }) =>
          open ? (
            <FontAwesomeIcon icon={faMinus} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="lg" />
          )
        }
      </MenuButton>
      <Transition
        enter="duration-200 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="duration-300 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <MenuItems className="absolute inset-x-0 top-12 max-h-[calc(100dvh-48px)] list-none flex-col items-stretch justify-end space-y-0.5 overflow-y-auto bg-blue-200-dark text-base no-underline lg:hidden">
          <MenuLink href={`/leaderboard`}>{t("leaderboards")}</MenuLink>
          <MenuLink href={`/news/`}>{t("news")}</MenuLink>
          <SectionTitle>{t("more")}</SectionTitle>
          <MenuLink href={`/about/`}>{t("aboutMetaculus")}</MenuLink>
          <MenuLink href={`/press/`}>{t("forJournalists")}</MenuLink>
          <MenuLink href={`/faq/`}>{t("faq")}</MenuLink>
          <MenuLink href={`/questions/track-record/`}>
            {t("trackRecord")}
          </MenuLink>
          <MenuLink href={`/project/journal/`}>{t("theJournal")}</MenuLink>
          <MenuLink href={`/questions/create/`}>+ {t("create")}</MenuLink>
          <SectionTitle>{t("account")}</SectionTitle>
          {user ? (
            <>
              <MenuLink href={`/accounts/profile/${user.id}`}>
                {t("profile")}
              </MenuLink>
              <MenuLink href={"/accounts/settings/"}>{t("settings")}</MenuLink>
              {user.is_superuser && (
                <MenuLink href={"/admin"}>{t("admin")}</MenuLink>
              )}
              <MenuLink href="/accounts/signout" regularLink>
                {t("logout")}
              </MenuLink>
            </>
          ) : (
            <MenuLink onClick={() => setCurrentModal({ type: "signin" })}>
              {t("login")}
            </MenuLink>
          )}

          <div className="flex items-center justify-end gap-4 bg-blue-100-dark px-4 py-3">
            <LanguageMenu />
            <ThemeToggle />
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default MobileMenu;
