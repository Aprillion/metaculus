import Link from "next/link";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { Href } from "@/types/navigation";
import { Medal } from "@/types/scoring";

import MedalIcon from "../../components/medal_icon";
import { getMedalDisplayTitle } from "../helpers/medal_title";

type Props = {
  href: Href;
  medal: Medal;
};

const MedalCard: FC<Props> = ({ medal, href }) => {
  const t = useTranslations();

  return (
    <Link
      href={href}
      className="flex w-56 flex-col items-center justify-center gap-4 rounded border border-gray-300 bg-gray-0 p-4 no-underline dark:border-gray-300-dark dark:bg-gray-0-dark"
    >
      <MedalIcon type={medal.type} className="size-7" />
      <div className="flex flex-col items-center gap-2 self-stretch">
        <span className="text-center text-lg font-bold leading-6 text-gray-800 dark:text-gray-800-dark">
          {getMedalDisplayTitle(medal)}
        </span>
        <span className="text-base font-normal text-gray-700 dark:text-gray-700-dark">
          {t("rank")}: <span className="font-bold">#{medal.rank}</span>{" "}
          {t("outOfRank", { total: medal.totalEntries })}
        </span>
      </div>
    </Link>
  );
};

export default MedalCard;
