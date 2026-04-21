export default function VerifiedBadge({ size = '1em' }) {
    return (
        <img
            src="/verified.svg"
            alt="Verified"
            title="Verified Account"
            className="verified-badge"
            style={{
                width: size,
                height: size,
                marginLeft: '4px',
                verticalAlign: '-2px', // Better alignment
                display: 'inline-block'
            }}
        />
    )
}
