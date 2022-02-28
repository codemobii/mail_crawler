import "./App.css";
import { MantineProvider } from "@mantine/core";
import Mailer from "./Mailer";

function App() {
  return (
    <MantineProvider
      theme={{
        spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
      }}
    >
      <Mailer />
    </MantineProvider>
  );
}

export default App;
