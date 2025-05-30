from pydantic import BaseModel


class PieChart(BaseModel):
    chart_type = "pie"
    shards: dict[str, float]


class LineChart(BaseModel):
    chart_type = "line"
    series: dict[str, list[float]]


class Response(BaseModel):
    """Example:

    ```
    {
      "title": "foo",
      "text": "bar",
      "chart": {
        "chart_type": "bar",
        "shards": {
          "too much": 50.0,
          "not enough": 50.0
        }
      }
    }
    ```

    """

    title: str
    text: str
    chart: PieChart | LineChart
