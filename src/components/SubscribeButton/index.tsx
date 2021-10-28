import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeServer } from "../../services/stripe.client";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  const router = useRouter();

  async function handleSubscribe() {
    debugger;

    if (!session) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data as any;

      const stripe = await getStripeServer();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe now
    </button>
  );
}
