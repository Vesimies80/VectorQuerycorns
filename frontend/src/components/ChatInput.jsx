export default function ChatInput({ value, onChange, onSubmit }) {
  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Type your question..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow p-3 border rounded-l-md focus:outline-none"
      />
      <button
        onClick={onSubmit}
        className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}