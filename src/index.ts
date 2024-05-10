import "dotenv/config";

import { app } from "./config/app";
import { ErrorMiddleware } from "./middleware/error";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(ErrorMiddleware);
