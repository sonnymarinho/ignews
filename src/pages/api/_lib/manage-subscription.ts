import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe.server";

export default async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  console.log("save process started");

  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  console.log("save process started 1");

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const [product] = subscription.items.data;

  console.log("save process started 3");

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: product.price.id,
  };

  console.log("save process started 3");

  await fauna.query(
    q.Create(q.Collection("subscriptions"), { data: subscriptionData })
  );

  console.log("save process finished");
}
