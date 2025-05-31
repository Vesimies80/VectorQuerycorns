from pydantic import BaseModel


class PieChart(BaseModel):
    chart_type = "pie"
    shards: dict[str, float]

class LineChart(BaseModel):
    chart_type = "line"
    series: dict[str, list[float]]
    
class BarChart(BaseModel):
    chart_type = "bar"
    shards: dict[str, float]
    
class Request(BaseModel):
    """Example:

    ```
    {
      "index": 0,
      "prompt": "bar",
    }
    ```

    """
    index: int
    prompt: str

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
