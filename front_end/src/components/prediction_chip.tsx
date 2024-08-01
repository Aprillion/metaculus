import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useLocale, useTranslations } from "next-intl";
import { FC, PropsWithChildren } from "react";

import { PostStatus, Resolution } from "@/types/post";
import { Question, QuestionType } from "@/types/question";
import { getDisplayValue } from "@/utils/charts";
import { formatDate } from "@/utils/date_formatters";

function fmt_for_chip(
  resolution: number | string | null | undefined,
  questionType: QuestionType,
  locale: string
) {
  let fmted_resolution = null;

  resolution = String(resolution);

  if (resolution === "null" || resolution === "undefined") {
    fmted_resolution = "Annulled";
  } else if (["yes", "no"].includes(resolution)) {
    fmted_resolution = resolution.charAt(0).toUpperCase() + resolution.slice(1);
  } else if (questionType === QuestionType.Date) {
    if (resolution === "ambiguous") {
      // should we have this workaround?
      fmted_resolution = resolution;
    } else if (!isNaN(Number(resolution)) && resolution.trim() !== "") {
      fmted_resolution = formatDate(locale, new Date(Number(resolution)));
    } else {
      fmted_resolution = formatDate(locale, new Date(resolution));
    }
  } else if (!isNaN(Number(resolution)) && resolution.trim() !== "") {
    fmted_resolution = parseFloat(Number(resolution).toPrecision(3));
    if (fmted_resolution > 1000) {
      fmted_resolution = (fmted_resolution / 1000).toFixed(2) + "k";
    } else if (fmted_resolution > 100) {
      fmted_resolution = fmted_resolution.toFixed(0);
    } else {
      fmted_resolution = fmted_resolution.toFixed(2);
    }
    fmted_resolution = String(fmted_resolution);
  }
  return fmted_resolution;
}

type Size = "compact" | "large";

type Props = {
  question: Question;
  status: PostStatus;
  nr_forecasters?: number;
  prediction: number | undefined;
  resolution: Resolution | null;
  size?: Size;
  className?: string;
  chipClassName?: string;
};

const PredictionChip: FC<Props> = ({
  question,
  status,
  nr_forecasters,
  prediction,
  resolution,
  className,
  chipClassName,
  size,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const fmted_resolution = fmt_for_chip(resolution, question.type, locale);
  const fmted_prediction = fmt_for_chip(prediction, question.type, locale);

  switch (status) {
    case PostStatus.PENDING:
      return (
        <span className={classNames("inline-flex flex-col", className)}></span>
      );
    case PostStatus.RESOLVED:
      return (
        <span
          className={classNames(
            "inline-flex",
            {
              "flex-col": size === "large" || !size,
              "flex-row items-center gap-1": size === "compact",
            },
            className
          )}
        >
          <Label className="text-purple-900 dark:text-purple-900-dark">
            {t("resolved")} :
          </Label>
          <Chip
            size={size}
            className={classNames(
              "bg-purple-800 dark:bg-purple-800-dark",
              chipClassName
            )}
          >
            {fmted_resolution}
          </Chip>
          {size !== "compact" && !!nr_forecasters && (
            <p>
              {nr_forecasters} {t("forecasters")}
            </p>
          )}
        </span>
      );
    case PostStatus.CLOSED:
      return (
        <span className={classNames("inline-flex flex-col", className)}>
          <Chip
            size={size}
            className={classNames(
              "bg-olive-700 dark:bg-olive-700-dark",
              chipClassName
            )}
          >
            <FontAwesomeIcon icon={faUserGroup} size="xs" />
            {t("Closed")}
          </Chip>
          {!!nr_forecasters && (
            <p>
              {nr_forecasters} {t("forecasters")}
            </p>
          )}
        </span>
      );
    case PostStatus.APPROVED:
    default:
      return (
        <span className={classNames("inline-flex flex-col", className)}>
          <Chip
            size={size}
            className={classNames(
              "bg-olive-700 dark:bg-olive-700-dark",
              chipClassName
            )}
          >
            <FontAwesomeIcon icon={faUserGroup} size="xs" />
            {prediction ? getDisplayValue(prediction, question) : ""}
          </Chip>
          {!!nr_forecasters && (
            <p>
              {nr_forecasters} {t("forecasters")}
            </p>
          )}
        </span>
      );
  }
};

type ChipProps = {
  className?: string;
  size?: Size;
};

const Chip: FC<PropsWithChildren<ChipProps>> = ({
  className,
  size,
  ...props
}) => (
  <span
    className={classNames(
      "InternalChip inline-flex w-max items-center gap-2 whitespace-nowrap rounded-full px-2 py-0.5 font-semibold text-gray-0 dark:text-gray-0-dark",
      {
        "h-5 text-xs": size === "compact",
        "h-9 text-xl": size === "large",
        "h-7 text-base": !size,
      },
      className
    )}
    {...props}
  />
);

type LabelProps = {
  size?: Size;
  className?: string;
};

const Label: FC<PropsWithChildren<LabelProps>> = ({
  size,
  className,
  ...props
}) => (
  <span
    className={classNames(
      "InternalLabel whitespace-nowrap",
      {
        "text-sm": size === "compact",
        "text-xl": size === "large",
        "text-base": !size,
      },
      className
    )}
    {...props}
  />
);

export default PredictionChip;
