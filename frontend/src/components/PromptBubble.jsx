export default function PromptBubble({ prompt }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl inline-block w-fit break-words">
        {prompt}
      </div>
    </div>
  );
}