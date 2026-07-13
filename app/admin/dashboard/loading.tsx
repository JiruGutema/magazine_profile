export default function Loading() {
  return (
    <div
      className="admin-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <p className="admin-lead" style={{ margin: 0 }}>
        Loading the console…
      </p>
    </div>
  );
}
