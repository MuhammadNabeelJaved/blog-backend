import app from "./app.js";
import connectionDB from "./db/connectionDB.js";

connectionDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});