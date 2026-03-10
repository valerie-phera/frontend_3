const SelectAll = (props) => (
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
        className="lucide lucide-square-check-big w-4 h-4"
        {...props}
    >
        <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5" />
        <path d="m9 11 3 3L22 4" />
    </svg>
)
export default SelectAll