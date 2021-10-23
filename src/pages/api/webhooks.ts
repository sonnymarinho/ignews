import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe.server";
import STRIPE, { STRIPE_WEBHOOK_ACTIONS } from "./_config/stripe";
import saveSubscription from "./_lib/manage-subscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  STRIPE.WEB_HOOKS.CHECKOUT_SESSION_COMPLETED,
  STRIPE.WEB_HOOKS.SUBSCRIPTION_UPDATED,
  STRIPE.WEB_HOOKS.SUBSCRIPTION_DELETED,
]);

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

    if (relevantEvents.has(type as STRIPE_WEBHOOK_ACTIONS)) {
      try {
        switch (type) {
          case STRIPE.WEB_HOOKS.CHECKOUT_SESSION_COMPLETED:
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;

          case STRIPE.WEB_HOOKS.SUBSCRIPTION_UPDATED:
          case STRIPE.WEB_HOOKS.SUBSCRIPTION_DELETED:
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
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
