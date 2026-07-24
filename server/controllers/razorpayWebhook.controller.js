import crypto from "crypto"
import User from "../models/user.model.js"

export const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
        const signature = req.headers["x-razorpay-signature"]

        if (!Buffer.isBuffer(req.body)) {
            return res.status(400).json({ message: "invalid webhook body" })
        }

        // Razorpay signs the exact raw request bytes.
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(req.body)
            .digest("hex")

        if (signature !== expectedSignature) {
            return res.status(400).json({ message: "invalid signature" })
        }

        const event = JSON.parse(req.body.toString("utf8"))

        // Payment captured = successful payment
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity
            const { userId, credits, plan } = payment.notes

            await User.findByIdAndUpdate(userId, {
                $inc: { credits: Number(credits) },
                plan: plan
            })

            console.log(`✅ Credits added: ${credits} to user: ${userId}`)
        }

        return res.status(200).json({ received: true })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "webhook error" })
    }
}
