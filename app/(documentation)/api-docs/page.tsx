import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>API Documentation</h1>
      <SwaggerUI url="/openapi.json" tryItOutEnabled={true} />
    </div>
  );
}