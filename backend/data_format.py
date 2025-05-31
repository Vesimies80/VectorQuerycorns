from typing import Literal
from pydantic import BaseModel


class PieChart(BaseModel):
    chart_type: Literal["pie"]
    series: dict[str, float]


class LineChart(BaseModel):
    chart_type: Literal["line"]
    series: dict[str, list[float]]


class BarChart(BaseModel):
    chart_type: Literal["bar"]
    series: dict[str, float]


class Response(BaseModel):
    """Example:

    ```
    {
      "index": 0,
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

    index: int
    title: str
    text: str
    chart: PieChart | LineChart | BarChart
    
class OnlyTextResponse(BaseModel):
  """
  Example:
  {
    "index":0,
    "title":"foo",
    "text": "bar
  }
  """
  index: int
  title: str
  text:str