import { app } from "./src/app.js";






app.listen(4000,
    () => { console.log("Server is running on port 4000") 
        console.log("Press Ctrl+C to stop the server");
    });