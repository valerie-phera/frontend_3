const History = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className="lucide lucide-clock w-5 h-5 text-primary mb-2"
        {...props}
    >
        <circle cx={12} cy={12} r={10} />
        <path d="M12 6v6l4 2" />
    </svg>
)
export default History;