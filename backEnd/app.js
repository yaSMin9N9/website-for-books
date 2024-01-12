const express =require("express")
const connectDB =require("./config/connectToDb")
const authRoute =require("./router/authRouter")
const userRoute =require("./router/userRouter")
const postRoute =require("./router/postRouter")
const commentRouter =require("./router/commentRouter")
const categoriesRouter =require("./router/categoryRouter")
const cors =require("cors")
require("dotenv").config
connectDB()

const app =express()
app.use(cors({
    origin:"http://localhost:3000"
}))
app.use(express.json())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comment",commentRouter)
app.use("/api/categories", categoriesRouter);
const PORT =8000;
app.listen(PORT,()=> console.log(`server is running in ${PORT}`))