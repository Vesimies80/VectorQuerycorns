// src/lib/mockApi.js
function randomShards(labels) {
  const vals = labels.map(() => Math.random());
  const total = vals.reduce((a, b) => a + b, 0);
  return labels.reduce((acc, label, i) => {
    acc[label] = Number(((vals[i] / total) * 100).toFixed(2));
    return acc;
  }, {});
}

function randomSeries(names, length) {
  return names.reduce((acc, name) => {
    acc[name] = Array.from({ length }, () => Number((Math.random() * 100).toFixed(2)));
    return acc;
  }, {});
}

// Mock Response generator
export function getMockResponse(type) {
  if (type === "pie") {
    return {
      title: "Mock Pie Chart",
      text: "This is a mock pie chart showing proportional data.",
      chart: {
        chart_type: "pie",
        shards: randomShards(["Alpha", "Beta", "Gamma", "Delta"]),
      },
    };
  } else if (type === "bar") {
    return {
      title: "Mock Bar Chart",
      text: "This is a mock bar chart with three categories.",
      chart: {
        chart_type: "bar",
        shards: randomShards(["Group A", "Group B", "Group C"]),
      },
    };
  } else if (type === "line") {
    return {
      title: "Mock Line Chart",
      text: "This is a mock line chart with two time-series.",
      chart: {
        chart_type: "line",
        series: randomSeries(["Series 1", "Series 2"], 12),
      },
    };
  }
  throw new Error(`Unknown mock type: ${type}`);
}

export async function fetchMock(type) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockResponse(type)), 50);
  });
}