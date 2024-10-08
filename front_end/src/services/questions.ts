import { ForecastData } from "@/types/question";
import { post } from "@/utils/fetch";

export type ForecastPayload = {
  questionId: number;
  forecastData: ForecastData;
  sliderValues: any;
};

class QuestionsApi {
  static async createForecasts(
    forecasts: ForecastPayload[]
  ): Promise<Response> {
    return await post<Response>(
      `/questions/forecast/`,
      forecasts.map(({ questionId, forecastData, sliderValues }) => ({
        question: questionId,
        continuous_cdf: forecastData.continuousCdf,
        probability_yes: forecastData.probabilityYes,
        probability_yes_per_category: forecastData.probabilityYesPerCategory,
        slider_values: sliderValues,
      }))
    );
  }

  static async resolve(
    id: number,
    resolution: string,
    actual_resolve_time: string
  ) {
    return post<
      { post_id: number },
      { resolution: string; actual_resolve_time: string }
    >(`/questions/${id}/resolve/`, {
      resolution: resolution,
      actual_resolve_time: actual_resolve_time,
    });
  }
}

export default QuestionsApi;
