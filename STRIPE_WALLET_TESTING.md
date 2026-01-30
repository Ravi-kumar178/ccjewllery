# Testing Apple Pay & Google Pay (Optional Address) from India

## What’s implemented

- **Optional address for Stripe:** For Stripe, only **email** is required.  
  If the customer pays with **Apple Pay** or **Google Pay**, the address can come from their wallet and does **not** need to be entered in the form.
- **Dual flow:**  
  - Customer can fill the full address form and pay with card or wallet.  
  - Or enter only email, pay with Apple Pay/Google Pay, and the address is taken from the wallet.

---

## How to test from India

### 1. Google Pay (easiest from India)

- **Browser:** Chrome on Windows, Mac, or Android.
- **Steps:**
  1. Use **Stripe test mode** (test keys in `.env`).
  2. Add a [Stripe test card](https://stripe.com/docs/testing#cards) to Google Pay (e.g. 4242 4242 4242 4242).
  3. On checkout: enter **only email**, select **Stripe** → payment options load.
  4. Choose **Google Pay** and complete payment. Address can come from your Google account.
- **Optional:** Register your site domain in [Stripe Dashboard → Settings → Payment methods → Google Pay](https://dashboard.stripe.com/settings/payment_methods) so Google Pay shows in the Payment Element.

### 2. Apple Pay (needs Apple device / Safari)

- **Where it works:** Safari on **macOS** or **iOS** (not on Windows/Android).
- **From India:**
  - **Option A:** Use a Mac or iPhone with Safari, Stripe test mode, and add a test card to Apple Wallet.
  - **Option B:** Use a cloud Mac (e.g. [BrowserStack](https://www.browserstack.com/) “Real Device” for Safari) and open your deployed site; add test card to Apple Pay and pay.
- **Stripe:** Register your domain in [Stripe Dashboard → Settings → Payment methods → Apple Pay](https://dashboard.stripe.com/settings/payment_methods).
- **Flow:** Enter only email → load Stripe → pay with Apple Pay → address from Apple Wallet is used.

### 3. Card-only test (no wallet)

- Enter **email + full address** in the form and pay with **Card** (test card 4242 4242 4242 4242).  
  Address is taken from the form as before.

---

## Quick checklist

| Item                         | Notes                                      |
|-----------------------------|--------------------------------------------|
| Stripe test keys            | Use in frontend and backend `.env`         |
| Domain verification (G Pay) | Stripe Dashboard → Google Pay → add domain |
| Domain verification (Apple) | Stripe Dashboard → Apple Pay → add domain |
| Safari for Apple Pay        | Required; use Mac, iPhone, or cloud Mac    |
| Only email for wallet flow  | No need to fill address when using wallet  |

---

## Backend behaviour

- **`POST /order/stripe`**  
  Accepts optional address. If address is omitted, order is created with placeholders and the Payment Intent is created **without** shipping so Stripe can collect it from Apple Pay/Google Pay.

- **`POST /order/confirmstripe`**  
  Accepts optional `shippingFromWallet` (and uses `paymentIntent.shipping` if present).  
  If present, the order’s address is updated from the wallet before sending confirmation emails.
