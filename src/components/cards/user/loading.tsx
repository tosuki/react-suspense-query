import "./css/loading.css";

export const LoadingCard = () => {
  return (
    <div className="loading-card-container">
      <div className="card-header">
        <div className="loading-field card-user-thumb" />
        <div className="identifier-data">
          <div className="loading-field card-name" />
          <div className="loading-field card-email" />
        </div>
      </div>
      <div className="card-data">
        <div className="loading-field card-phone" />
        <div className="loading-field card-website" />
      </div>
    </div>
  );
};
