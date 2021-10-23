export enum STRIPE_WEBHOOK_ACTIONS {
  CHECKOUT_SESSION_COMPLETED = "checkout.session.completed",
  SUBSCRIPTION_CREATED = "customer.subscription.created",
  SUBSCRIPTION_UPDATED = "customer.subscription.updated",
  SUBSCRIPTION_DELETED = "customer.subscription.deleted",
}

const STRIPE = {
  WEB_HOOKS: STRIPE_WEBHOOK_ACTIONS,
};

export default STRIPE;
