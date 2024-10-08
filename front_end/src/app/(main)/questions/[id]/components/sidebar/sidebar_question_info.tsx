import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { FC } from "react";

import { PostWithForecasts } from "@/types/post";
import { formatDate } from "@/utils/date_formatters";

type Props = {
  postData: PostWithForecasts;
};

const SidebarQuestionInfo: FC<Props> = ({ postData }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="flex flex-col items-start gap-4 self-stretch @container">
      <div className="flex flex-col justify-between gap-3 self-stretch @lg:grid @lg:grid-cols-4 @lg:gap-1">
        <div className="flex justify-between gap-4 @lg:flex-col @lg:justify-start @lg:gap-1">
          <span className="text-xs font-medium uppercase text-gray-700 dark:text-gray-700-dark">
            {t("author")}:
          </span>
          <Link
            className="flex min-w-0 shrink flex-col items-end gap-1 text-sm font-medium leading-4 text-blue-700 @lg:items-start dark:text-blue-700-dark"
            href={`/accounts/profile/${postData.author_id}`}
          >
            {postData.author_username}
          </Link>
        </div>

        <div className="flex justify-between gap-4 @lg:flex-col @lg:justify-start @lg:gap-1">
          <span className="text-xs font-medium uppercase text-gray-700 dark:text-gray-700-dark">
            {t("opened")}:
          </span>
          <span className="text-sm font-medium leading-4 text-gray-900 dark:text-gray-900-dark">
            {postData.published_at &&
              formatDate(locale, new Date(postData.published_at))}
          </span>
        </div>

        <div className="flex justify-between gap-4 @lg:flex-col @lg:justify-start @lg:gap-1">
          <span className="text-xs font-medium uppercase text-gray-700 dark:text-gray-700-dark">
            {t("closes")}:
          </span>
          <span className="text-sm font-medium leading-4 text-gray-900 dark:text-gray-900-dark">
            {postData.scheduled_close_time &&
              formatDate(locale, new Date(postData.scheduled_close_time))}
          </span>
        </div>

        <div className="flex justify-between gap-4 @lg:flex-col @lg:justify-start @lg:gap-1">
          <span className="text-xs font-medium uppercase text-gray-700 dark:text-gray-700-dark">
            {postData.resolved ? t("resolves") : t("scheduledResolution")}:
          </span>
          <span className="text-sm font-medium leading-4 text-gray-900 dark:text-gray-900-dark">
            {postData.scheduled_resolve_time &&
              formatDate(locale, new Date(postData.scheduled_resolve_time))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarQuestionInfo;
