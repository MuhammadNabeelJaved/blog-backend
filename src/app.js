import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
// app.use("/api/users", userRoutes)
import userRoutes from "./routes/user.route.js"
import blogRoutes from "./routes/blog.route.js"
import commentRoutes from "./routes/comments.route.js"
// import commentRoutes from "./routes/comment.route.js"


dotenv.config()
const app = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())






app.use("/api/users", userRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/comments", commentRoutes)
// app.use("/api/comments", commentRoutes)
// app.use("/api", )




export default app