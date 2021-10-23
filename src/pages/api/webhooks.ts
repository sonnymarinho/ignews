import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe.server";
import saveSubscription from "./_lib/manage-subscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set(["checkout.session.completed"]);

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const buff = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buff,
        secret,
        process.env.STRIPE_WEB_HOOK_SECRET
      );
    } catch (error) {
      console.error(error);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "checkout.session.completed":
            console.log("checkout session called");
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            );
            break;

          default:
            const error = new Error("Unhandled event.");
            console.error(error);

            throw error;
        }
      } catch (error) {
        console.error(error);
        return res.json({ error: "Webhook handler failed." });
      }
    }

    return res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
}
