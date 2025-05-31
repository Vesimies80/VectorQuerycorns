"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ChartVisualization({ chart }) {
  const ref = useRef();

  useEffect(() => {
    const container = d3.select(ref.current);
    container.selectAll("*").remove();

    const width = 500;
    const height = 300;
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    if (chart.chart_type === "bar") {
      // convert shards to array
      const data = Object.entries(chart.shards).map(([label, value]) => ({ label, value }));

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, width])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height, 0]);

      svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.label))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", "steelblue");

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y));
    }

    else if (chart.chart_type === "pie") {
      // convert shards to array
      const data = Object.entries(chart.shards).map(([label, value]) => ({ label, value }));
      const radius = Math.min(width, height) / 2;
      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.label))
        .range(d3.schemeCategory10);

      const pieGenerator = d3.pie().value((d) => d.value);
      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius - 10);

      const pieGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      pieGroup
        .selectAll("path")
        .data(pieGenerator(data))
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);
    }

    else if (chart.chart_type === "line") {
      // flatten series into array of { series, x, y }
      const seriesNames = Object.keys(chart.series);
      const allData = seriesNames.flatMap((name) =>
        chart.series[name].map((value, i) => ({
          series: name,
          x: i + 1,
          y: value,
        }))
      );

      // scales
      const x = d3
        .scaleLinear()
        .domain(d3.extent(allData, (d) => d.x))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(allData, (d) => d.y)])
        .nice()
        .range([height, 0]);

      const color = d3.scaleOrdinal(d3.schemeCategory10).domain(seriesNames);

      // line generator
      const lineGen = d3
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

      // draw one path per series
      seriesNames.forEach((name) => {
        const seriesData = allData.filter((d) => d.series === name);
        svg
          .append("path")
          .datum(seriesData)
          .attr("fill", "none")
          .attr("stroke", color(name))
          .attr("stroke-width", 2)
          .attr("d", lineGen);
      });

      // axes
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(seriesNames.length));

      svg.append("g").call(d3.axisLeft(y));
    }

    // else: unknown type – do nothing

  }, [chart]);

  return <div ref={ref} />;
}