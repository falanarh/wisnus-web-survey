import ProtectedRoute from "@/components/other/ProtectedRoute";
import WebSurvey from "@/components/survey/WebSurvey";

const WebSurveyPage = () => {
  return (
    <ProtectedRoute>
      <WebSurvey />
    </ProtectedRoute>
  );
};

export default WebSurveyPage;
