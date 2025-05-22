function SummaryDisplay({ summary }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 font-poppins text-center">Your Todo Summary</h2>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-100 max-w-2xl mx-auto">
        <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  )
}

export default SummaryDisplay
