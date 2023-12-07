import "./App.css";
import { UploadFile } from "./components/UploadFile";
import { ContextProvider } from "./context/ContextProvider";

function App() {
  return (
    <ContextProvider>
      <UploadFile />
    </ContextProvider>
  );
}

export default App;
