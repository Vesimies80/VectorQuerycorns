// src/components/ChartVisualization.js
"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ChartVisualization({ chart }) {
  const ref = useRef();

  // If `chart` is null/undefined, render nothing
  if (!chart) {
    return <div />;
  }

  useEffect(() => {
    const container = d3.select(ref.current);
    container.selectAll("*").remove(); // Clear previous drawings

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    // Create SVG
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height + 100); // initial extra space, may adjust

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Helper to draw legend items without overlap
    function drawLegend(labels) {
      const legendGroup = svg.append("g");
      let xPos = margin.left;
      let yPos = height + margin.bottom;
      const padding = 8; // space between items
      let legendRows = 0;

      const items = [];
      labels.forEach((label, i) => {
        // Draw a temporary text to measure width
        const tempText = legendGroup
          .append("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("font-size", "12px")
          .text(label);
        const textWidth = tempText.node().getBBox().width;
        tempText.remove();

        const swatchWidth = 12;
        const totalWidth = swatchWidth + 4 + textWidth;

        // If exceeds available width, wrap to next row
        if (xPos + totalWidth > width - margin.right) {
          xPos = margin.left;
          yPos += 20; // row height
        }

        // Track number of rows needed
        if (legendRows < (yPos - (height + margin.bottom)) / 20 + 1) {
          legendRows = (yPos - (height + margin.bottom)) / 20 + 1;
        }

        items.push({ label, x: xPos, y: yPos, textWidth });

        // Advance xPos for next label
        xPos += totalWidth + padding;
      });

      return { items, height: legendRows * 20 };
    }

    // ── BAR CHART ──
    if (chart.chart_type === "bar") {
      const data = Object.entries(chart.shards).map(([label, value]) => ({ label, value }));

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

      svg
        .append("g")
        .attr("transform", `translate(0, ${margin.top + innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)  
        .call(d3.axisLeft(y));

      // Single legend entry for bar color
      const legendGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${height + margin.bottom})`);

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
      const data = Object.entries(chart.shards).map(([label, value]) => ({ label, value }));
      const radius = Math.min(width, height) / 2 - 20;

      const pieGenerator = d3.pie().value((d) => d.value);
      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

      const pieGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2 - 20})`);

      pieGroup
        .selectAll("path")
        .data(pieGenerator(data))
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // Draw legend items with measured positions
      const labels = data.map((d) => d.label);
      const { items, height: legendHeight } = drawLegend(labels);
      const legendGroup = svg.append("g");

      items.forEach((item) => {
        const { label, x, y } = item;
        // Draw swatch
        legendGroup
          .append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", color(label));

        // Draw text
        legendGroup
          .append("text")
          .attr("x", x + 18)
          .attr("y", y + 10)
          .attr("font-size", "12px")
          .attr("fill", "#000")
          .text(label);
      });

      // Adjust SVG height if multiple legend rows
      if (legendHeight > 20) {
        svg.attr("height", height + margin.bottom + legendHeight + 10);
      }

      return;
    }

    // ── LINE CHART ──
    if (chart.chart_type === "line") {
      const seriesNames = Object.keys(chart.series || {});
      const allData = seriesNames.flatMap((name) =>
        (chart.series[name] || []).map((value, i) => ({
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

      svg
        .append("g")
        .attr("transform", `translate(0, ${margin.top + innerHeight})`)
        .call(d3.axisBottom(x).ticks(seriesNames.length));

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)  
        .call(d3.axisLeft(y));

      // Draw legend items with measured positions
      const { items, height: legendHeight } = drawLegend(seriesNames);
      const legendGroup = svg.append("g");

      items.forEach((item) => {
        const { label, x, y } = item;
        // Draw line swatch
        legendGroup
          .append("line")
          .attr("x1", x)
          .attr("y1", y + 6)
          .attr("x2", x + 18)
          .attr("y2", y + 6)
          .attr("stroke", color(label))
          .attr("stroke-width", 2);

        // Draw text
        legendGroup
          .append("text")
          .attr("x", x + 22)
          .attr("y", y + 10)
          .attr("font-size", "12px")
          .attr("fill", "#000")
          .text(label);
      });

      if (legendHeight > 20) {
        svg.attr("height", height + margin.bottom + legendHeight + 10);
      }

      return;
    }

    // If unknown chart type, do nothing
  }, [chart]);

  return <div ref={ref}></div>;
}
