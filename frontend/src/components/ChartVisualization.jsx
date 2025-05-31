// src/components/ChartVisualization.js
"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ChartVisualization({ chart }) {
  const ref = useRef();

  useEffect(() => {
    const container = d3.select(ref.current);
    container.selectAll("*").remove(); // Clear previous drawings

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Create SVG
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height + 60); // extra space for legend

    // Color scale (shared by pie & line legends)
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // ── BAR CHART ──
    if (chart.chart_type === "bar") {
      const data = Object.entries(chart.series).map(([label, value]) => ({
        label,
        value,
      }));

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.left, margin.left + innerWidth])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([margin.top + innerHeight, margin.top]);

      // Draw bars
      svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.label))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => margin.top + innerHeight - y(d.value))
        .attr("fill", "steelblue");

      // X‐axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${margin.top + innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

      // Y‐axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      // Legend: Since all bars are same color, show just a label
      const legendGroup = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left}, ${height + margin.bottom - 20})`
        );

      legendGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "steelblue");

      legendGroup
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("Value");

      return;
    }

    // ── PIE CHART ──
    if (chart.chart_type === "pie") {
      const data = Object.entries(chart.series).map(([label, value]) => ({
        label,
        value,
      }));
      const radius = Math.min(width, height) / 2 - 20;

      const pieGenerator = d3.pie().value((d) => d.value);
      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

      // Group for pie, centered
      const pieGroup = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width / 2}, ${height / 2 - 20})`
        );

      // Draw slices
      pieGroup
        .selectAll("path")
        .data(pieGenerator(data))
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // Legend group (below chart)
      const legendGroup = svg.append("g").attr(
        "transform",
        `translate(${margin.left}, ${height + 10})`
      );

      data.forEach((d, i) => {
        const legendRow = legendGroup
          .append("g")
          .attr("transform", `translate(${i * 120}, 0)`);

        // Colored swatch
        legendRow
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", color(d.label));

        // Label text
        legendRow
          .append("text")
          .attr("x", 18)
          .attr("y", 10)
          .attr("font-size", "12px")
          .attr("fill", "#000")
          .text(d.label);
      });

      return;
    }

    // ── LINE CHART ──
    if (chart.chart_type === "line") {
      const seriesNames = Object.keys(chart.series);
      const allData = seriesNames.flatMap((name) =>
        chart.series[name].map((value, i) => ({
          series: name,
          x: i + 1,
          y: value,
        }))
      );

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const x = d3
        .scaleLinear()
        .domain(d3.extent(allData, (d) => d.x))
        .range([margin.left, margin.left + innerWidth]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(allData, (d) => d.y)])
        .nice()
        .range([margin.top + innerHeight, margin.top]);

      // Draw lines
      const lineGen = d3
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

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

      // X‐axis
      svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${margin.top + innerHeight})`
        )
        .call(d3.axisBottom(x).ticks(seriesNames.length));

      // Y‐axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      // Legend (below chart)
      const legendGroup = svg.append("g").attr(
        "transform",
        `translate(${margin.left}, ${height + 10})`
      );

      seriesNames.forEach((name, i) => {
        const legendRow = legendGroup
          .append("g")
          .attr("transform", `translate(${i * 120}, 0)`);

        // Colored line swatch
        legendRow
          .append("line")
          .attr("x1", 0)
          .attr("y1", 6)
          .attr("x2", 18)
          .attr("y2", 6)
          .attr("stroke", color(name))
          .attr("stroke-width", 2);

        // Label text
        legendRow
          .append("text")
          .attr("x", 22)
          .attr("y", 10)
          .attr("font-size", "12px")
          .attr("fill", "#000")
          .text(name);
      });

      return;
    }

    // If unknown chart type, do nothing
  }, [chart]);

  return <div ref={ref}></div>;
}