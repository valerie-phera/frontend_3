const Search = (props) => (
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
        className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
        {...props}
    >
        <circle cx={11} cy={11} r={8} />
        <path d="m21 21-4.3-4.3" />
    </svg>
)
export default Search