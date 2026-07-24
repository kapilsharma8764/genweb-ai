import express from "express"
import dotenv from "dotenv"
dotenv.config()
import path from "path"
import { fileURLToPath } from "url"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import websiteRouter from "./routes/website.routes.js"
import billingRouter from "./routes/billing.routes.js"
import { razorpayWebhook } from "./controllers/razorpayWebhook.controller.js"

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDistPath = path.resolve(__dirname, "../client/dist")

const port = process.env.PORT || 5000
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), razorpayWebhook)
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/website", websiteRouter)
app.use("/api/billing", billingRouter)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(clientDistPath))
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(clientDistPath, "index.html"))
    })
}

app.listen(port, () => {
    console.log(`server started on port ${port}`)
    connectDb()
})
