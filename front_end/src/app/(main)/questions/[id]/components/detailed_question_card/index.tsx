import React, { FC } from "react";

import { QuestionType, QuestionWithForecasts } from "@/types/question";
import { getIsForecastEmpty } from "@/utils/forecasts";

import DetailedQuestionCardEmptyState from "./empty_state";
import DetailsQuestionCardErrorBoundary from "./error_boundary";
import MultipleChoiceChartCard from "./multiple_choice_chart_card";
import NumericChartCard from "./numeric_chart_card";

type Props = {
  question: QuestionWithForecasts;
};

const DetailedQuestionCard: FC<Props> = ({ question }) => {
  const isForecastEmpty =
    question.aggregations.recency_weighted.history.length === 0;

  if (isForecastEmpty) {
    return <DetailedQuestionCardEmptyState />;
  }

  switch (question.type) {
    case QuestionType.Numeric:
    case QuestionType.Date:
    case QuestionType.Binary:
      return (
        <DetailsQuestionCardErrorBoundary>
          <NumericChartCard question={question} />
        </DetailsQuestionCardErrorBoundary>
      );
    case QuestionType.MultipleChoice:
      return (
        <DetailsQuestionCardErrorBoundary>
          <MultipleChoiceChartCard question={question} />
        </DetailsQuestionCardErrorBoundary>
      );
    default:
      return null;
  }
};

export default DetailedQuestionCard;
