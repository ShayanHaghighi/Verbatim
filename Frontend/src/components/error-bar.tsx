import "./styles/error-bar.css";

export default function ErrorBar({ error, setError }: any) {
  return (
    <>
      {error && (
        <div className="error-box mt-8">
          <div>
            <strong>Error: </strong>
            {error}{" "}
          </div>

          <span
            onClick={() => {
              setError("");
            }}
          >
            X
          </span>
        </div>
      )}
    </>
  );
}
