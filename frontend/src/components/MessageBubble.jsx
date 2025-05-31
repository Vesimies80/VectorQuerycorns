import ChartVisualization from "./ChartVisualization";

export default function MessageBubble({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <p className="mb-3">{data.text}</p>
      {data.chart && <ChartVisualization chart={data.chart} />}
    </div>
  );
}