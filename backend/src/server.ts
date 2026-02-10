import { port } from "./config";
import app from "./app";
import loader from "./loaders/index.js";

loader(app);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }
  console.log(`Server is running on ${port}`);
});
