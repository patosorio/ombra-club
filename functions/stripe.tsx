import functions from "firebase-functions";
import admin from "firebase-admin";
const stripe = require("stripe")(functions.config().stripe.secret); // Ensure your Stripe secret key is correctly configured

admin.initializeApp();

exports.createCheckoutSession = functions.region("europe-west1").https.onCall(async (data, context) => {
    // Authentication check
    if (!context.auth) {
      throw new functions.https.HttpsError("failed-precondition", "Must be authenticated to initiate purchase.");
    }
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price: data.priceId,
          quantity: 1,
        }],
        mode: "subscription",
        success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: data.cancelUrl,
        customer_email: context.auth.token.email,
        client_reference_id: context.auth.uid,
      });
      console.log(session.url);
      return {url: session.url};
    } catch (error) {
      console.error("Checkout session creation failed:", error);
      throw new functions.https.HttpsError("internal", "Failed to create checkout session");
    }
});
  

exports.stripeWebhookHandler = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, functions.config().stripe.webhook_secret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "checkout.session.completed": {// You can keep this case if you specifically handle session completion
        const subscription = event.data.object;
        const uid = subscription.client_reference_id || subscription.metadata.firebaseUID;
        const subscriptionId = event.type === "checkout.session.completed" ? subscription.subscription : subscription.id;
        const isSubscribed = event.type !== "customer.subscription.deleted";
  
        try {
          await admin.firestore().collection("subscriptions").doc(uid).set({
            subscriptionId: subscriptionId,
            subscribed: isSubscribed,
          }, {merge: true});
          console.log(`Handled event ${event.type} for user ${uid}`);
          res.status(200).send("Success");
        } catch (error) {
          console.error("Firestore update error:", error);
          res.status(500).send("Internal Server Error");
        }
        break;
      }
      case "customer.subscription.deleted":
        // Handle subscription deletion
        break;
  
      default:
        console.log(`Unhandled event type ${event.type}`);
        res.json({received: true});
    }
});
  