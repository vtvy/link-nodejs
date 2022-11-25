require("dotenv").config();
const app = require("./src/app");

// start server

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
