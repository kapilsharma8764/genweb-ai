import { PLANS } from "../config/plan.js"
import razorpay from "../config/razorpay.js"

export const billing = async (req, res) => {
    try {
        const { planType } = req.body
        const userId = req.user._id
        const plan = PLANS[planType]

        if (!plan || plan.price == 0) {
            return res.status(400).json({ message: "invalid paid plan" })
        }

        const order = await razorpay.orders.create({
            amount: plan.price * 100, // amount in paise (INR)
            currency: "INR",
            receipt: `receipt_${userId}_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                credits: plan.credits,
                plan: plan.plan
            }
        })

        return res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `billing error: ${error}` })
    }
}